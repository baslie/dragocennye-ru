import { useState } from 'react'
import type { StoneDetailProps } from './types'
import { Breadcrumb } from './Breadcrumb'
import { StoneMediaStack } from './StoneMediaStack'
import { Lightbox } from './Lightbox'
import { SpecSheet } from './SpecSheet'
import { CertificateCard } from './CertificateCard'
import { PriceSidebar } from './PriceSidebar'
import { SimilarStonesBlock } from './SimilarStonesBlock'

const formatWeight = (v: number) => v.toFixed(2).replace('.', ',') + ' ct'

export function StoneDetail({
  stone,
  variety,
  cut,
  origin,
  treatment,
  color,
  certificate,
  similarStones,
  contactChannels,
  onInquire,
  onSelectSimilar,
  onOpenMedia,
  onBreadcrumbClick,
  onOpenCertificateScan,
  onVerifyCertificate,
}: StoneDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const stoneCode = stone.id.replace('st-', '').toUpperCase()

  const breadcrumbItems = [
    { label: 'Каталог' },
    { label: variety.pluralName, varietyId: variety.id },
    { label: `${stone.name} · ${formatWeight(stone.weightCt)}` },
  ]

  const metaLine = [
    formatWeight(stone.weightCt),
    cut.name,
    origin.country,
    treatment.name,
  ].join(' · ')

  const handleOpenMedia = (i: number) => {
    setLightboxIndex(i)
    const media = stone.media[i]
    if (media) onOpenMedia?.(media.id)
  }

  return (
    <div className="pt-6 pb-24 md:pt-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={breadcrumbItems}
        onVarietyClick={(id) => onBreadcrumbClick?.(id)}
      />

      {/* Hero title */}
      <header className="mb-10 md:mb-14">
        <h1
          className="text-[42px] leading-[1.02] text-stone-900 md:text-6xl xl:text-[72px]"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          {stone.name}
        </h1>
        <p
          className="mt-5 text-[11px] uppercase tracking-[0.25em] text-[#576A8F] md:text-xs"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          {metaLine}
        </p>
      </header>

      {/* Main area: mobile flex-col (sidebar first), desktop grid (content left, sidebar right) */}
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_420px] lg:gap-12 xl:grid-cols-[1fr_460px] xl:gap-16">
        {/* Left column (content) */}
        <div className="order-2 lg:order-1">
          <StoneMediaStack
            media={stone.media}
            accentHex={color.hex}
            stoneCode={stoneCode}
            isAvailable={stone.isAvailable}
            onOpen={handleOpenMedia}
          />

          {/* From gemologist */}
          <section className="mt-16 md:mt-20" aria-labelledby="editorial-heading">
            <div className="max-w-[72ch]">
              <div className="flex items-center gap-4">
                <h2
                  id="editorial-heading"
                  className="text-[11px] uppercase tracking-[0.25em] text-[#576A8F] md:text-xs"
                  style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
                >
                  От гемолога
                </h2>
                <div aria-hidden className="h-px flex-1 bg-stone-200" />
              </div>
              <div
                className="mt-7 space-y-5 text-[17px] leading-[1.72] text-stone-800 md:text-[19px]"
                style={{ fontFamily: "'Noto Sans', sans-serif" }}
              >
                {stone.editorial.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p
                className="mt-8 text-[10px] uppercase tracking-[0.22em] text-stone-400 md:text-[11px]"
                style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
              >
                Дмитрий Салятов · гемолог
              </p>
            </div>
          </section>

          {/* Spec sheet */}
          <SpecSheet
            stone={stone}
            cut={cut}
            origin={origin}
            treatment={treatment}
            color={color}
          />

          {/* Certificate */}
          {certificate && (
            <CertificateCard
              certificate={certificate}
              onOpenScan={onOpenCertificateScan}
              onVerify={onVerifyCertificate}
            />
          )}
        </div>

        {/* Right column: sticky price sidebar */}
        <div className="order-1 lg:order-2">
          <PriceSidebar
            stone={stone}
            variety={variety}
            contactChannels={contactChannels}
            onInquire={onInquire}
            onBrowseVariety={(id) => onBreadcrumbClick?.(id)}
          />
        </div>
      </div>

      {/* Similar stones */}
      <SimilarStonesBlock
        stones={similarStones}
        variety={variety}
        onSelect={onSelectSimilar}
      />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          media={stone.media}
          index={lightboxIndex}
          accentHex={color.hex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  )
}
