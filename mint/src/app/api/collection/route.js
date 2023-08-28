import { NextResponse } from 'next/server';

import prisma from '../../../prisma/prisma.mjs';

export const revalidate = 60;

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
        punk: true,
        wish: true
      }
    });
    const metadata = inscriptions.map(inscription => {
      return {
        id: inscription.inscription,
        meta: {
          name: `Bitwell ${inscription.name}`,
          attributes: [
            {
              trait_type: 'Background',
              value: inscription.background
            },
            {
              trait_type: 'Wish',
              value: inscription.wish
            }
          ]
        }
      }
    });
    return NextResponse.json(metadata, {status: 200, statusText: `Currently inscribed pieces in the collection`});
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, {status: 500, statusText: `An error occurred: ${JSON.stringify(err)}`});
  }
}
