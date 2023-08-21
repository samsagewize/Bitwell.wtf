import { NextResponse } from 'next/server';

import { validate as btc_validate } from 'bitcoin-address-validation';
import { Mempool } from 'btc-dapp-js';
import { minify } from 'html-minifier-terser';

import { BACKGROUND_INSCRIPTIONS } from '../../../config/backgrounds.js';
import { PUNK_INSCRIPTIONS } from '../../../config/punks.js';
import { DEFAULT_FILE_NAME, DEFAULT_ORDER_API, DEFAULT_REFERRAL_CODE, EXPIRATION_MS, NO_RARE_SATS } from '../../../config/ordinalsbot.js';
import { WHITELIST } from '../../../prisma/whitelist.mjs';
import { buildBitwellHtml, BITWELL_PRICE, BITWELL_WL_PRICE } from '../../../utils/collection.js';
import { b64encodedUrl } from '../../../utils/html.js';

import prisma from '../../../prisma/prisma.mjs';

const EPSILON = 1;
const NETWORK = 'mainnet';
const DEFAULT_INSCRIPTION_SPEED = 'halfHourFee';
const PRODUCTION = false;

export function validateBtcAddress(address) {
  if (!btc_validate(address, NETWORK)) {
    return false;
  }
  return true;
}

export async function POST(req) {
  try {
    const reservationRequest = await req.json();
    console.log(`Processing order: ${JSON.stringify(reservationRequest)}`);

    // Quickly validate the addresses again, rejecting if invalid
    const ordinalsAddr = reservationRequest.ordinalsAddr;
    if (!validateBtcAddress(ordinalsAddr)) {
      throw "Invalid Ordinals address";
    }
    if (!validateBtcAddress(reservationRequest.paymentAddr)) {
      throw "Invalid payment address";
    }

    // Validate that the user has good parameters
    const name = reservationRequest.punk;
    const punk = PUNK_INSCRIPTIONS[name];
    const backgroundName = reservationRequest.background;
    const background = BACKGROUND_INSCRIPTIONS[backgroundName];
    const wish = reservationRequest.wish;
    const password = reservationRequest.password;
    if (!punk) {
      throw `Could not find Bitwell '${name}'`;
    }
    if (!background) {
      throw `Could not find '${backgroundName}'`;
    }

    // Check if the punk has already been taken
    const isActivePredicate = {
      OR: [
        { minted: true },
        { created_at: { gt: new Date(new Date().getTime() - EXPIRATION_MS) } }
      ]
    };

    const validOrders = await prisma.bitwell.findMany({
      where: {
        AND: [
          isActivePredicate,
          {
            punk: punk
          }
        ]
      }
    });
    console.log(JSON.stringify(validOrders));
    if (validOrders.length > 0) {
      throw `Sorry, ${name} has already been reserved`;
    }

    // Put together an OrdinalsBot order and return the information for the user to send BTC to
    console.log(`Retrieving vbyte/sat for "${DEFAULT_INSCRIPTION_SPEED}"`);
    const fee = await Mempool.getFeesFor(DEFAULT_INSCRIPTION_SPEED) + EPSILON;

    // Get the discounts applicable, if any
    var discount = 0.0;
    const discounts = await prisma.discount.findUnique({
      where: {
        ordinals_addr: ordinalsAddr
      },
      include: {
        coupons: true
      }
    });
    if (discounts) {
      console.log(discounts.coupons);
      for (const coupon of discounts.coupons) {
        if (coupon.discount == 1 && !coupon.used) {
          discount = coupon.discount;
          break;
        }
      }
    }

    console.log(`Creating OrdinalsBot order for ${name} (${punk}) to ${ordinalsAddr}`);
    const rawHtml = buildBitwellHtml(name, background, punk, wish, password, PRODUCTION);
    const bitwellHtml = await minify(rawHtml, {
      caseSensitive: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      processScripts: ["module"]
    });
    const bitwellPriceWl = WHITELIST.includes(ordinalsAddr) ? BITWELL_WL_PRICE : BITWELL_PRICE;
    const bitwellPrice = bitwellPriceWl * (1 - discount);
    const orderSubmissionData = {
      files: [{
        name: DEFAULT_FILE_NAME,
        size: bitwellHtml.length,
        dataURL: b64encodedUrl(bitwellHtml)
      }],
      receiveAddress: ordinalsAddr,
      fee: fee,
      lowPostage: true,
      rareSats: NO_RARE_SATS,
      referral: DEFAULT_REFERRAL_CODE,
      additionalFee: bitwellPrice
    }

    console.log(JSON.stringify(orderSubmissionData));
    const orderSubmissionResp = await fetch(DEFAULT_ORDER_API, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderSubmissionData)
    })
    if (orderSubmissionResp.status !== 200) {
      throw `Could not submit order (${orderSubmissionResp.status}): ${orderSubmissionResp.statusText}`;
    }

    const orderSubmission = await orderSubmissionResp.json();
    console.log(JSON.stringify(orderSubmission));
    if (orderSubmission.status === 'error') {
      throw `Could not submit order: ${orderSubmission.error}`;
    }

    // Create a new reservation
    const reservationCreate = await prisma.bitwell.create({
      data: {
        payment_addr: reservationRequest.paymentAddr,
        ordinals_addr: ordinalsAddr,
        order_id: orderSubmission.charge.id,
        status: orderSubmission.charge.status,
        price: bitwellPrice,
        name: name,
        background: background,
        punk: punk,
        wish: (password ? 'REDACTED': wish)
      }
    });
    console.log(`Created a new reservation: ${JSON.stringify(reservationCreate)}`);

    // Consume one coupon from the user if available
    if (discounts) {
      for (const coupon of discounts.coupons) {
        if (coupon.used || coupon.discount != 1) {
          continue;
        }
        coupon.used = true;
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: coupon
        });
        break;
      }
    }

    return NextResponse.json(orderSubmission.charge, {status: 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({error: err}, {status: 500});
  }
}
