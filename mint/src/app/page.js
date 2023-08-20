import { getInactivePunks, getMintedPunks } from '../utils/reservations.js';
import { Background } from '../components/background.jsx';
import { LatestMints } from '../components/log.jsx';
import { Minter } from './minter.js';

export const revalidate = 0;

function bitwellPunksHeader() {
  return `
 ___ _ _              _ _   ___           _
| _ |_) |___ __ _____| | | | _ \\_  _ _ _ | |__ ___
| _ \\ |  _\\ V  V / -_) | | |  _/ || | ' \\| / /(_-<
|___/_|\\__|\\_/\\_/\\___|_|_| |_|  \\_,_|_||_|_\\_\\/__/
  `;
}

export default async function Home() {
  const inactivePunks = await getInactivePunks();
  const mintedPunks = await getMintedPunks();

  return (
    <main>
      <div className="flex justify-center mb-6 mt-12 font-main font-wrap text-start text-5xl text-orange-500 font-bold">
        Bitwell Punks
      </div>
      <Minter inactivePunks={inactivePunks} />
      <div className="w-screen flex justify-center items-start px-2 md:px-6 lg:px-12" style={{zIndex: 100}}>
        <LatestMints mintedPunks={mintedPunks} />
      </div>
      <div className="w-screen mt-36 flex justify-center items-start" style={{zIndex: 100}}>
        <Background />
      </div>
    </main>
  )
}
