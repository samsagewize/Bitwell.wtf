import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bitwell Punks',
  description: 'Mint your wish, bitch.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bitwell-light-blue`}>{children}</body>
    </html>
  )
}
