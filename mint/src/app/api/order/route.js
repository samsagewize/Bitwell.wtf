import { NextResponse } from 'next/server';

import { validate as btc_validate } from 'bitcoin-address-validation';
import { Mempool } from 'btc-dapp-js';

import { BACKGROUND_INSCRIPTIONS } from '../../../config/backgrounds.js';
import { PUNK_INSCRIPTIONS } from '../../../config/punks.js';
import { DEFAULT_FILE_NAME, DEFAULT_ORDER_API, DEFAULT_REFERRAL_CODE, EXPIRATION_MS, NO_RARE_SATS } from '../../../config/ordinalsbot.js';
import { buildBitwellHtml, getBitwellPrice } from '../../../utils/collection.js';
import { b64encodedUrl } from '../../../utils/html.js';

import prisma from '../../../prisma/prisma.mjs';

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
      return NextResponse.json("failure", {status: 400, statusText: "Invalid Ordinals address"});
    }
    if (!validateBtcAddress(reservationRequest.paymentAddr)) {
      return NextResponse.json("failure", {status: 400, statusText: "Invalid payment address"});
    }

    // Validate that the user has good parameters
    const name = reservationRequest.punk;
    const punk = PUNK_INSCRIPTIONS[name];
    const backgroundName = reservationRequest.background;
    const background = BACKGROUND_INSCRIPTIONS[backgroundName];
    const wish = reservationRequest.wish;
    if (!punk) {
      return NextResponse.json("failure", {status: 400, statusText: `Could not find Bitwell '${name}'`});
    }
    if (!background) {
      return NextResponse.json("failure", {status: 400, statusText: `Could not find '${backgroundName}'`});
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
    if (validOrders.length > 0) {
      throw `Sorry, ${name} has already been reserved`;
    }

    // Put together an OrdinalsBot order and return the information for the user to send BTC to
    console.log(`Retrieving vbyte/sat for "${DEFAULT_INSCRIPTION_SPEED}"`);
    const fee = await Mempool.getFeesFor(DEFAULT_INSCRIPTION_SPEED);

    console.log(`Creating OrdinalsBot order for ${name} (${punk}) to ${ordinalsAddr}`);
    const bitwellHtml = buildBitwellHtml(name, background, punk, wish, PRODUCTION);
    const bitwellPrice = getBitwellPrice(ordinalsAddr);
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
        wish: wish
      }
    });
    console.log(`Created a new reservation: ${JSON.stringify(reservationCreate)}`);
    return NextResponse.json(orderSubmission.charge, {status: 200, statusText: `Successfully reserved ${name}`});
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, {status: 500, statusText: `An error occurred: ${JSON.stringify(err)}`});
  }
}
