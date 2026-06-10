import type { InquiryStoneMini } from './types'
import { StonePhoto } from '../common/StonePhoto'

interface StoneMiniCardProps {
  stone: InquiryStoneMini
}

const formatWeight = (value: number) =>
  value.toFixed(2).replace('.', ',') + ' ct'

const formatPrice = (value: number) => {
  const formatted = new Intl.NumberFormat('ru-RU').format(value)
  return `${formatted.replace(/\s/g, '\u00A0')}\u00A0₽`
}

export function StoneMiniCard({ stone }: StoneMiniCardProps) {
  const metaLine = `${formatWeight(stone.weightCt)} · ${stone.cutName}`

  return (
    <div className="mx-6 mt-5 mb-2 overflow-hidden rounded-xl border border-stone-200 bg-[#FFF8DE] sm:mx-8 sm:mt-6">
      <div className="flex flex-col items-stretch gap-4 p-4 sm:flex-row sm:items-center">
        <StonePhoto
          src={stone.photoUrl}
          alt={stone.name}
          accentHex={stone.accentHex ?? '#576A8F'}
          className="h-40 w-full flex-shrink-0 rounded-lg sm:h-20 sm:w-20"
        />
        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-base text-stone-900"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              {stone.name}
            </p>
            <p
              className="mt-1 text-xs uppercase tracking-wider text-stone-500"
              style={{
                fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
              }}
            >
              {metaLine}
            </p>
          </div>
          <p
            className="mt-3 flex-shrink-0 text-xl text-[#576A8F] sm:mt-0"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.01em',
            }}
          >
            {formatPrice(stone.price)}
          </p>
        </div>
      </div>
    </div>
  )
}
