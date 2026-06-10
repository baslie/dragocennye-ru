import { Check } from 'lucide-react'

interface SentBlockProps {
  successMessage: string
  onClose?: () => void
}

export function SentBlock({ successMessage, onClose }: SentBlockProps) {
  return (
    <div
      aria-live="polite"
      className="px-6 py-10 text-center sm:px-8"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 bg-[#FFF8DE]">
        <Check className="h-8 w-8 text-[#576A8F]" strokeWidth={2.25} />
      </div>
      <p
        className="mt-6 text-xs uppercase tracking-wider text-[#576A8F]"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        Заявка отправлена
      </p>
      <h3
        className="mt-3 text-2xl text-stone-900"
        style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 500,
          letterSpacing: '-0.015em',
        }}
      >
        Спасибо!
      </h3>
      <p
        className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-stone-600"
        style={{ fontFamily: "'Noto Sans', sans-serif" }}
      >
        {successMessage}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex items-center justify-center rounded-lg border border-stone-200 px-8 py-3 text-stone-700 transition hover:border-[#576A8F] hover:text-[#576A8F]"
        style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
      >
        Закрыть
      </button>
    </div>
  )
}
