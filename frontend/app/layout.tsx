import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skate Setups',
  description: 'Showcase of skateboard setups and shoes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  )
}
