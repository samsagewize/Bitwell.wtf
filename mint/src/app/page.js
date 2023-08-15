import { getInactivePunks } from '../utils/reservations.js';
import { Background } from './background.js';
import { Minter } from './minter.js';

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

  return (
    <main>
      <Background />
      <div className="absolute top-0 left-0 w-screen h-screen" style={{zIndex: 200}}>
        <pre className="flex justify-center font-mono font-wrap text-start text-xs md:text-md lg:text-xl font-bold">
          {bitwellPunksHeader()}
        </pre>
        <Minter inactivePunks={inactivePunks} />
      </div>
    </main>
  )
}
