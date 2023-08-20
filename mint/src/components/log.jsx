import Image from 'next/image';

import { INSCRIPTION_CDN } from '../config/ordinals.js';

export function LatestMints({ mintedPunks }) {
  const latestMints = [];
  let isFirst = true;
  for (const mintedPunk of mintedPunks) {
    latestMints.push(
      <div key={mintedPunk.inscription} className={`mx-auto flex truncate justify-center w-fit max-w-full text-black items-center align-center py-4 gap-8 border-t-2 ${isFirst ? 'border-black' : 'border-gray-300'}`}>
        <div className="w-fit max-w-[5rem]">
          {mintedPunk.inscription ?
            <iframe className="border-none w-full aspect-square" src={`${INSCRIPTION_CDN}/${mintedPunk.inscription}`} /> :
            <Image src="/icon.png" width="100" height="100" alt="Inscription processing..." /> }
        </div>
        <div className="w-fit text-xl font-bold" style={{textWrap: 'wrap'}}>
          Bitwell {mintedPunk.name}
        </div>
        <div className="w-min text-start truncate">
          <div className="truncate text-sm md:text-lg">
            {mintedPunk.inscription ?
              <a href={`https://ord.io/${mintedPunk.inscription}`} target="_blank">{mintedPunk.inscription}</a> :
             'Processing, please wait up to 24 hours for inscription to arrive at the address below'
            }
          </div>
          <div className="truncate text-gray-400 text-sm italic">
            <a href={`https://ord.io/${mintedPunk.ordinals_addr}`} target="_blank">
              {mintedPunk.ordinals_addr}
            </a>
          </div>
        </div>
        <div className="w-min text-sm" style={{textWrap: 'wrap'}}>
          {mintedPunk.updated_at.toLocaleString()}
        </div>
      </div>
    );
    isFirst = false;
  }
  return (
    <div className="text-center w-full">
      <div className="font-main font-wrap text-center text-3xl text-black py-2">
        Latest Mints
      </div>
      {latestMints}
    </div>
  )
}
