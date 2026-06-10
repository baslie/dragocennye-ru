import type { StoneMedia } from './types'

interface StoneMediaStackProps {
  media: StoneMedia[]
  accentHex: string
  stoneCode: string
  isAvailable: boolean
  onOpen?: (index: number) => void
}

export function StoneMediaStack({
  media,
  accentHex,
  stoneCode,
  isAvailable,
  onOpen,
}: StoneMediaStackProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {media.map((m, i) => (
        <MediaBlock
          key={m.id}
          media={m}
          index={i}
          total={media.length}
          accentHex={accentHex}
          stoneCode={stoneCode}
          isFirst={i === 0}
          isAvailable={isAvailable}
          onClick={() => onOpen?.(i)}
        />
      ))}
    </div>
  )
}

interface MediaBlockProps {
  media: StoneMedia
  index: number
  total: number
  accentHex: string
  stoneCode: string
  isFirst: boolean
  isAvailable: boolean
  onClick?: () => void
}

function MediaBlock({
  media,
  index,
  total,
  accentHex,
  stoneCode,
  isFirst,
  isAvailable,
  onClick,
}: MediaBlockProps) {
  const idxLabel = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/5] w-full overflow-hidden border border-stone-200 bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      {/* radial jewel backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-[1800ms] ease-out group-hover:scale-[1.03]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 58% 48% at 50% 44%, ${accentHex}E6 0%, ${accentHex}99 22%, ${accentHex}33 48%, transparent 78%),
            radial-gradient(circle at 35% 28%, rgba(255,255,255,0.95) 0%, transparent 18%),
            radial-gradient(circle at 68% 72%, rgba(255,255,255,0.45) 0%, transparent 26%),
            linear-gradient(160deg, #FBFAF5 0%, #F0EDE5 100%)
          `,
        }}
      />

      {/* facets */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          backgroundImage: `
            linear-gradient(115deg, transparent 47%, rgba(255,255,255,0.55) 50%, transparent 53%),
            linear-gradient(62deg, transparent 47%, rgba(255,255,255,0.28) 50%, transparent 53%),
            linear-gradient(28deg, transparent 46%, rgba(255,255,255,0.18) 50%, transparent 54%)
          `,
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, #000 1px, transparent 1px), radial-gradient(circle at 60% 70%, #000 1px, transparent 1px)',
          backgroundSize: '4px 4px, 6px 6px',
        }}
      />

      {/* Video play button overlay */}
      {media.kind === 'video' && (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/75 bg-stone-900/25 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-white group-hover:bg-stone-900/35 md:h-24 md:w-24">
            <div className="ml-1.5 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-white" />
          </div>
        </div>
      )}

      {/* Top meta */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <span
          className="text-[10px] uppercase tracking-[0.22em] text-stone-500 md:text-[11px]"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          №{stoneCode} · {idxLabel}
        </span>
        {media.kind === 'video' && (
          <span
            className="bg-white/90 px-2 py-1 text-[9px] uppercase tracking-[0.22em] text-[#576A8F] backdrop-blur-sm"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            видео
          </span>
        )}
      </div>

      {/* Sold overlay on first block */}
      {isFirst && !isAvailable && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[2px]"
        >
          <span
            className="text-4xl uppercase tracking-[0.2em] text-[#576A8F] md:text-5xl"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
          >
            Продан
          </span>
        </div>
      )}

      {/* Zoom hint */}
      <div
        className="absolute bottom-4 right-4 translate-y-2 bg-stone-900/85 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-[10px]"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        нажмите чтобы увеличить
      </div>
    </button>
  )
}
