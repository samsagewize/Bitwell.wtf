import { NextResponse } from 'next/server';

import prisma from '../../../../prisma/prisma.mjs';

import { WEBHOOK_URL } from '../../../../config/discord.js';
import { DEFAULT_ORDER_API } from '../../../../config/ordinalsbot.js';

export const revalidate = 0;

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const HALF_SEC_MS = 500;
const BACKOFF_MS = 5 * HALF_SEC_MS;

export async function GET() {
  try {
    const paidOrders = await prisma.bitwell.findMany({
      where: {
        minted: true,
        inscription: ''
      }
    });

    var updatedOrderNum = 0;
    for (const paidOrder of paidOrders) {
      await sleep(HALF_SEC_MS);
      const paidOrderStatusReq = await fetch(`${DEFAULT_ORDER_API}?id=${paidOrder.order_id}`);
      if (paidOrderStatusReq.status !== 200) {
        console.error(`Could not retrieve order status for order "${paidOrder.id}" (${paidOrderStatusReq.status}): ${paidOrderStatusReq.statusText}`);
        await sleep(BACKOFF_MS);
        continue;
      }
      const paidOrderStatus = await paidOrderStatusReq.json();
      const inscription = paidOrderStatus.files[0].tx?.inscription;
      if (!inscription) {
        continue;
      }
      const updatedOrders = await prisma.bitwell.update({
        where: { id: paidOrder.id },
        data: {
          inscription: inscription,
          updated_at: new Date()
       }
      });
      console.log(JSON.stringify(updatedOrders));
      if (updatedOrders.length !== 1) {
        console.error(`Could not update order status for order #${paidOrder.id}`);
      }
      updatedOrderNum++;
      console.log(`Found paid order #${paidOrder.id} has inscription "${inscription}"`);
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({content: `Bitwell ${paidOrder.name} just inscribed to ${inscription}`})
      });
    }

    console.log(`Successfully updated ${updatedOrderNum} orders`);
    return NextResponse.json({updatedOrders: updatedOrderNum}, {status: 200, statusText: `Successfully updated ${updatedOrderNum} orders`});
  } catch (err) {
    console.error(JSON.stringify(err));
    return NextResponse.json(err, {status: 500, statusText: err});
  }
}
