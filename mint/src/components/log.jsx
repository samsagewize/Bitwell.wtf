import { INSCRIPTION_CDN } from '../config/ordinals.js';

export function LatestMints({ mintedPunks }) {
  const latestMints = [];
  for (const mintedPunk of mintedPunks) {
    latestMints.push(
      <div key={mintedPunk.inscription} className="flex justify-between text-black gap-4 items-center align-center py-2 border-b-2 border-gray-300">
        <div className="w-1/12">
          <iframe className="border-none w-full aspect-square" src={`${INSCRIPTION_CDN}/${mintedPunk.inscription}`} />
        </div>
        <div className="text-xl font-bold">
          Bitwell {mintedPunk.name}
        </div>
        <div className="break-all">
          <div className="text-lg">
            {mintedPunk.inscription}
          </div>
          <div className="text-gray-400 text-sm italic">
            {mintedPunk.ordinals_addr}
          </div>
        </div>
        <div className="text-sm">
          {mintedPunk.updated_at.toLocaleString()}
        </div>
      </div>
    );
  }
  return (
    <div className="px-2">
      <div className="font-main font-wrap text-center text-3xl text-black border-black border-b-2 py-2">
        Latest Mints
      </div>
      {latestMints}
    </div>
  )
}
