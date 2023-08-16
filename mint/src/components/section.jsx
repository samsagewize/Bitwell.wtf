'use client';

import Image from 'next/image';

import { useState } from 'react';

export function Section({ isExpanded, onClick, label, children }) {
  return (
    <div className="text-white text-lg bg-bitwell-purple border-t-2 border-t-white">
      <div className="p-2 flex justify-between gap-8 border-b-2 border-b-white select-none cursor-pointer" onClick={onClick}>
        {label}
        <div className="font-bold flex items-center justify-center p-1">
          <Image src={`/${isExpanded ? 'down_arrow' : 'left_arrow'}.png`} width={18} height={18} alt={isExpanded ? 'collapse' : 'expand'} style={{imageRendering: 'pixelated'}} />
        </div>
      </div>
      <div className={`flex p-4 gap-4 ${isExpanded ? '' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}
