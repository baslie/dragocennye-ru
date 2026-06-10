import { Search } from 'lucide-react'

interface HeaderActionsProps {
  onSearch?: () => void
  variant?: 'hero' | 'compact'
}

export function HeaderActions({ onSearch, variant = 'hero' }: HeaderActionsProps) {
  const isHero = variant === 'hero'
  const iconSize = isHero ? 20 : 18

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onSearch}
        className="text-stone-600 hover:text-[#FF7444] transition-colors"
        aria-label="Поиск"
      >
        <Search size={iconSize} strokeWidth={1.75} />
      </button>
    </div>
  )
}
