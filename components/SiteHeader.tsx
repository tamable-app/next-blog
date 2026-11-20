'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BLOG_PATH, SERIES_PATH } from '@tamable/blog-kit'
import site from '@/site.config'
import ThemeToggle from './ThemeToggle'
import styles from './SiteHeader.module.css'

// Every blog page lives under /blog, so Blog stays current on series and tag pages too.
const links = [
  { label: 'Blog', href: BLOG_PATH, sections: [BLOG_PATH] },
  { label: 'Series', href: SERIES_PATH, sections: [SERIES_PATH] },
  { label: 'About', href: '/about', sections: ['/about'] },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const isCurrent = (sections: string[]) =>
    sections.some(section => pathname === section || pathname.startsWith(`${section}/`))
  // On /blog/series both Blog and Series light up; only the closer one is announced as the current page.
  const closest = links.filter(link => isCurrent(link.sections)).at(-1)

  return (
    <header className={`${styles.header} container`}>
      <Link href="/" className={styles.home}>{site.name}</Link>
      <nav aria-label="Main" className={styles.nav}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isCurrent(link.sections) ? styles.current : ''}`}
            aria-current={link === closest ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
