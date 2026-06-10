import { EncyclopediaIndex } from './EncyclopediaIndex'
import type { StoneVariety } from './types'

interface EncyclopediaIndexIslandProps {
  varieties: StoneVariety[]
}

export function EncyclopediaIndexIsland({ varieties }: EncyclopediaIndexIslandProps) {
  // slug = id вида без префикса "v-"? Нет — у видов есть собственный slug.
  // Маппим varietyId → slug через переданный массив.
  const slugById = new Map(varieties.map((v) => [v.id, v.slug]))

  const handleSelectVariety = (varietyId: string) => {
    const slug = slugById.get(varietyId)
    if (slug) window.location.href = `/encyclopedia/${slug}`
  }

  const handleBrowseInCatalog = (varietyId: string) => {
    const slug = slugById.get(varietyId)
    if (slug) window.location.href = `/catalog/${slug}`
  }

  return (
    <EncyclopediaIndex
      varieties={varieties}
      onSelectVariety={handleSelectVariety}
      onBrowseInCatalog={handleBrowseInCatalog}
    />
  )
}
