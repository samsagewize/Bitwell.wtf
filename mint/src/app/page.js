'use client';

import Image from 'next/image';

import { useRef, useEffect, useState } from 'react';

import { instantiateBackground } from '../utils/background.js';
import { b64encodedUrl } from '../utils/html.js';
import { Section } from '../components/section.jsx';
import { InscriptionPicker, IMAGE_TYPE, IFRAME_TYPE } from '../components/picker.jsx';
import { BACKGROUND_INSCRIPTIONS } from '../config/backgrounds.js';
import { INSCRIPTION_CDN } from '../config/ordinals.js';
import { PUNK_INSCRIPTIONS } from '../config/punks.js';

const CANVAS_DIM = 400;
const PREVIEW = true;

const JQUERY_INSCRIPTION = '773e4865bcf3084e6d6ee5d49136fb5f7071d4c050ec4aeeaeb9c6d24fea5fc1i0';

function buildPunksHtml(name, background, punk, wish, preview) {
  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bitwell ${name}</title>
      ${preview ? `<base href=${(typeof window !== "undefined") ? window.location : null}>` : ''}
    </head>
    <body style="margin: 0px;">
      <iframe src="${preview ? INSCRIPTION_CDN : '/content'}/${background}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10"></iframe>
      <img src="${preview ? INSCRIPTION_CDN : '/content'}/${punk}" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:20;image-rendering:pixelated" />
      <div id="wish" style="font-size:1.5rem;position:absolute;text-align:center;width:100%;height:auto;top:10;font-weight:bold;z-index:20;color:white;">
        ${wish}
      </div>
      <script type="module">
        const JQUERY_INSCRIPTION = '${JQUERY_INSCRIPTION}';
        const jqueryResponse = await fetch(\`${preview ? INSCRIPTION_CDN : '/content'}/\${JQUERY_INSCRIPTION}\`);
        eval(await jqueryResponse.text());
        $('body').click(() => $('#wish').show(0, () => setTimeout(() => $('#wish').fadeOut(3000), 5000)));
        $('#wish').fadeOut(3000);
      </script>
    </body>
  </html>`;
}

function bitwellPunksHeader() {
  return `
 ___ _ _              _ _   ___           _
| _ |_) |___ __ _____| | | | _ \\_  _ _ _ | |__ ___
| _ \\ |  _\\ V  V / -_) | | |  _/ || | ' \\| / /(_-<
|___/_|\\__|\\_/\\_/\\___|_|_| |_|  \\_,_|_||_|_\\_\\/__/
  `;
}

export default function Home() {
  const canvasRef = useRef();

  const [background, setBackground] = useState(Object.keys(BACKGROUND_INSCRIPTIONS)[0]);
  const [punk, setPunk] = useState('');
  const [wish, setWish] = useState('');

  const [BACKGROUND_STAGE, PUNK_STAGE, WISH_STAGE] = [1, 2, 3];
  const [currentExpanded, setCurrentExpanded] = useState(BACKGROUND_STAGE);

  useEffect(() => {
    instantiateBackground(canvasRef, CANVAS_DIM);
  }, []);

  return (
    <main>
      <div className="absolute top-0 left-0 w-screen h-screen" style={{zIndex: 100}}>
        <canvas ref={canvasRef} className="w-full h-full" width={CANVAS_DIM} height={CANVAS_DIM}></canvas>
      </div>
      <div className="absolute top-0 left-0 w-screen h-screen" style={{zIndex: 200}}>
        <pre className="flex justify-center font-mono font-wrap text-start text-xs md:text-md lg:text-xl font-bold">
          {bitwellPunksHeader()}
        </pre>
        <div className="flex flex-wrap justify-center gap-4 w-screen p-4">
          <div className="border-x-2 border-x-bitwell-blue md:w-[60%] min-w-[50%]">
            <Section isExpanded={currentExpanded == BACKGROUND_STAGE} onClick={() => setCurrentExpanded(BACKGROUND_STAGE)} label="Step 1: Choose Your Background">
              <InscriptionPicker type={IFRAME_TYPE} selectedAttribute={background} setSelectedAttribute={setBackground} inscriptions={BACKGROUND_INSCRIPTIONS} />
            </Section>
            <Section isExpanded={currentExpanded == PUNK_STAGE} onClick={() => setCurrentExpanded(PUNK_STAGE)} label="Step 2: Choose Your Punk">
              <InscriptionPicker type={IMAGE_TYPE} selectedAttribute={punk} setSelectedAttribute={setPunk} inscriptions={PUNK_INSCRIPTIONS} />
            </Section>
            <Section isExpanded={currentExpanded == WISH_STAGE} onClick={() => setCurrentExpanded(WISH_STAGE)} label="Step 3: Write Your Wish">
              <input type="text" value={wish} onInput={e => setWish(e.target.value)} class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2" placeholder="Enter your wish here..." />
            </Section>
          </div>
          <div className="w-fit min-w-[33%]">
            <iframe className="mx-auto h-full aspect-square border-2 border-bitwell-blue" sandbox="allow-scripts" src={b64encodedUrl(buildPunksHtml(punk, BACKGROUND_INSCRIPTIONS[background], PUNK_INSCRIPTIONS[punk], wish, PREVIEW))} />
          </div>
        </div>
      </div>
    </main>
  )
}
