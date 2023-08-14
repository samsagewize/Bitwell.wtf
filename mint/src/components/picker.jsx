'use client';

import Image from 'next/image';

import { useState } from 'react';

import { INSCRIPTION_CDN } from '../config/ordinals.js';

export const IMAGE_TYPE = 'image';
export const IFRAME_TYPE = 'iframe';

const INSCRIPTIONS_PER_PAGE = 500;

function componentFor(type, label, src) {
  if (type === IMAGE_TYPE) {
    return (
      <Image src={src} width={100} height={100} alt={label} style={{imageRendering: 'pixelated'}} />
    )
  } else if (type === IFRAME_TYPE) {
    return (
      <iframe src={src} style={{width: 200}} />
    )
  }
}

export function InscriptionPicker({ type, inscriptions, selectedAttribute, setSelectedAttribute }) {
  const [page, setPage] = useState(1);

  const inscriptionNames = Object.keys(inscriptions);
  const maxPages = Math.ceil(inscriptionNames.length / INSCRIPTIONS_PER_PAGE);
  const currentMin = (page - 1) * INSCRIPTIONS_PER_PAGE;
  const currentMax = page * INSCRIPTIONS_PER_PAGE;
  const inscriptionsDoms = [];
  for (const key of inscriptionNames.slice(currentMin, currentMax)) {
    const isSelected = (selectedAttribute === key);
    inscriptionsDoms.push(
      <div key={key} className={`p-2 cursor-pointer border-2 ${isSelected ? 'border-bitwell-blue' : 'border-transparent'}`} onClick={() => setSelectedAttribute(key)}>
        {componentFor(type, key, `${INSCRIPTION_CDN}/${inscriptions[key]}`)}
        <div className={`mt-2 ${isSelected ? 'font-bold' : ''}`}>
          {key}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center items-start text-center text-sm max-h-96 overflow-hidden overflow-scroll w-full gap-4">
        {inscriptionsDoms}
      </div>
      {maxPages > 1 ? (
        <div className="flex justify-center gap-8 mt-2">
          <div className={`${page > 1 ? 'text-black' : 'text-gray-400'} select-none cursor-pointer`} onClick={() => setPage(Math.max(1, page - 1))}>
            &lt;
          </div>
          <div>
            {page}
          </div>
          <div className={`${page < maxPages ? 'text-black' : 'text-gray-400'} select-none cursor-pointer`} onClick={() => setPage(Math.min(maxPages, page + 1))}>
            &gt;
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
