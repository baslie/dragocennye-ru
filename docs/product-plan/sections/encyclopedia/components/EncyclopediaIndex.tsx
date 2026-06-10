import type { EncyclopediaIndexProps } from '../types'
import { VarietyCard } from './VarietyCard'

const sansFont = { fontFamily: "'Noto Sans', sans-serif" } as const
const monoFont = { fontFamily: "'Noto Sans Mono', ui-monospace, monospace" } as const

const INTRO_PARAGRAPH_1 =
  'Здесь Дмитрий Салятов собирает знания о камнях так, как их различает гемолог: по минералогическим классам, а не по маркетинговым ярлыкам. Каждая статья — о виде: откуда он родом, какими бывают цвета и огранки, на что смотреть при оценке и какие детали в коллекционном камне действительно важны.'

const INTRO_PARAGRAPH_2 =
  'Энциклопедия идёт рядом с каталогом. Из любого раздела можно сразу перейти к позициям, которые сейчас есть в коллекции, — справочник не отделён от камней, а объясняет именно те экземпляры, которые лежат в витрине.'

export function EncyclopediaIndex({
  varieties,
  onSelectVariety,
  onBrowseInCatalog,
}: EncyclopediaIndexProps) {
  return (
    <div className="pt-10 pb-24 md:pt-14">
      <header className="mb-16 md:mb-24">
        <p
          className="mb-4 text-xs uppercase tracking-wider text-[#576A8F]"
          style={monoFont}
        >
          Справочник коллекционера
        </p>
        <h1
          className="text-4xl font-medium text-stone-900 md:text-5xl xl:text-6xl"
          style={sansFont}
        >
          Энциклопедия камней
        </h1>
        <div
          className="mt-8 max-w-[72ch] space-y-5 text-lg leading-relaxed text-stone-700"
          style={sansFont}
        >
          <p>{INTRO_PARAGRAPH_1}</p>
          <p>{INTRO_PARAGRAPH_2}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
        {varieties.map((variety) => (
          <VarietyCard
            key={variety.id}
            variety={variety}
            onSelect={() => onSelectVariety?.(variety.id)}
            onBrowseInCatalog={() => onBrowseInCatalog?.(variety.id)}
          />
        ))}
      </section>
    </div>
  )
}
