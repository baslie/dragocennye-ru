import { useState, useEffect, type ReactNode } from 'react'
import { MainNav, type NavItem } from './MainNav'
import { HeaderActions } from './HeaderActions'

interface AppShellProps {
  children: ReactNode
  navigationItems: NavItem[]
  onNavigate?: (href: string) => void
  onSearch?: () => void
}

export function AppShell({
  children,
  navigationItems,
  onNavigate,
  onSearch,
}: AppShellProps) {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 120)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate?.('/')
  }

  return (
    <div
      className="min-h-screen bg-white text-stone-900"
      style={{ fontFamily: "'Noto Sans', system-ui, sans-serif" }}
    >
      {/* Editorial hero header — scrolls away naturally */}
      <header className="pt-10 md:pt-14 pb-8 md:pb-12">
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="flex justify-end">
            <HeaderActions onSearch={onSearch} variant="hero" />
          </div>

          <div className="text-center mt-8 md:mt-12">
            <a
              href="/"
              onClick={handleLogoClick}
              className="inline-block text-stone-900 hover:text-[#576A8F] transition-colors"
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[0.12em]"
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              >
                ДРАГОЦЕННЫЕ
              </h1>
            </a>
            <p
              className="mt-3 md:mt-4 text-[11px] md:text-xs tracking-[0.25em] uppercase text-[#576A8F] hidden sm:block"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              коллекция цветных камней
            </p>
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <MainNav items={navigationItems} onNavigate={onNavigate} variant="hero" />
          </div>
        </div>
      </header>

      {/* Sticky compact header — appears on scroll past 120px */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 transition-all duration-300 ${
          isCompact
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20 h-16 flex items-center justify-between gap-6">
          <a
            href="/"
            onClick={handleLogoClick}
            className="text-stone-900 hover:text-[#576A8F] transition-colors text-sm md:text-base font-medium tracking-[0.15em] shrink-0"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          >
            ДРАГОЦЕННЫЕ
          </a>

          <div className="hidden md:flex flex-1 justify-center">
            <MainNav items={navigationItems} onNavigate={onNavigate} variant="compact" />
          </div>

          <HeaderActions onSearch={onSearch} variant="compact" />
        </div>
      </header>

      {/* Content area */}
      <main className="max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20 pb-20">{children}</main>
    </div>
  )
}
