import { useEffect } from 'react'
import type { StoneMedia } from './types'

interface LightboxProps {
  media: StoneMedia[]
  index: number
  accentHex: string
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

export function Lightbox({ media, index, accentHex, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1)
      else if (e.key === 'ArrowRight' && index < media.length - 1) onNavigate(index + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, media.length, onClose, onNavigate])

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  const current = media[index]
  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-6 md:px-10">
        <span
          className="text-[10px] uppercase tracking-[0.22em] text-stone-400 md:text-xs"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          {String(index + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')} —{' '}
          {current.kind === 'video' ? 'видео' : 'фото'}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="flex h-10 w-10 items-center justify-center border border-stone-600 text-stone-300 transition-colors hover:border-[#FF7444] hover:text-[#FF7444]"
          aria-label="Закрыть"
        >
          <span className="text-2xl leading-none">×</span>
        </button>
      </div>

      {/* Body */}
      <div
        className="relative flex flex-1 items-center justify-center px-6 md:px-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => index > 0 && onNavigate(index - 1)}
          disabled={index === 0}
          className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-stone-600 text-stone-300 transition-colors hover:border-[#FF7444] hover:text-[#FF7444] disabled:pointer-events-none disabled:opacity-20 md:left-8"
          aria-label="Предыдущее"
        >
          <span className="text-3xl leading-none">‹</span>
        </button>

        <div className="relative aspect-square w-full max-w-[min(70vh,900px)] overflow-hidden border border-stone-700 bg-stone-900">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 60% 50% at 50% 46%, ${accentHex}F2 0%, ${accentHex}B3 22%, ${accentHex}4D 52%, transparent 82%),
                radial-gradient(circle at 34% 28%, rgba(255,255,255,0.78) 0%, transparent 20%),
                radial-gradient(circle at 70% 72%, rgba(255,255,255,0.35) 0%, transparent 28%),
                linear-gradient(160deg, #1a1a1e 0%, #0b0b0f 100%)
              `,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `
                linear-gradient(115deg, transparent 47%, rgba(255,255,255,0.5) 50%, transparent 53%),
                linear-gradient(62deg, transparent 47%, rgba(255,255,255,0.25) 50%, transparent 53%)
              `,
            }}
          />
          {current.kind === 'photo' && current.url && (
            <img
              src={current.url}
              alt={current.alt}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
          {current.kind === 'video' && (
            <div aria-hidden className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/80 bg-stone-900/30 backdrop-blur-sm">
                <div className="ml-2 h-0 w-0 border-y-[18px] border-l-[28px] border-y-transparent border-l-white" />
              </div>
            </div>
          )}

          <div
            className="absolute bottom-4 left-4 right-4 text-[10px] uppercase tracking-[0.2em] text-stone-400 md:text-[11px]"
            style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
          >
            {current.alt}
          </div>
        </div>

        <button
          type="button"
          onClick={() => index < media.length - 1 && onNavigate(index + 1)}
          disabled={index === media.length - 1}
          className="absolute right-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-stone-600 text-stone-300 transition-colors hover:border-[#FF7444] hover:text-[#FF7444] disabled:pointer-events-none disabled:opacity-20 md:right-8"
          aria-label="Следующее"
        >
          <span className="text-3xl leading-none">›</span>
        </button>
      </div>

      {/* Dots */}
      <div
        className="flex items-center justify-center gap-2 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {media.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate(i)}
            className={`h-1 w-8 transition-all ${
              i === index ? 'bg-[#FF7444]' : 'bg-stone-700 hover:bg-stone-500'
            }`}
            aria-label={`Перейти к ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
