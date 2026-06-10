import type { StoneVariety } from '../types'

interface VarietyTabsProps {
  varieties: StoneVariety[]
  activeVarietyId: string | null
  totalCount: number
  onSelect?: (varietyId: string | null) => void
}

const ALL_TAB_GRADIENT =
  'conic-gradient(from 200deg at 50% 50%, #FF7444 0deg, #FFF8DE 90deg, #B7BDF7 200deg, #576A8F 320deg, #FF7444 360deg)'

interface TabProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  orb?: React.ReactNode
}

function Tab({ label, count, isActive, onClick, orb }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex shrink-0 snap-start flex-col items-center gap-2 text-center focus:outline-none"
      aria-pressed={isActive}
    >
      <div
        className={`relative h-16 w-16 overflow-hidden rounded-full transition-all duration-300 md:h-[76px] md:w-[76px] ${
          isActive
            ? 'ring-[2.5px] ring-[#576A8F] ring-offset-[5px] ring-offset-white'
            : 'ring-1 ring-stone-200 ring-offset-0 group-hover:ring-[#FF7444] group-hover:ring-offset-[3px] group-hover:ring-offset-white'
        }`}
      >
        {orb}
      </div>
      <span
        className={`text-[11px] transition-colors duration-200 md:text-xs ${
          isActive ? 'text-[#576A8F]' : 'text-stone-700 group-hover:text-[#FF7444]'
        }`}
        style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: isActive ? 600 : 500,
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
      <span
        className="-mt-1 text-[10px] text-stone-400"
        style={{
          fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
          letterSpacing: '0.08em',
        }}
      >
        {count.toString().padStart(3, '0')}
      </span>
    </button>
  )
}

function varietyOrb(variety: StoneVariety) {
  const accentLetter = variety.name.charAt(0).toUpperCase()
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundImage: `
          radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9) 0%, transparent 22%),
          radial-gradient(ellipse 70% 60% at 50% 55%, #E8DDCB 0%, #D6C9B2 60%, #A89B83 100%)
        `,
      }}
    >
      <span
        className="relative text-[24px] text-stone-900/85 md:text-[26px]"
        style={{
          fontFamily: "'Noto Sans', serif",
          fontWeight: 300,
          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {accentLetter}
      </span>
    </div>
  )
}

export function VarietyTabs({
  varieties,
  activeVarietyId,
  totalCount,
  onSelect,
}: VarietyTabsProps) {
  return (
    <div className="relative">
      <div className="-mx-6 flex gap-4 overflow-x-auto scroll-smooth px-6 pb-3 md:mx-0 md:flex-wrap md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6">
        <Tab
          label="Все"
          count={totalCount}
          isActive={activeVarietyId === null}
          onClick={() => onSelect?.(null)}
          orb={
            <div
              className="absolute inset-0"
              style={{ backgroundImage: ALL_TAB_GRADIENT }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 35% 32%, rgba(255,255,255,0.7) 0%, transparent 35%)',
                }}
              />
            </div>
          }
        />
        {varieties.map((variety) => (
          <Tab
            key={variety.id}
            label={variety.name}
            count={variety.stoneCount}
            isActive={activeVarietyId === variety.id}
            onClick={() => onSelect?.(variety.id)}
            orb={varietyOrb(variety)}
          />
        ))}
      </div>
    </div>
  )
}
