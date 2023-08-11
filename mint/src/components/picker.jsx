'use client';

import Image from 'next/image';

const INSCRIPTION_BASE = 'https://ordinals.com/content';

export const IMAGE_TYPE = 'image';
export const IFRAME_TYPE = 'iframe';

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
  const inscriptionsDoms = [];
  for (const key of Object.keys(inscriptions)) {
    const isSelected = (selectedAttribute === key);
    inscriptionsDoms.push(
      <div key={key} className={`p-2 cursor-pointer border-2 ${isSelected ? 'border-bitwell-blue' : 'border-transparent'}`} onClick={() => setSelectedAttribute(key)}>
        {componentFor(type, key, `${INSCRIPTION_BASE}/${inscriptions[key]}`)}
        <div className={`mt-2 ${isSelected ? 'font-bold' : ''}`}>
          {key}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center items-start text-center text-sm max-h-96 overflow-hidden overflow-scroll w-full gap-4">
      {inscriptionsDoms}
    </div>
  );
}
