import type { StoneCard } from '../types'
import { BlogStoneCard } from './BlogStoneCard'
import { monoFont, sansFont } from './format'

interface MentionedStonesProps {
  stones: StoneCard[]
  onViewStone?: (stoneId: string) => void
  onBrowseInCatalog?: () => void
}

/**
 * Live-блок «Камни из этой статьи» — до 5 карточек упомянутых камней в наличии + CTA.
 * Вызывающая сторона отвечает за скрытие блока при пустом массиве.
 */
export function MentionedStones({
  stones,
  onViewStone,
  onBrowseInCatalog,
}: MentionedStonesProps) {
  const visible = stones.slice(0, 5)

  return (
    <section className="mt-20 md:mt-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="text-xs uppercase tracking-wider text-[#576A8F]"
            style={monoFont}
          >
            Из коллекции
          </p>
          <h2
            className="mt-2 text-3xl font-medium text-stone-900 md:text-4xl"
            style={sansFont}
          >
            Камни из этой статьи
          </h2>
        </div>
        <p
          className="text-xs uppercase tracking-wider text-stone-500"
          style={monoFont}
        >
          {visible.length} в наличии
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((stone) => (
          <BlogStoneCard
            key={stone.id}
            stone={stone}
            onClick={() => onViewStone?.(stone.id)}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={onBrowseInCatalog}
          className="rounded-lg border border-[#576A8F] px-8 py-4 text-sm uppercase tracking-wider text-[#576A8F] transition-colors hover:bg-[#576A8F] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={monoFont}
        >
          Смотреть в каталоге
        </button>
      </div>
    </section>
  )
}
