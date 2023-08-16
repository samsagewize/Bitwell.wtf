import prisma from './prisma.mjs'

import { FREE_MINT, WHITELIST } from './whitelist.mjs'

function addDiscountTo(address, addresses, discount) {
  if (!(address in addresses)) {
    addresses[address] = {
      ordinals_addr: address,
      coupons: {
        create: []
      }
    }
  }
  addresses[address].coupons.create.push({
    discount: discount
  });
}

async function main() {
  const addresses = {};
  for (const address of FREE_MINT) {
    addDiscountTo(address, addresses, 1.0);
  }
  for (const address of WHITELIST) {
    addDiscountTo(address, addresses, 0.5);
  }
  for (const address in addresses) {
    await prisma.discount.create({ data: addresses[address] });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
