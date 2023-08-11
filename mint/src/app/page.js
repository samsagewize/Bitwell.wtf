'use client';

import Image from 'next/image';

import { useRef, useEffect, useState } from 'react';

import { instantiateBackground } from '../utils/background.js';
import { b64encodedUrl } from '../utils/html.js';
import { Section } from '../components/section.jsx';
import { InscriptionPicker, IMAGE_TYPE, IFRAME_TYPE } from '../components/picker.jsx';
import { BACKGROUND_INSCRIPTIONS } from '../config/backgrounds.js';
import { PUNK_INSCRIPTIONS } from '../config/punks.js';

const CANVAS_DIM = 400;
const PREVIEW = false;

function buildPunksHtml(background, punk, wish, preview) {
  return ``
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

  const [background, setBackground] = useState('');
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
              Wish writing...
            </Section>
          </div>
          <div className="border-2 border-bitwell-blue w-fit min-w-[33%]">
            <iframe className="max-w-full h-full" sandbox="allow-scripts" src={b64encodedUrl(buildPunksHtml(background, punk, wish, PREVIEW))} />
          </div>
        </div>
      </div>
    </main>
  )
}
