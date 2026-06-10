import { useState } from 'react'
import { BlogFeed } from './BlogFeed'
import type { BlogPostCard, Topic } from './types'

interface BlogFeedIslandProps {
  posts: BlogPostCard[]
  topics: Topic[]
}

/**
 * Остров ленты блога: держит клиентский фильтр по виду (activeTopicId),
 * навигацию к посту через window.location.
 */
export function BlogFeedIsland({ posts, topics }: BlogFeedIslandProps) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const slugById = new Map(posts.map((p) => [p.id, p.slug]))

  const handleViewPost = (postId: string) => {
    const slug = slugById.get(postId)
    if (slug) window.location.href = `/blog/${slug}`
  }

  return (
    <BlogFeed
      posts={posts}
      topics={topics}
      activeTopicId={activeTopicId}
      onFilterByVariety={setActiveTopicId}
      onViewPost={handleViewPost}
    />
  )
}
