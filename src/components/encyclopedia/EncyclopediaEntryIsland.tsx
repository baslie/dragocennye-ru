import { EncyclopediaEntry } from './EncyclopediaEntry'
import type {
  BlogPostCard,
  EncyclopediaEntry as EncyclopediaEntryData,
  LiveStoneCard,
  StoneVariety,
} from './types'

interface EncyclopediaEntryIslandProps {
  variety: StoneVariety
  entry: EncyclopediaEntryData
  stonesInStock: LiveStoneCard[]
  relatedPosts: BlogPostCard[]
}

export function EncyclopediaEntryIsland({
  variety,
  entry,
  stonesInStock,
  relatedPosts,
}: EncyclopediaEntryIslandProps) {
  const stoneSlugById = new Map(stonesInStock.map((s) => [s.id, s.slug]))
  const postSlugById = new Map(relatedPosts.map((p) => [p.id, p.slug]))

  const handleBackToIndex = () => {
    window.location.href = '/encyclopedia'
  }

  const handleViewStone = (stoneId: string) => {
    const slug = stoneSlugById.get(stoneId)
    if (slug) window.location.href = `/stones/${slug}`
  }

  const handleBrowseInCatalog = () => {
    window.location.href = `/catalog/${variety.slug}`
  }

  const handleViewPost = (postId: string) => {
    const slug = postSlugById.get(postId)
    if (slug) window.location.href = `/blog/${slug}`
  }

  return (
    <EncyclopediaEntry
      variety={variety}
      entry={entry}
      stonesInStock={stonesInStock}
      relatedPosts={relatedPosts}
      onBackToIndex={handleBackToIndex}
      onViewStone={handleViewStone}
      onBrowseInCatalog={handleBrowseInCatalog}
      onViewPost={handleViewPost}
    />
  )
}
