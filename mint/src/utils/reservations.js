import prisma from '../prisma/prisma.mjs';

import { EXPIRATION_MS } from '../config/ordinalsbot.js';

export async function getInactivePunks() {
  const mintedOrReserved = await prisma.bitwell.findMany({
    where: {
      OR: [
        { minted: true },
        { created_at: { gt: new Date(new Date().getTime() - EXPIRATION_MS) } }
      ]
    },
    select: {
      name: true
    }
  });
  return mintedOrReserved.map(el => el.name);
}
