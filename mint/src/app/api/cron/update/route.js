import { NextResponse } from 'next/server';

import prisma from '../../../../prisma/prisma.mjs';

import { DEFAULT_ORDER_API, EXPIRATION_MS, UNPAID, PAID } from '../../../../config/ordinalsbot.js';

export const revalidate = 0;

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const HALF_SEC_MS = 500;
const BACKOFF_MS = 5 * HALF_SEC_MS;

export async function GET() {
  try {
    const unpaidOrders = await prisma.bitwell.findMany({
      where: {
        minted: false,
        created_at: {
          gt: new Date(new Date().getTime() - EXPIRATION_MS)
        }
      }
    });

    var updatedOrderNum = 0;
    for (const unpaidOrder of unpaidOrders) {
      await sleep(HALF_SEC_MS);
      const unpaidOrderStatusReq = await fetch(`${DEFAULT_ORDER_API}?id=${unpaidOrder.order_id}`);
      if (unpaidOrderStatusReq.status !== 200) {
        console.error(`Could not retrieve order status for order "${unpaidOrder.id}" (${unpaidOrderStatusReq.status}): ${unpaidOrderStatusReq.statusText}`);
        await sleep(BACKOFF_MS);
        continue;
      }
      const unpaidOrderStatus = await unpaidOrderStatusReq.json();
      if (!unpaidOrderStatus.paid) {
        continue;
      }
      const inscription = unpaidOrderStatus.files[0].tx?.inscription;
      const updatedOrders = await prisma.bitwell.update({
        where: { id: unpaidOrder.id },
        data: {
          minted: true,
          status: PAID,
          inscription: (inscription || ''),
          updated_at: new Date()
       }
      });
      console.log(JSON.stringify(updatedOrders));
      if (updatedOrders.length !== 1) {
        console.error(`Could not update order status for order #${unpaidOrder.id}`);
      }
      updatedOrderNum++;
      console.log(`Minted order #${unpaidOrder.id} with inscription "${inscription}"`);
    }

    console.log(`Successfully updated ${updatedOrderNum} orders`);
    return NextResponse.json({updatedOrders: updatedOrderNum}, {status: 200, statusText: `Successfully updated ${updatedOrderNum} orders`});
  } catch (err) {
    console.error(JSON.stringify(err));
    return NextResponse.json(err, {status: 500, statusText: err});
  }
}
