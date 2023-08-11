'use client';

import { useState } from 'react';

export function SectionHeader({ isExpanded, onClick, children }) {
  return (
    <div className="text-black text-lg bg-white border-t-2 border-t-bitwell-blue">
      <div className="p-2 flex justify-between gap-8 border-b-2 border-b-bitwell-blue" onClick={onClick}>
        {children}
        <div className="font-bold cursor-pointer">
          {isExpanded ? '▼' : '◀'}
        </div>
      </div>
      <div className={`flex p-4 gap-4 ${isExpanded ? '' : 'hidden'}`}>
        Selections go here...
      </div>
    </div>
  )
}
