import type { Color, StoneVariety } from './types'

interface SeoBlockProps {
  variety: StoneVariety
  color?: Color | null
  matchedCount: number
}

export function SeoBlock({ variety, color, matchedCount }: SeoBlockProps) {
  const headingColor = color ? `${color.name} ${declineVarietyName(variety.name, true)}` : pluralizeVariety(variety.name)
  const description = color ? buildColoredDescription(variety, color) : variety.shortDescription

  return (
    <div className="mx-auto max-w-[72ch] pt-10 pb-8 text-center md:pt-14 md:pb-10">
      <p
        className="text-[11px] uppercase tracking-[0.3em] text-[#576A8F]"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        Каталог · {variety.name.toLowerCase()}
      </p>
      <h1
        className="mt-4 text-4xl text-stone-900 md:text-5xl lg:text-[56px]"
        style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 300,
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
        }}
      >
        {headingColor}
      </h1>
      <p
        className="mt-3 text-[12px] text-stone-500"
        style={{
          fontFamily: "'Noto Sans Mono', ui-monospace, monospace",
          letterSpacing: '0.08em',
        }}
      >
        {matchedCount} {pluralizeStones(matchedCount)} в коллекции
      </p>
      <div className="mx-auto mt-8 max-w-[62ch] space-y-4 text-left text-[15px] leading-relaxed text-stone-600 md:text-base">
        {description.split('\n\n').map((paragraph, index) => (
          <p key={index} style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 400 }}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

function declineVarietyName(name: string, plural: boolean): string {
  const lower = name.toLowerCase()
  if (!plural) return lower
  // Approximate Russian plural: append «ы» or «и»
  if (/[шщч]$/.test(lower)) return lower + 'и'
  if (/[ьй]$/.test(lower)) return lower.slice(0, -1) + 'и'
  return lower + 'ы'
}

function pluralizeVariety(name: string): string {
  return capitalize(declineVarietyName(name, true))
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function buildColoredDescription(variety: StoneVariety, color: Color): string {
  const colorAdj = color.name.toLowerCase()
  const plural = declineVarietyName(variety.name, true)
  return `${capitalize(colorAdj)} ${plural} — одна из самых востребованных цветовых групп в ассортименте Дмитрия. Каждый экземпляр в коллекции прошёл личный отбор: по тону, чистоте, геометрии огранки и происхождению.\n\n${variety.shortDescription.split('\n\n')[0] ?? ''}`
}

function pluralizeStones(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'камень'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'камня'
  return 'камней'
}
