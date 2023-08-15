'use client';

import Image from 'next/image';

import { useState } from 'react';
import { Wallets } from 'btc-dapp-js';

import { b64encodedUrl } from '../utils/html.js';
import { buildBitwellHtml } from '../utils/collection.js';
import { SimpleButton } from '../components/buttons.jsx';
import { CheckboxWithLabel } from '../components/input.jsx';
import { Section } from '../components/section.jsx';
import { InscriptionPicker, IMAGE_TYPE, IFRAME_TYPE } from '../components/picker.jsx';
import { BACKGROUND_INSCRIPTIONS } from '../config/backgrounds.js';
import { PUNK_INSCRIPTIONS } from '../config/punks.js';
import { UNPAID } from '../config/ordinalsbot.js';

const PREVIEW = true;

const SATS_TO_BTC = 100000000;

async function performMintTxn(background, punk, wish, wallet, setStatusMessage) {
  try {
    const ordinalsAddr = await Wallets.getWalletAddress(wallet, Wallets.ORDINALS_TYPE);
    const paymentAddr = await Wallets.getWalletAddress(wallet, Wallets.ORDINALS_TYPE);
    const orderResponse = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ordinalsAddr: ordinalsAddr,
        paymentAddr: paymentAddr,
        background: background,
        punk: punk,
        wish: wish
      })
    });

    if (orderResponse.status !== 200) {
      throw {error: orderResponse.statusText};
    }

    const orderInfo = await orderResponse.json();
    if (orderInfo.status !== UNPAID) {
      throw orderInfo;
    }

    const btcAmount = parseInt(orderInfo.amount) / SATS_TO_BTC;
    setStatusMessage(`Awaiting payment of ${btcAmount}BTC to '${orderInfo.address}' to complete order...`);
    await Wallets.sendBtc(wallet, orderInfo.address, orderInfo.amount);
    setStatusMessage(`Sent ${btcAmount}BTC to '${orderInfo.address}'! Your inscription should arrive shortly.`);
  } catch (err) {
    setStatusMessage(`An error occurred: ${JSON.stringify(err)}`);
  }
}

function getDefaultPunk(punkInscriptions, inactivePunks) {
  for (const punkInscription of Object.keys(punkInscriptions)) {
    if (!inactivePunks.includes(punkInscription)) {
      return punkInscription;
    }
  }
}

export function Minter({ inactivePunks }) {
  const [background, setBackground] = useState(Object.keys(BACKGROUND_INSCRIPTIONS)[0]);
  const [punk, setPunk] = useState(getDefaultPunk(PUNK_INSCRIPTIONS, inactivePunks));
  const [wish, setWish] = useState('');

  const [wallet, setWallet] = useState(Wallets.XVERSE_WALLET);
  const [isMinting, setIsMinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [BACKGROUND_STAGE, PUNK_STAGE, WISH_STAGE] = [1, 2, 3];
  const [currentExpanded, setCurrentExpanded] = useState(BACKGROUND_STAGE);

  return (
    <div className="flex flex-wrap justify-center gap-4 w-screen p-4">
      <div className="border-x-2 border-x-bitwell-blue md:w-[60%] min-w-[50%]">
        <Section isExpanded={currentExpanded == BACKGROUND_STAGE} onClick={() => setCurrentExpanded(BACKGROUND_STAGE)} label="Step 1: Choose Your Background">
          <InscriptionPicker type={IFRAME_TYPE} selectedAttribute={background} setSelectedAttribute={setBackground} inscriptions={BACKGROUND_INSCRIPTIONS} inactive={[]}/>
        </Section>
        <Section isExpanded={currentExpanded == PUNK_STAGE} onClick={() => setCurrentExpanded(PUNK_STAGE)} label="Step 2: Choose Your Punk">
          <InscriptionPicker type={IMAGE_TYPE} selectedAttribute={punk} setSelectedAttribute={setPunk} inscriptions={PUNK_INSCRIPTIONS} inactive={inactivePunks} />
        </Section>
        <Section isExpanded={currentExpanded == WISH_STAGE} onClick={() => setCurrentExpanded(WISH_STAGE)} label="Step 3: Write Your Wish">
          <div className="block w-full">
            <div className="mb-4">
              <input type="text" value={wish} onInput={e => setWish(e.target.value)} className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Enter your wish here..." />
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <p class="text-sm text-gray-500">Select your wallet provider</p>
                <div className="flex gap-3">
                  <CheckboxWithLabel name="wallet" label={Wallets.HIRO_WALLET} checked={wallet === Wallets.HIRO_WALLET} onChange={() => setWallet(Wallets.HIRO_WALLET)} />
                  <CheckboxWithLabel name="wallet" label={Wallets.UNISAT_WALLET} checked={wallet === Wallets.UNISAT_WALLET} onChange={() => setWallet(Wallets.UNISAT_WALLET)} />
                  <CheckboxWithLabel name="wallet" label={Wallets.XVERSE_WALLET} checked={wallet === Wallets.XVERSE_WALLET} onChange={() => setWallet(Wallets.XVERSE_WALLET)} />
                </div>
              </div>
              <SimpleButton label="MINT NOW" disabled={isMinting} onClick={async () => {
                  setIsMinting(true);
                  try {
                    await performMintTxn(background, punk, wish, wallet, setStatusMessage);
                  } finally {
                    setIsMinting(false);
                  }
              }} />
            </div>
            <div className="text-sm text-gray-500 italic">
              {statusMessage}
            </div>
          </div>
        </Section>
      </div>
      <div className="w-fit min-w-[33%]">
        <iframe className="mx-auto h-full aspect-square border-2 border-bitwell-blue" sandbox="allow-scripts" src={b64encodedUrl(buildBitwellHtml(punk, BACKGROUND_INSCRIPTIONS[background], PUNK_INSCRIPTIONS[punk], wish, PREVIEW))} />
      </div>
    </div>
  );
}
