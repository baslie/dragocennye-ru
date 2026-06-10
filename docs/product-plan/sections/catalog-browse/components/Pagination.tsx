interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
}

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'ellipsis')[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) pages.push('ellipsis')
  for (let i = left; i <= right; i += 1) pages.push(i)
  if (right < total - 1) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const pageList = buildPageList(currentPage, totalPages)

  const go = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange?.(page)
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-center gap-1 pb-4 md:mt-20"
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className="group flex h-9 items-center gap-1 px-3 text-[11px] uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:text-stone-200 disabled:hover:text-stone-200"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        <span aria-hidden>←</span>
        <span className="hidden md:inline">Назад</span>
      </button>

      <div
        className="mx-2 flex items-center gap-0 border border-stone-200"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        {pageList.map((entry, index) =>
          entry === 'ellipsis' ? (
            <span
              key={`el-${index}`}
              className="flex h-9 w-9 items-center justify-center border-l border-stone-200 text-[13px] text-stone-300 first:border-l-0"
              aria-hidden
            >
              ···
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => go(entry)}
              className={`flex h-9 w-9 items-center justify-center border-l border-stone-200 text-[13px] transition-colors first:border-l-0 ${
                entry === currentPage
                  ? 'bg-[#576A8F] text-white'
                  : 'text-stone-700 hover:bg-stone-50 hover:text-[#FF7444]'
              }`}
              aria-current={entry === currentPage ? 'page' : undefined}
            >
              {entry}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex h-9 items-center gap-1 px-3 text-[11px] uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900 disabled:cursor-not-allowed disabled:text-stone-200 disabled:hover:text-stone-200"
        style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
      >
        <span className="hidden md:inline">Далее</span>
        <span aria-hidden>→</span>
      </button>
    </nav>
  )
}
