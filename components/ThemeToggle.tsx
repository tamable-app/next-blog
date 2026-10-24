'use client'

import { useEffect, useRef } from 'react'
import styles from './ThemeToggle.module.css'

type Theme = 'light' | 'dark'

function current(): Theme {
  const chosen = document.documentElement.dataset.theme
  if (chosen === 'light' || chosen === 'dark') return chosen
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function label(button: HTMLButtonElement | null, theme: Theme) {
  button?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
}

// The icon and label show the theme a click switches to. CSS picks the icon, so it is right before hydration.
export default function ThemeToggle() {
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => label(button.current, current()), [])

  function toggle() {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    label(button.current, next)
    try {
      localStorage.setItem('theme', next)
    }
    catch {
      // Private windows may refuse storage; the choice still holds until reload.
    }
  }

  return (
    <button ref={button} type="button" className={styles.toggle} aria-label="Switch theme" onClick={toggle}>
      <svg className={styles.sun} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      <svg className={styles.moon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
    </button>
  )
}
