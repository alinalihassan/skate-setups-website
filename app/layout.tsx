import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var hash = window.location.hash;
                if (hash) {
                  document.documentElement.style.scrollBehavior = 'auto';
                  var el = document.getElementById(hash.slice(1));
                  if (el) {
                    el.scrollIntoView();
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
