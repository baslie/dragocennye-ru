import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  isActive?: boolean
  children?: Array<{ label: string; href: string }>
}

interface MainNavProps {
  items: NavItem[]
  onNavigate?: (href: string) => void
  variant?: 'hero' | 'compact'
}

export function MainNav({ items, onNavigate, variant = 'hero' }: MainNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHero = variant === 'hero'
  const gapClass = isHero ? 'gap-8 md:gap-12' : 'gap-5 md:gap-7'
  const textClass = isHero ? 'text-base md:text-[15px]' : 'text-sm'

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    onNavigate?.(href)
    setOpenDropdown(null)
  }

  const toggleDropdown = (href: string) => {
    setOpenDropdown((prev) => (prev === href ? null : href))
  }

  return (
    <nav
      ref={navRef}
      className={`flex items-center ${gapClass} ${textClass} text-stone-700`}
      style={{ fontFamily: "'Noto Sans', sans-serif" }}
    >
      {items.map((item) => {
        const isOpen = openDropdown === item.href
        const hasChildren = Boolean(item.children && item.children.length > 0)

        return (
          <div key={item.href} className="relative">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleDropdown(item.href)}
                onMouseEnter={() => setOpenDropdown(item.href)}
                className={`flex items-center gap-1 transition-colors hover:text-[#FF7444] ${
                  item.isActive ? 'text-[#576A8F] font-medium' : ''
                }`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
              >
                {item.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            ) : (
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`transition-colors hover:text-[#FF7444] ${
                  item.isActive ? 'text-[#576A8F] font-medium' : ''
                }`}
              >
                {item.label}
              </a>
            )}

            {hasChildren && isOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-3 bg-white border border-stone-200 rounded-2xl p-2 shadow-lg shadow-stone-900/5 min-w-[200px] z-50"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children!.map((child) => (
                  <a
                    key={child.href}
                    href={child.href}
                    onClick={(e) => handleLinkClick(e, child.href)}
                    className="block px-4 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-[#B7BDF7]/25 hover:text-[#576A8F] transition-colors"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
