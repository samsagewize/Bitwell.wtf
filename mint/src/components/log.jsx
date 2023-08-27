import Image from 'next/image';

import { INSCRIPTION_CDN } from '../config/ordinals.js';

export function LatestMints({ mintedPunks }) {
  const latestMints = [];
  let isFirst = true;
  for (const mintedPunk of mintedPunks) {
    latestMints.push(
      <div key={mintedPunk.inscription} className={`max-w-[8rem] md:max-w-[14rem] truncate justify-center text-black items-center align-center py-4`}>
        <div className="w-full max-w-[8rem] md:max-w-[14rem]">
          {mintedPunk.inscription ?
            <iframe className="border-none w-full aspect-square" src={`${INSCRIPTION_CDN}/${mintedPunk.inscription}`} /> :
            <Image src="/icon.png" width="200" height="200" alt="Inscription processing..." /> }
        </div>
        <div className="text-lg text-start font-bold mt-1" style={{textWrap: 'wrap'}}>
          Bitwell {mintedPunk.name}
        </div>
        <div className="text-start truncate">
          <div className="truncate text-sm md:text-md">
            {mintedPunk.inscription ?
              <a href={`https://ord.io/${mintedPunk.inscription}`} target="_blank">{mintedPunk.inscription}</a> :
             'Processing, please wait up to 24 hours for inscription to arrive at the address below'
            }
          </div>
          <div className="truncate text-gray-400 text-sm italic mt-1">
            <a href={`https://ord.io/${mintedPunk.ordinals_addr}`} target="_blank">
              {mintedPunk.ordinals_addr}
            </a>
          </div>
        </div>
        <div className="text-start text-gray-400 text-sm" style={{textWrap: 'wrap'}}>
          {mintedPunk.updated_at.toLocaleString()}
        </div>
      </div>
    );
    isFirst = false;
  }
  return (
    <div className="text-center w-fit">
      <div className="font-main font-wrap text-center text-3xl text-black py-2 border-b-2 border-black">
        Latest Mints
      </div>
      <div className="flex flex-wrap gap-4 md:gap-8 justify-center items-start">
        {latestMints}
      </div>
    </div>
  )
}
