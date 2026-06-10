import type { MouseEvent } from 'react'
import type { StoneVariety } from '../types'

interface VarietyCardProps {
  variety: StoneVariety
  onSelect?: () => void
  onBrowseInCatalog?: () => void
}

const sansFont = { fontFamily: "'Noto Sans', sans-serif" } as const
const monoFont = { fontFamily: "'Noto Sans Mono', ui-monospace, monospace" } as const

function formatStoneCount(count: number): string {
  const mod100 = count % 100
  const mod10 = count % 10
  let word: string
  if (mod10 === 1 && mod100 !== 11) word = 'камень'
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = 'камня'
  else word = 'камней'
  return `${count} ${word} в коллекции`
}

export function VarietyCard({ variety, onSelect, onBrowseInCatalog }: VarietyCardProps) {
  const handleCounterClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onBrowseInCatalog?.()
  }

  const handleImgError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none'
  }

  return (
    <article
      onClick={onSelect}
      className="group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 45%, #B7BDF733 0%, transparent 70%),
            linear-gradient(160deg, #FAFAF7 0%, #F3F1EC 100%)
          `,
        }}
      >
        <img
          src={variety.coverPhotoUrl}
          alt={variety.name}
          onError={handleImgError}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-4 top-4 text-[10px] uppercase tracking-[0.22em] text-stone-500"
          style={monoFont}
        >
          №{variety.slug}
        </div>
      </div>

      <p
        className="mt-5 text-xs uppercase tracking-wider text-stone-500"
        style={monoFont}
      >
        {variety.classLabel}
      </p>

      <h3
        className="mt-2 text-2xl font-medium text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F] md:text-3xl"
        style={sansFont}
      >
        {variety.name}
      </h3>

      <p
        className="mt-3 line-clamp-3 text-base leading-relaxed text-stone-700"
        style={sansFont}
      >
        {variety.teaser}
      </p>

      <div
        className="mt-6 flex items-center gap-4 text-xs uppercase tracking-wider"
        style={monoFont}
      >
        <button
          type="button"
          onClick={handleCounterClick}
          className="text-[#576A8F] transition-colors hover:text-[#FF7444] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {formatStoneCount(variety.stoneCount)}
        </button>
        <span className="ml-auto text-stone-500 transition-colors group-hover:text-[#FF7444]">
          Читать →
        </span>
      </div>
    </article>
  )
}
