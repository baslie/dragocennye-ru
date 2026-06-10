import type { StoneCard } from '../types'
import { formatPrice, formatWeight, hideBrokenImage, monoFont, sansFont } from './format'

interface BlogStoneCardProps {
  stone: StoneCard
  onClick?: () => void
}

/**
 * Карточка камня для live-блока «Камни из этой статьи».
 * Градиентный «самоцвет» как в Catalog Browse + <img> поверх при наличии фото.
 */
export function BlogStoneCard({ stone, onClick }: BlogStoneCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col text-left transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 65% 55% at 50% 42%, #B7BDF7D9 0%, #B7BDF766 28%, #B7BDF71A 55%, transparent 78%),
              radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, transparent 14%),
              radial-gradient(circle at 68% 74%, rgba(255,255,255,0.35) 0%, transparent 22%),
              linear-gradient(160deg, #FAFAF7 0%, #F3F1EC 100%)
            `,
          }}
        />
        <img
          src={stone.photoUrl}
          alt={stone.name}
          onError={hideBrokenImage}
          className="relative h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <h3
        className="mt-4 text-base leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F]"
        style={{ ...sansFont, fontWeight: 500 }}
      >
        {stone.name}
      </h3>
      <p
        className="mt-auto pt-1 text-xs uppercase tracking-wider text-stone-500"
        style={monoFont}
      >
        <span>{formatWeight(stone.weightCt)}</span>
        <span> · </span>
        <span className="transition-colors duration-200 group-hover:text-[#FF7444]">
          {formatPrice(stone.price)}
        </span>
      </p>
    </button>
  )
}
