"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const closeMenu = () => setMenuOpen(false)

  const NavLink = ({ href, children }) => {
    const isActive = pathname === href
    return (
      <Link href={href} className={isActive ? 'active' : ''} onClick={closeMenu}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <header className="header">
        <Link href="/" className="header-logo" onClick={closeMenu}>
          <span className="logo-icon">FC</span>
          <span>MyCalcFinance</span>
        </Link>
        <nav className={`header-nav \${menuOpen ? 'open' : ''}`}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/mortgage-calculator">Mortgage</NavLink>
          <NavLink href="/compound-interest-calculator">Investing</NavLink>
          <NavLink href="/retirement-calculator">Retirement</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <ThemeToggle />
        </nav>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      {menuOpen && <div className="mobile-menu-overlay" onClick={closeMenu} />}
    </>
  )
}
