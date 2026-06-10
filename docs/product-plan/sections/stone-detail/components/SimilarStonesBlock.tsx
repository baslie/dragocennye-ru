import type {
  SimilarStoneCard,
  StoneVariety,
} from '../types'

interface SimilarStonesBlockProps {
  stones: SimilarStoneCard[]
  variety: StoneVariety
  onSelect?: (stoneId: string) => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
const formatWeight = (v: number) => v.toFixed(2).replace('.', ',') + ' ct'

const nameColorMap: Array<{ keyword: RegExp; hex: string }> = [
  { keyword: /зел|цавор|вердел/i, hex: '#4F8A5C' },
  { keyword: /син|голуб|параиб|танзан/i, hex: '#2E5E8A' },
  { keyword: /роз|родолит|рубеллит/i, hex: '#D87AA0' },
  { keyword: /жёлт|желт|золот|цитр|гелиодор/i, hex: '#E8C547' },
  { keyword: /бел/i, hex: '#E5E2D6' },
  { keyword: /фиолет|амет/i, hex: '#7B4E9E' },
  { keyword: /оранж|падпарадж|огнен|спессартин/i, hex: '#E88A47' },
  { keyword: /красн|рубин/i, hex: '#B83A3A' },
]
const pickHex = (name: string) =>
  nameColorMap.find((m) => m.keyword.test(name))?.hex ?? '#B7BDF7'

export function SimilarStonesBlock({ stones, variety, onSelect }: SimilarStonesBlockProps) {
  if (stones.length === 0) return null

  return (
    <section className="mt-24 md:mt-32" aria-labelledby="similar-heading">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.25em] text-[#576A8F] md:text-xs"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            подборка
          </p>
          <h2
            id="similar-heading"
            className="mt-3 text-2xl text-stone-900 md:text-3xl lg:text-4xl"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500, letterSpacing: '-0.01em' }}
          >
            Похожие {variety.pluralName}
          </h2>
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.22em] text-stone-400 md:text-[11px]"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            другие камни того же вида в коллекции
          </p>
        </div>
        <div aria-hidden className="hidden h-px flex-1 translate-y-[-8px] bg-stone-200 md:block" />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4 lg:gap-x-7 xl:grid-cols-5 xl:gap-x-8">
        {stones.map((s) => (
          <SimilarCard
            key={s.id}
            stone={s}
            subtleLabel={variety.name.toLowerCase()}
            onClick={() => onSelect?.(s.id)}
          />
        ))}
      </div>
    </section>
  )
}

interface SimilarCardProps {
  stone: SimilarStoneCard
  subtleLabel: string
  onClick?: () => void
}

function SimilarCard({ stone, subtleLabel, onClick }: SimilarCardProps) {
  const inventoryCode = stone.id.replace('st-', '').toUpperCase()
  const accentHex = pickHex(stone.name)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-stone-200 bg-stone-50 transition-transform duration-500 group-hover:-translate-y-0.5">
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 65% 55% at 50% 42%, ${accentHex}D9 0%, ${accentHex}66 28%, ${accentHex}1A 55%, transparent 78%),
              radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, transparent 14%),
              radial-gradient(circle at 68% 74%, rgba(255,255,255,0.35) 0%, transparent 22%),
              linear-gradient(160deg, #FAFAF7 0%, #F3F1EC 100%)
            `,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(115deg, transparent 48%, rgba(255,255,255,0.6) 50%, transparent 52%),
              linear-gradient(60deg, transparent 48%, rgba(255,255,255,0.3) 50%, transparent 52%)
            `,
          }}
        />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-stone-500"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            №{inventoryCode}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-4">
        <h3
          className="text-[15px] leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F] md:text-base"
          style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
        >
          {stone.name}
        </h3>
        <span
          className="text-[11px] uppercase tracking-[0.18em] text-stone-400"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          {subtleLabel}
        </span>
        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-stone-100 pt-2">
          <span
            className="text-xs text-stone-500"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            {formatWeight(stone.weightCt)}
          </span>
          <span
            className="text-sm text-stone-900 transition-colors duration-200 group-hover:text-[#FF7444]"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace", fontWeight: 600 }}
          >
            {formatPrice(stone.price)}
          </span>
        </div>
      </div>
    </button>
  )
}
