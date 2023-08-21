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

export async function getMintedPunks(limit) {
  return await prisma.bitwell.findMany({
    where: {
      minted: true
    },
    select: {
      name: true,
      background: true,
      punk: true,
      wish: true,
      inscription: true,
      ordinals_addr: true,
      updated_at: true
    },
    orderBy: {
      updated_at: 'desc'
    },
    take: limit
  });
}

export async function getMintedCount() {
  return await prisma.bitwell.count({
    where: {
      minted: true
    }
  })
}
