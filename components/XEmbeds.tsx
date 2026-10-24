'use client'

import { useEffect } from 'react'

// X's script turns the fallback blockquotes into embeds; it only loads on posts that have one.
export default function XEmbeds() {
  useEffect(() => {
    const quotes = document.querySelectorAll<HTMLElement>('.prose blockquote.twitter-tweet')
    if (!quotes.length) return
    const root = document.documentElement
    const light = root.dataset.theme === 'light'
      || (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: light)').matches)
    quotes.forEach((quote) => {
      quote.dataset.theme = light ? 'light' : 'dark'
      quote.dataset.dnt = 'true'
    })
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return null
}
