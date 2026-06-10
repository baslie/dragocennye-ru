import type { Topic } from './types'
import { monoFont } from './format'

interface VarietyFilterProps {
  topics: Topic[]
  /** id активного вида либо null для «Все». */
  activeTopicId: string | null
  onFilter?: (varietyId: string | null) => void
}

const BASE_CHIP =
  'rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white'
const INACTIVE_CHIP =
  'border-stone-200 text-stone-600 hover:border-[#576A8F] hover:text-[#576A8F]'
const ACTIVE_CHIP = 'border-[#576A8F] bg-[#B7BDF7]/30 text-[#576A8F]'

/** Ряд чипов фильтра по виду камня. Первый чип «Все» сбрасывает фильтр. */
export function VarietyFilter({
  topics,
  activeTopicId,
  onFilter,
}: VarietyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <button
        type="button"
        onClick={() => onFilter?.(null)}
        className={`${BASE_CHIP} ${activeTopicId === null ? ACTIVE_CHIP : INACTIVE_CHIP}`}
        style={monoFont}
      >
        Все
      </button>
      {topics.map((topic) => {
        const isActive = topic.id === activeTopicId
        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onFilter?.(topic.id)}
            className={`${BASE_CHIP} ${isActive ? ACTIVE_CHIP : INACTIVE_CHIP}`}
            style={monoFont}
          >
            {topic.name}
          </button>
        )
      })}
    </div>
  )
}
