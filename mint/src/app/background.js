'use client';

import { useRef, useEffect } from 'react';

import { instantiateBackground } from '../utils/background.js';

const CANVAS_DIM = 400;

export function Background() {
  const canvasRef = useRef();

  useEffect(() => {
    instantiateBackground(canvasRef, CANVAS_DIM);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen" style={{zIndex: 100}}>
      <canvas ref={canvasRef} className="w-full h-full" width={CANVAS_DIM} height={CANVAS_DIM}></canvas>
    </div>
  );
}
