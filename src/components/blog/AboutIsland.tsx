import { About } from './About'
import type { BlogPostCard, ContactChannel, Gemologist } from './types'

interface AboutIslandProps {
  gemologist: Gemologist
  recentPosts: BlogPostCard[]
  /** Готовые href'ы каналов связи (telegram/whatsapp/phone). */
  contactHrefs: Record<ContactChannel, string>
}

/** Остров /about: навигация к постам/ленте и переход в канал связи через window.location. */
export function AboutIsland({
  gemologist,
  recentPosts,
  contactHrefs,
}: AboutIslandProps) {
  const slugById = new Map(recentPosts.map((p) => [p.id, p.slug]))

  const handleViewPost = (postId: string) => {
    const slug = slugById.get(postId)
    if (slug) window.location.href = `/blog/${slug}`
  }

  const handleViewFeed = () => {
    window.location.href = '/blog'
  }

  const handleContact = (channel: ContactChannel) => {
    const href = contactHrefs[channel]
    if (href) window.location.href = href
  }

  return (
    <About
      gemologist={gemologist}
      recentPosts={recentPosts}
      onViewPost={handleViewPost}
      onViewFeed={handleViewFeed}
      onContact={handleContact}
    />
  )
}
