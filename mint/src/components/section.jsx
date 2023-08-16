'use client';

import { useState } from 'react';

export function Section({ isExpanded, onClick, label, children }) {
  return (
    <div className="text-white text-lg bg-bitwell-purple border-t-2 border-t-white">
      <div className="p-2 flex justify-between gap-8 border-b-2 border-b-white select-none cursor-pointer" onClick={onClick}>
        {label}
        <div className="font-bold">
          {isExpanded ? '▼' : '◀'}
        </div>
      </div>
      <div className={`flex p-4 gap-4 ${isExpanded ? '' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}
