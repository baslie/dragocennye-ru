import type { TimelineItem } from './types'
import { monoFont, sansFont } from './format'

interface TimelineProps {
  items: TimelineItem[]
}

/** Вертикальный таймлайн «Образование и опыт» с левой линией и маркерами-точками. */
export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="space-y-10 border-l border-stone-200 pl-8">
      {items.map((item, index) => (
        <li key={index} className="relative">
          <span
            aria-hidden
            className="absolute -left-[37px] top-1.5 h-2 w-2 rounded-full bg-[#576A8F]"
          />
          <p
            className="text-xs uppercase tracking-wider text-[#576A8F]"
            style={monoFont}
          >
            {item.year}
          </p>
          <h3
            className="mt-1 text-lg font-medium text-stone-900"
            style={sansFont}
          >
            {item.title}
          </h3>
          <p
            className="mt-1 text-base leading-relaxed text-stone-600"
            style={sansFont}
          >
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  )
}
