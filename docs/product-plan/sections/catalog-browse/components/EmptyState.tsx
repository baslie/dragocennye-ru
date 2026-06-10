interface EmptyStateProps {
  onReset?: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center md:py-32">
      <svg
        viewBox="0 0 120 120"
        className="h-20 w-20 text-stone-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden
      >
        <path d="M60 10 L108 46 L60 110 L12 46 Z" strokeLinejoin="round" />
        <path d="M12 46 L108 46" strokeLinejoin="round" />
        <path d="M60 10 L38 46 L60 110" strokeLinejoin="round" />
        <path d="M60 10 L82 46 L60 110" strokeLinejoin="round" />
      </svg>
      <h2
        className="mt-8 text-2xl text-stone-900 md:text-3xl"
        style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 300,
          letterSpacing: '-0.01em',
        }}
      >
        Камней по вашему запросу не нашлось
      </h2>
      <p
        className="mt-3 max-w-[40ch] text-[13px] text-stone-500"
        style={{ fontFamily: "'Noto Sans', sans-serif" }}
      >
        Попробуйте ослабить фильтры или вернуться к полному каталогу. Если нужно
        конкретное — Дмитрий может подобрать камень под запрос лично.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 border border-[#FF7444] bg-white px-6 py-2.5 text-[12px] uppercase tracking-[0.18em] text-[#FF7444] transition-colors hover:bg-[#FF7444] hover:text-white"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        Сбросить фильтры
        <span aria-hidden>→</span>
      </button>
    </div>
  )
}
