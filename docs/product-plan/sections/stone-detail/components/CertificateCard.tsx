import type { StoneCertificate } from '../types'

interface CertificateCardProps {
  certificate: StoneCertificate
  onOpenScan?: (id: string) => void
  onVerify?: (id: string) => void
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function CertificateCard({ certificate, onOpenScan, onVerify }: CertificateCardProps) {
  return (
    <section
      className="relative mt-16 overflow-hidden border border-stone-200 bg-[#FFF8DE] p-8 md:mt-20 md:p-10"
      aria-labelledby="cert-heading"
    >
      {/* decorative seals */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#E8DFB5]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#E8DFB5]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 rounded-full border border-[#E8DFB5]"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="cert-heading"
              className="text-[11px] uppercase tracking-[0.25em] text-[#576A8F] md:text-xs"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              Сертификат
            </h2>
            <p
              className="mt-5 text-3xl text-stone-900 md:text-4xl"
              style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              {certificate.lab}
            </p>
            <p
              className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone-600 md:text-xs"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              № {certificate.number} · {formatDate(certificate.issuedAt)}
            </p>
          </div>
          <div
            aria-hidden
            className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-[#576A8F] text-[#576A8F] md:flex"
          >
            <span
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
            >
              verified
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenScan?.(certificate.id)}
            className="group inline-flex items-center justify-center gap-2 border border-[#576A8F] bg-white px-5 py-3 text-sm text-[#576A8F] transition-all hover:bg-[#576A8F] hover:text-white"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
          >
            <span>Посмотреть скан</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
          <button
            type="button"
            onClick={() => onVerify?.(certificate.id)}
            className="group inline-flex items-center justify-center gap-2 border border-stone-300 bg-white px-5 py-3 text-sm text-stone-700 transition-all hover:border-[#FF7444] hover:text-[#FF7444]"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
          >
            <span>Проверить на сайте лаборатории</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
