import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { siteUrl } from '@/lib/site'
import site from '@/site.config'
import './tokens.css'
import './base.css'
import './prose.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  twitter: {
    card: 'summary',
    site: site.links.x ? `@${site.links.x}` : undefined,
    creator: site.links.x ? `@${site.links.x}` : undefined,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

// Applies a saved theme before first paint, so a light-theme visitor never sees a dark flash.
const themeScript = 'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale} className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
