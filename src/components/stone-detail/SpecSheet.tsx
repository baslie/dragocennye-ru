import type { ReactNode } from 'react'
import type {
  Color,
  Cut,
  Origin,
  StoneDetail,
  Treatment,
} from './types'

interface SpecSheetProps {
  stone: StoneDetail
  cut: Cut
  origin: Origin
  treatment: Treatment
  color: Color
}

const formatWeight = (v: number) => v.toFixed(2).replace('.', ',') + ' ct'

export function SpecSheet({ stone, cut, origin, treatment, color }: SpecSheetProps) {
  const rows: Array<{ label: string; value: ReactNode }> = [
    { label: 'Вес', value: formatWeight(stone.weightCt) },
    { label: 'Размеры', value: `${stone.dimensionsMm} мм` },
    { label: 'Огранка', value: cut.name },
    {
      label: 'Цвет',
      value: (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-3 w-3 rounded-full border border-stone-300"
            style={{ backgroundColor: color.hex }}
          />
          {color.name}
        </span>
      ),
    },
    { label: 'Происхождение', value: origin.country },
    { label: 'Обработка', value: treatment.name },
    { label: 'Чистота', value: stone.characteristics.clarity },
    { label: 'Блеск', value: stone.characteristics.luster },
    { label: 'Твёрдость', value: stone.characteristics.hardness },
    { label: 'Показатель преломления', value: stone.characteristics.refractiveIndex },
  ]

  return (
    <section
      className="mt-16 border-t border-stone-200 pt-10 md:mt-20 md:pt-12"
      aria-labelledby="spec-sheet-heading"
    >
      <div className="flex items-center gap-4">
        <h2
          id="spec-sheet-heading"
          className="text-[11px] uppercase tracking-[0.25em] text-[#576A8F] md:text-xs"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          Паспорт
        </h2>
        <div aria-hidden className="h-px flex-1 bg-stone-200" />
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label}>
            <dt
              className="text-[10px] uppercase tracking-[0.22em] text-stone-400"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              {r.label}
            </dt>
            <dd
              className="mt-2 text-base text-stone-900 md:text-[17px]"
              style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
