import type { StoneCard } from './types'
import { StonePhoto } from '../common/StonePhoto'
import { formatPrice, formatWeight, monoFont, sansFont } from './format'

interface BlogStoneCardProps {
  stone: StoneCard
  onClick?: () => void
}

/**
 * Карточка камня для live-блока «Камни из этой статьи».
 * Градиентный «самоцвет» (StonePhoto по accentHex) + <img> поверх при наличии фото.
 */
export function BlogStoneCard({ stone, onClick }: BlogStoneCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col text-left transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
        <StonePhoto
          src={stone.photoUrl}
          alt={stone.name}
          accentHex={stone.accentHex ?? '#B7BDF7'}
          className="h-full w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
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
