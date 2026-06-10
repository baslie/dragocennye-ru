import { useMemo } from 'react'
import type { CatalogBrowseProps } from './types'
import { VarietyTabs } from './VarietyTabs'
import { FilterBar } from './FilterBar'
import { SeoBlock } from './SeoBlock'
import { StoneCard } from './StoneCard'
import { Pagination } from './Pagination'
import { EmptyState } from './EmptyState'

export function CatalogBrowse({
  varieties,
  cuts,
  origins,
  treatments,
  colors,
  stones,
  filters,
  sort,
  page,
  pageSize,
  onSelectVariety,
  onFilterChange,
  onSortChange,
  onPageChange,
  onStoneClick,
  onResetFilters,
}: CatalogBrowseProps) {
  const varietyMap = useMemo(
    () => new Map(varieties.map((v) => [v.id, v])),
    [varieties],
  )
  const colorMap = useMemo(() => new Map(colors.map((c) => [c.id, c])), [colors])

  const totalCatalogCount = useMemo(
    () => varieties.reduce((sum, v) => sum + v.stoneCount, 0),
    [varieties],
  )

  const matchedCount = stones.length
  const totalPages = Math.max(1, Math.ceil(matchedCount / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const pagedStones = useMemo(
    () => stones.slice((safePage - 1) * pageSize, safePage * pageSize),
    [stones, safePage, pageSize],
  )

  const activeVariety =
    filters.varietyId != null ? varietyMap.get(filters.varietyId) ?? null : null
  const singleSelectedColor =
    filters.colorIds.length === 1 ? colorMap.get(filters.colorIds[0]) ?? null : null

  const isEmpty = matchedCount === 0

  return (
    <div className="pt-6 pb-20 md:pt-8">
      {/* Variety tabs */}
      <section className="pt-2">
        <VarietyTabs
          varieties={varieties}
          activeVarietyId={filters.varietyId}
          totalCount={totalCatalogCount}
          onSelect={onSelectVariety}
        />
      </section>

      {/* Filter bar */}
      <section className="mt-6 md:mt-8">
        <FilterBar
          filters={filters}
          sort={sort}
          colors={colors}
          cuts={cuts}
          origins={origins}
          treatments={treatments}
          totalCount={matchedCount}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
        />
      </section>

      {/* SEO reading block for selected variety */}
      {activeVariety && (
        <section>
          <SeoBlock
            variety={activeVariety}
            color={singleSelectedColor}
            matchedCount={matchedCount}
          />
        </section>
      )}

      {/* Grid or empty */}
      <section className={activeVariety ? '' : 'mt-10 md:mt-14'}>
        {isEmpty ? (
          <EmptyState onReset={onResetFilters} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4 lg:gap-x-7 xl:grid-cols-5 xl:gap-x-8">
              {pagedStones.map((stone) => (
                <StoneCard
                  key={stone.id}
                  stone={stone}
                  variety={varietyMap.get(stone.varietyId)}
                  color={colorMap.get(stone.colorId)}
                  onClick={() => onStoneClick?.(stone.id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </section>
    </div>
  )
}
