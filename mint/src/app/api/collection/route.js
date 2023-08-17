import { NextResponse } from 'next/server';

import prisma from '../../../prisma/prisma.mjs';

export async function GET() {
  try {
    const inscriptions = await prisma.bitwell.findMany({
      where: {
        minted: true
      },
      select: {
        inscription: true,
        name: true,
        background: true,
        punk: true
      }
    })
    return NextResponse.json(inscriptions, {status: 200, statusText: `Currently inscribed pieces in the collection`});
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, {status: 500, statusText: `An error occurred: ${JSON.stringify(err)}`});
  }
}
