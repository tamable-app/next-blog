'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import site from '@/site.config'
import ThemeToggle from './ThemeToggle'
import styles from './SiteHeader.module.css'

const links = [
  { label: 'Blog', href: '/blog', sections: ['/blog', '/tags'] },
  { label: 'Series', href: '/series', sections: ['/series'] },
  { label: 'About', href: '/about', sections: ['/about'] },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const isCurrent = (sections: string[]) =>
    sections.some(section => pathname === section || pathname.startsWith(`${section}/`))

  return (
    <header className={`${styles.header} container`}>
      <Link href="/" className={styles.home}>{site.name}</Link>
      <nav aria-label="Main" className={styles.nav}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.link} ${isCurrent(link.sections) ? styles.current : ''}`}
            aria-current={isCurrent(link.sections) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
