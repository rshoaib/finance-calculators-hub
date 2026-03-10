"use client"
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true) // default to dark
  const [mounted, setMounted] = useState(false)

  // Read from localStorage only on the client
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    if (saved) {
      setDark(saved === 'dark')
    }
  }, [])

  // Sync to localStorage and DOM when theme changes
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark, mounted])

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Loading theme..." disabled>
        <Moon size={18} style={{ opacity: 0 }} />
      </button>
    )
  }

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark(d => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
