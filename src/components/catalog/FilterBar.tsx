import { useEffect, useRef, useState, type ReactNode } from 'react'
import type {
  CatalogFilters,
  Color,
  Cut,
  Origin,
  SortOption,
  Treatment,
} from './types'

interface FilterBarProps {
  filters: CatalogFilters
  sort: SortOption
  colors: Color[]
  cuts: Cut[]
  origins: Origin[]
  treatments: Treatment[]
  totalCount: number
  onFilterChange?: (filters: CatalogFilters) => void
  onSortChange?: (sort: SortOption) => void
}

type ChipKey = 'color' | 'cut' | 'weight' | 'price' | 'origin' | 'treatment' | 'certificate' | 'sort'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Сначала новые',
  'price-asc': 'Цена ↑',
  'price-desc': 'Цена ↓',
  'weight-asc': 'Вес ↑',
  'weight-desc': 'Вес ↓',
}

const SORT_ORDER: SortOption[] = ['newest', 'price-asc', 'price-desc', 'weight-asc', 'weight-desc']

const formatRubles = (value: number) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽'

function Chip({
  label,
  value,
  isOpen,
  onToggle,
  children,
  align = 'left',
}: {
  label: string
  value: string | null
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`group inline-flex items-baseline gap-1.5 whitespace-nowrap border-b border-transparent py-1 text-[13px] transition-colors ${
          value
            ? 'border-[#576A8F] text-[#576A8F]'
            : isOpen
              ? 'border-stone-900 text-stone-900'
              : 'text-stone-700 hover:text-[#FF7444]'
        }`}
        style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
      >
        <span className="uppercase tracking-[0.08em]">{label}</span>
        {value && (
          <span
            className="text-[11px] normal-case text-stone-500"
            style={{
              fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
              letterSpacing: '0.02em',
            }}
          >
            {value}
          </span>
        )}
        <svg
          viewBox="0 0 12 12"
          className={`h-2.5 w-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M2 4.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div
          className={`absolute top-full z-30 mt-3 min-w-[220px] border border-stone-200 bg-white p-4 shadow-[0_20px_60px_-20px_rgba(15,15,20,0.25)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function MultiCheckList<T extends { id: string; name: string }>({
  items,
  selectedIds,
  onToggle,
  renderSwatch,
}: {
  items: T[]
  selectedIds: string[]
  onToggle: (id: string) => void
  renderSwatch?: (item: T) => ReactNode
}) {
  return (
    <ul className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
      {items.map((item) => {
        const checked = selectedIds.includes(item.id)
        return (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-2.5 py-1 text-[13px] text-stone-700 transition-colors hover:text-stone-900">
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors ${
                  checked ? 'border-[#576A8F] bg-[#576A8F]' : 'border-stone-300 bg-white'
                }`}
              >
                {checked && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onToggle(item.id)}
              />
              {renderSwatch?.(item)}
              <span style={{ fontFamily: "'Noto Sans', sans-serif" }}>{item.name}</span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}

function RangeInputs({
  value,
  onChange,
  placeholderMin,
  placeholderMax,
  suffix,
}: {
  value: [number, number] | null
  onChange: (value: [number, number] | null) => void
  placeholderMin: string
  placeholderMax: string
  suffix: string
}) {
  const [from, to] = value ?? [NaN, NaN]
  const parseNumber = (str: string): number => {
    const n = parseFloat(str.replace(',', '.'))
    return Number.isFinite(n) ? n : NaN
  }
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholderMin}
          defaultValue={Number.isFinite(from) ? String(from) : ''}
          onBlur={(e) => {
            const newFrom = parseNumber(e.target.value)
            const newTo = Number.isFinite(to) ? to : NaN
            if (Number.isFinite(newFrom) || Number.isFinite(newTo)) {
              onChange([
                Number.isFinite(newFrom) ? newFrom : 0,
                Number.isFinite(newTo) ? newTo : Number.POSITIVE_INFINITY,
              ])
            } else {
              onChange(null)
            }
          }}
          className="w-full border border-stone-200 bg-white px-2.5 py-1.5 text-[13px] text-stone-900 focus:border-[#576A8F] focus:outline-none"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        />
      </div>
      <span className="text-[11px] uppercase tracking-wider text-stone-400">до</span>
      <div className="flex-1">
        <input
          type="text"
          inputMode="decimal"
          placeholder={placeholderMax}
          defaultValue={Number.isFinite(to) ? String(to) : ''}
          onBlur={(e) => {
            const newTo = parseNumber(e.target.value)
            const newFrom = Number.isFinite(from) ? from : NaN
            if (Number.isFinite(newFrom) || Number.isFinite(newTo)) {
              onChange([
                Number.isFinite(newFrom) ? newFrom : 0,
                Number.isFinite(newTo) ? newTo : Number.POSITIVE_INFINITY,
              ])
            } else {
              onChange(null)
            }
          }}
          className="w-full border border-stone-200 bg-white px-2.5 py-1.5 text-[13px] text-stone-900 focus:border-[#576A8F] focus:outline-none"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        />
      </div>
      <span className="text-[11px] text-stone-400">{suffix}</span>
    </div>
  )
}

export function FilterBar({
  filters,
  sort,
  colors,
  cuts,
  origins,
  treatments,
  totalCount,
  onFilterChange,
  onSortChange,
}: FilterBarProps) {
  const [openChip, setOpenChip] = useState<ChipKey | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!openChip) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenChip(null)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [openChip])

  const toggle = (key: ChipKey) => setOpenChip((prev) => (prev === key ? null : key))
  const set = (patch: Partial<CatalogFilters>) =>
    onFilterChange?.({ ...filters, ...patch })

  const toggleArray = (list: string[], id: string): string[] =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

  const formatRangeValue = (
    value: [number, number] | null,
    suffix: string,
  ): string | null => {
    if (!value) return null
    const [a, b] = value
    const from = Number.isFinite(a) && a > 0 ? a : null
    const to = Number.isFinite(b) ? b : null
    if (!from && !to) return null
    if (from && to) return `${from}–${to} ${suffix}`
    if (from) return `от ${from} ${suffix}`
    return `до ${to} ${suffix}`
  }

  const colorValue =
    filters.colorIds.length > 0 ? String(filters.colorIds.length).padStart(2, '0') : null
  const cutValue =
    filters.cutIds.length > 0 ? String(filters.cutIds.length).padStart(2, '0') : null
  const originValue =
    filters.originIds.length > 0 ? String(filters.originIds.length).padStart(2, '0') : null
  const treatmentValue =
    filters.treatmentIds.length > 0 ? String(filters.treatmentIds.length).padStart(2, '0') : null
  const weightValue = formatRangeValue(filters.weightRange, 'ct')
  const priceValue = filters.priceRange
    ? (() => {
        const [a, b] = filters.priceRange
        const from = Number.isFinite(a) && a > 0 ? formatRubles(a) : null
        const to = Number.isFinite(b) ? formatRubles(b) : null
        if (from && to) return `${from} – ${to}`
        if (from) return `от ${from}`
        if (to) return `до ${to}`
        return null
      })()
    : null
  const certValue =
    filters.hasCertificate === true
      ? 'c'
      : filters.hasCertificate === false
        ? 'нет'
        : null

  const formattedCount =
    totalCount === 0
      ? 'ничего не найдено'
      : `${totalCount} ${pluralizeStones(totalCount)}`

  return (
    <div
      ref={ref}
      className="relative border-t border-b border-stone-200 bg-white"
    >
      <div className="flex items-center justify-between gap-4 py-3">
        {/* Chip row */}
        <div className="-mx-6 flex min-w-0 flex-1 items-center gap-5 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:gap-x-7 md:gap-y-2 md:overflow-visible md:px-0 lg:gap-x-8">
          <Chip
            label="Цвет"
            value={colorValue}
            isOpen={openChip === 'color'}
            onToggle={() => toggle('color')}
          >
            <MultiCheckList
              items={colors}
              selectedIds={filters.colorIds}
              onToggle={(id) => set({ colorIds: toggleArray(filters.colorIds, id) })}
              renderSwatch={(color) => (
                <span
                  className="h-3 w-3 shrink-0 border border-stone-200"
                  style={{
                    background: (color as Color).hex,
                    borderRadius: '50%',
                  }}
                  aria-hidden
                />
              )}
            />
          </Chip>

          <Chip
            label="Огранка"
            value={cutValue}
            isOpen={openChip === 'cut'}
            onToggle={() => toggle('cut')}
          >
            <MultiCheckList
              items={cuts}
              selectedIds={filters.cutIds}
              onToggle={(id) => set({ cutIds: toggleArray(filters.cutIds, id) })}
            />
          </Chip>

          <Chip
            label="Вес"
            value={weightValue}
            isOpen={openChip === 'weight'}
            onToggle={() => toggle('weight')}
          >
            <RangeInputs
              value={filters.weightRange}
              onChange={(value) => set({ weightRange: value })}
              placeholderMin="0,5"
              placeholderMax="10"
              suffix="ct"
            />
          </Chip>

          <Chip
            label="Цена"
            value={priceValue}
            isOpen={openChip === 'price'}
            onToggle={() => toggle('price')}
          >
            <RangeInputs
              value={filters.priceRange}
              onChange={(value) => set({ priceRange: value })}
              placeholderMin="5000"
              placeholderMax="100000"
              suffix="₽"
            />
          </Chip>

          <Chip
            label="Источник"
            value={originValue}
            isOpen={openChip === 'origin'}
            onToggle={() => toggle('origin')}
          >
            <MultiCheckList
              items={origins}
              selectedIds={filters.originIds}
              onToggle={(id) => set({ originIds: toggleArray(filters.originIds, id) })}
            />
          </Chip>

          <Chip
            label="Обработка"
            value={treatmentValue}
            isOpen={openChip === 'treatment'}
            onToggle={() => toggle('treatment')}
          >
            <MultiCheckList
              items={treatments}
              selectedIds={filters.treatmentIds}
              onToggle={(id) => set({ treatmentIds: toggleArray(filters.treatmentIds, id) })}
            />
          </Chip>

          <Chip
            label="Сертификат"
            value={certValue}
            isOpen={openChip === 'certificate'}
            onToggle={() => toggle('certificate')}
          >
            <div className="space-y-1.5">
              {[
                { value: null, label: 'Не важно' },
                { value: true, label: 'С сертификатом' },
                { value: false, label: 'Без сертификата' },
              ].map((opt) => {
                const active = filters.hasCertificate === opt.value
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => set({ hasCertificate: opt.value })}
                    className={`flex w-full items-center gap-2.5 py-1 text-left text-[13px] transition-colors ${
                      active ? 'text-[#576A8F]' : 'text-stone-700 hover:text-stone-900'
                    }`}
                    style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  >
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full border ${
                        active
                          ? 'border-[#576A8F] bg-[#576A8F] ring-2 ring-white ring-offset-[1px] ring-offset-[#576A8F]'
                          : 'border-stone-300 bg-white'
                      }`}
                    />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </Chip>
        </div>

        {/* Right: count + sort */}
        <div className="flex shrink-0 items-center gap-5 md:gap-7">
          <span
            className="hidden whitespace-nowrap text-[12px] text-stone-500 md:inline"
            style={{
              fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
              letterSpacing: '0.04em',
            }}
          >
            {formattedCount}
          </span>
          <Chip
            label="Сортировка"
            value={sort === 'newest' ? null : SORT_LABELS[sort]}
            isOpen={openChip === 'sort'}
            onToggle={() => toggle('sort')}
            align="right"
          >
            <ul className="space-y-1">
              {SORT_ORDER.map((option) => {
                const active = sort === option
                return (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        onSortChange?.(option)
                        setOpenChip(null)
                      }}
                      className={`flex w-full items-center justify-between gap-4 py-1 text-left text-[13px] transition-colors ${
                        active ? 'text-[#576A8F]' : 'text-stone-700 hover:text-stone-900'
                      }`}
                      style={{ fontFamily: "'Noto Sans', sans-serif" }}
                    >
                      <span>{SORT_LABELS[option]}</span>
                      {active && (
                        <span
                          className="text-[10px] uppercase tracking-wider text-[#576A8F]"
                          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Chip>
        </div>
      </div>
    </div>
  )
}

function pluralizeStones(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'камень'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'камня'
  return 'камней'
}
