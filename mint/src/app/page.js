'use client';

import Image from 'next/image';

import { useRef, useEffect, useState } from 'react';

import { instantiateBackground } from '../utils/background.js';
import { b64encodedUrl } from '../utils/html.js';
import { SectionHeader } from '../components/sections.jsx';

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
        <pre className="flex justify-center font-mono font-wrap text-start text-xs md:text-md lg:text-xl font-bold p-4">
          {bitwellPunksHeader()}
        </pre>
        <div className="flex flex-wrap justify-center gap-4 w-screen">
          <div className="border-x-2 border-x-bitwell-blue w-fit min-w-[50%]">
            <SectionHeader isExpanded={currentExpanded == BACKGROUND_STAGE} onClick={() => setCurrentExpanded(BACKGROUND_STAGE)}>
              Step 1: Choose Your Background
            </SectionHeader>
            <SectionHeader isExpanded={currentExpanded == PUNK_STAGE} onClick={() => setCurrentExpanded(PUNK_STAGE)}>
              Step 2: Choose Your Punk
            </SectionHeader>
            <SectionHeader isExpanded={currentExpanded == WISH_STAGE} onClick={() => setCurrentExpanded(WISH_STAGE)}>
              Step 3: Write Your Wish
            </SectionHeader>
          </div>
          <div className="border-2 border-bitwell-blue w-fit min-w-[33%]">
            <iframe className="max-w-full h-full" sandbox="allow-scripts" src={b64encodedUrl(buildPunksHtml(background, punk, wish, PREVIEW))} />
          </div>
        </div>
      </div>
    </main>
  )
}
