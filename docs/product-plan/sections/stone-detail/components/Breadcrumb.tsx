interface BreadcrumbItem {
  label: string
  varietyId?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onVarietyClick?: (varietyId: string) => void
}

export function Breadcrumb({ items, onVarietyClick }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-stone-400 md:mb-10 md:text-[11px]"
      style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1
        return (
          <span key={idx} className="flex items-center gap-2">
            {item.varietyId && !isLast ? (
              <button
                type="button"
                onClick={() => onVarietyClick?.(item.varietyId!)}
                className="text-stone-500 transition-colors hover:text-[#FF7444] focus:outline-none focus-visible:text-[#FF7444]"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-[#576A8F]' : 'text-stone-500'}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span aria-hidden className="text-stone-300">
                /
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
