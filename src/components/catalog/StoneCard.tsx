import type { Stone, StoneVariety, Color } from './types'

interface StoneCardProps {
  stone: Stone
  variety?: StoneVariety
  color?: Color
  onClick?: () => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽'

const formatWeight = (value: number) => value.toFixed(2).replace('.', ',') + ' ct'

export function StoneCard({ stone, variety, color, onClick }: StoneCardProps) {
  const inventoryCode = stone.id.replace('st-', '').toUpperCase()
  const accentHex = color?.hex ?? '#B7BDF7'
  const subtleLabel = variety ? variety.name.toLowerCase() : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      {/* Photo frame — deeply tactile gradient jewel */}
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-stone-200 bg-stone-50">
        {/* radial jewel */}
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
        {/* facet lines */}
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
        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 10%, #000 1px, transparent 1px), radial-gradient(circle at 40% 60%, #000 1px, transparent 1px)',
            backgroundSize: '3px 3px, 5px 5px',
          }}
        />

        {/* real photo — ложится поверх jewel-градиента; при 404 остаётся градиент */}
        {stone.photoUrl && (
          <img
            src={stone.photoUrl}
            alt={stone.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
          />
        )}

        {/* Top-corner meta */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            №{inventoryCode}
          </span>
          {!stone.isAvailable && (
            <span
              className="bg-white/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#576A8F] backdrop-blur-sm"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              резерв
            </span>
          )}
        </div>

        {/* Bottom-left inventory strip appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transform bg-stone-900/92 px-3 py-2 text-white transition-transform duration-300 group-hover:translate-y-0">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-300"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            смотреть паспорт →
          </span>
        </div>
      </div>

      {/* Caption block */}
      <div className="flex flex-1 flex-col gap-1 pt-4">
        <h3
          className="text-[15px] leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F] md:text-base"
          style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
        >
          {stone.name}
        </h3>
        {subtleLabel && (
          <span
            className="text-[11px] uppercase tracking-[0.18em] text-stone-400"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            {subtleLabel}
          </span>
        )}
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
