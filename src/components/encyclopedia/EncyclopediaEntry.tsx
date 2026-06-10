import { useEffect, useRef, useState } from 'react'
import type { EncyclopediaEntryProps, EntrySectionId, LiveStoneCard } from './types'
import { StonePhoto } from '../common/StonePhoto'
import { formatPrice, formatWeight, formatDate } from '../../lib/format'

const sansFont = { fontFamily: "'Noto Sans', sans-serif" } as const
const monoFont = { fontFamily: "'Noto Sans Mono', ui-monospace, monospace" } as const

const TELEGRAM_HREF = 'https://t.me/dmitry_gem'

interface SectionDef {
  id: EntrySectionId
  tocLabel: string
  heading: string
  paragraphs: string[]
}

// ---------------------------------------------------------------------------
// Live-блок: компактная jewel-карточка камня из актуальной коллекции.
function LiveStoneTile({
  stone,
  onClick,
}: {
  stone: LiveStoneCard
  onClick?: () => void
}) {
  const accentHex = stone.accentHex ?? '#B7BDF7'
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden border border-stone-200">
        <StonePhoto
          src={stone.photoUrl}
          alt={stone.name}
          accentHex={accentHex}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transform bg-stone-900/92 px-3 py-2 text-white transition-transform duration-300 group-hover:translate-y-0">
          <span
            className="text-[10px] uppercase tracking-[0.22em] text-stone-300"
            style={monoFont}
          >
            смотреть паспорт →
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-4">
        <h3
          className="text-[15px] leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F]"
          style={{ ...sansFont, fontWeight: 500 }}
        >
          {stone.name}
        </h3>
        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-stone-100 pt-2">
          <span className="text-xs text-stone-500" style={monoFont}>
            {formatWeight(stone.weightCt)}
          </span>
          <span
            className="text-sm text-stone-900 transition-colors duration-200 group-hover:text-[#FF7444]"
            style={{ ...monoFont, fontWeight: 600 }}
          >
            {formatPrice(stone.price)}
          </span>
        </div>
      </div>
    </button>
  )
}

export function EncyclopediaEntry({
  variety,
  entry,
  stonesInStock,
  relatedPosts,
  onBackToIndex,
  onScrollToSection,
  onViewStone,
  onBrowseInCatalog,
  onViewPost,
  onContactForCustom,
}: EncyclopediaEntryProps) {
  const sections: SectionDef[] = [
    {
      id: 'intro',
      tocLabel: 'Что это',
      heading: `Что такое ${variety.name.toLowerCase()}`,
      paragraphs: entry.intro,
    },
    {
      id: 'history',
      tocLabel: 'История',
      heading: 'История и происхождение',
      paragraphs: entry.historyAndOrigins,
    },
    {
      id: 'colors',
      tocLabel: 'Цвета и огранки',
      heading: 'Цвета и огранки',
      paragraphs: entry.colorsAndCuts,
    },
    {
      id: 'choose',
      tocLabel: 'Как выбирать',
      heading: 'Как выбирать',
      paragraphs: entry.howToChoose,
    },
  ]

  const properties: { label: string; value: string }[] = [
    { label: 'Минеральный класс', value: variety.mineralClass },
    { label: 'Формула', value: variety.formula },
    { label: 'Твёрдость (Моос)', value: variety.hardness },
    { label: 'Плотность', value: variety.density },
    { label: 'Показатель преломления', value: variety.refractiveIndex },
    { label: 'Сингония', value: variety.crystalSystem },
  ]

  // --- Scroll-spy для sticky TOC -------------------------------------------
  const [activeSection, setActiveSection] = useState<EntrySectionId>('intro')
  const sectionRefs = useRef<Map<EntrySectionId, HTMLElement>>(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveSection(visible[0].target.id as EntrySectionId)
        }
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: 0 },
    )
    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleTocClick = (id: EntrySectionId) => {
    const el = sectionRefs.current.get(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onScrollToSection?.(id)
  }

  const registerSection = (id: EntrySectionId) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el)
    else sectionRefs.current.delete(id)
  }

  return (
    <div className="pt-8 pb-24 md:pt-10">
      {/* Breadcrumb */}
      <nav
        className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500"
        style={monoFont}
      >
        <button
          type="button"
          onClick={onBackToIndex}
          className="transition-colors hover:text-[#FF7444]"
        >
          Энциклопедия
        </button>
        <span aria-hidden>/</span>
        <span className="text-stone-700">{variety.name}</span>
      </nav>

      {/* Immersive hero */}
      <div className="relative mb-10 overflow-hidden rounded-2xl md:mb-14">
        <StonePhoto
          src={entry.heroPhotoUrl}
          alt={variety.name}
          accentHex="#B7BDF7"
          className="h-[280px] w-full md:h-[420px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-stone-900/55 via-stone-900/10 to-transparent"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <p
            className="mb-3 text-xs uppercase tracking-[0.22em] text-white/85"
            style={monoFont}
          >
            {entry.heroSubtitle}
          </p>
          <h1
            className="text-4xl font-medium text-white md:text-5xl xl:text-6xl"
            style={sansFont}
          >
            {variety.name}
          </h1>
        </div>
      </div>

      {/* Two-column: reading + sticky TOC */}
      <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-16">
        <article className="max-w-[72ch]">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              ref={registerSection(section.id)}
              className="scroll-mt-28 border-stone-100 [&:not(:first-child)]:mt-14 [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-14"
            >
              <h2
                className="text-2xl font-medium text-stone-900 md:text-3xl"
                style={sansFont}
              >
                {section.heading}
              </h2>
              <div
                className="mt-6 space-y-5 text-lg leading-relaxed text-stone-700"
                style={sansFont}
              >
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Паспорт свойств — внутри вводного раздела */}
              {index === 0 && (
                <div className="mt-10 overflow-hidden rounded-xl border border-stone-200 bg-[#FFF8DE]/60">
                  <p
                    className="border-b border-stone-200 px-5 py-3 text-xs uppercase tracking-wider text-[#576A8F]"
                    style={monoFont}
                  >
                    Паспорт вида
                  </p>
                  <dl className="grid grid-cols-1 sm:grid-cols-2">
                    {properties.map((prop, i) => (
                      <div
                        key={prop.label}
                        className={`flex flex-col gap-1 px-5 py-4 ${
                          i % 2 === 0 ? 'sm:border-r' : ''
                        } border-stone-200 ${i < properties.length - (properties.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''}`}
                      >
                        <dt
                          className="text-[11px] uppercase tracking-wider text-stone-500"
                          style={monoFont}
                        >
                          {prop.label}
                        </dt>
                        <dd
                          className="text-base text-stone-900"
                          style={{ ...sansFont, fontWeight: 500 }}
                        >
                          {prop.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Sticky TOC (lg+) */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28">
            <p
              className="mb-4 text-[11px] uppercase tracking-wider text-stone-400"
              style={monoFont}
            >
              Содержание
            </p>
            <ul className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => handleTocClick(section.id)}
                      className={`flex w-full items-center gap-3 border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                        isActive
                          ? 'border-[#FF7444] text-stone-900'
                          : 'border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-700'
                      }`}
                      style={sansFont}
                    >
                      {section.tocLabel}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
      </div>

      {/* Блог: «Дмитрий пишет о [виде]» */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 border-t border-stone-100 pt-14 md:mt-24">
          <h2
            className="text-2xl font-medium text-stone-900 md:text-3xl"
            style={sansFont}
          >
            Дмитрий пишет о {variety.pluralPrepositional}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => onViewPost?.(post.id)}
                className="group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  <StonePhoto
                    src={post.coverPhotoUrl}
                    alt={post.title}
                    accentHex="#576A8F"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <p
                  className="mt-4 text-[11px] uppercase tracking-wider text-stone-400"
                  style={monoFont}
                >
                  {formatDate(post.publishedAt)}
                </p>
                <h3
                  className="mt-2 text-lg leading-snug text-stone-900 transition-colors duration-200 group-hover:text-[#576A8F]"
                  style={{ ...sansFont, fontWeight: 500 }}
                >
                  {post.title}
                </h3>
                <p
                  className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600"
                  style={sansFont}
                >
                  {post.excerpt}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Live-блок «Сейчас в коллекции» */}
      <section className="mt-20 border-t border-stone-100 pt-14 md:mt-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            className="text-2xl font-medium text-stone-900 md:text-3xl"
            style={sansFont}
          >
            Сейчас в коллекции
          </h2>
          {stonesInStock.length > 0 && (
            <button
              type="button"
              onClick={() => onBrowseInCatalog?.(variety.id)}
              className="text-sm text-[#576A8F] transition-colors hover:text-[#FF7444]"
              style={monoFont}
            >
              Все {variety.pluralName.toLowerCase()} в каталоге →
            </button>
          )}
        </div>

        {stonesInStock.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {stonesInStock.map((stone) => (
              <LiveStoneTile
                key={stone.id}
                stone={stone}
                onClick={() => onViewStone?.(stone.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-[#FFF8DE] px-6 py-12 text-center md:px-12 md:py-16">
            <p
              className="mx-auto max-w-[48ch] text-lg leading-relaxed text-stone-700"
              style={sansFont}
            >
              Сейчас {variety.pluralName.toLowerCase()} нет в наличии. Напишите
              Дмитрию — он подберёт экземпляр под ваш запрос из частных каналов и
              предстоящих поступлений.
            </p>
            <a
              href={TELEGRAM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onContactForCustom?.(variety.id)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF7444] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e6643a]"
              style={sansFont}
            >
              Написать в Telegram
            </a>
          </div>
        )}
      </section>
    </div>
  )
}
