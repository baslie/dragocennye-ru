import { BlogPost } from './BlogPost'
import type { Author, BlogPost as BlogPostData, BlogPostCard } from './types'

interface BlogPostIslandProps {
  post: BlogPostData
  author: Author
  relatedPosts: BlogPostCard[]
  /** varietyId → slug каталога (для перехода «в каталог»). */
  varietySlugs: Record<string, string>
}

/**
 * Остров поста: вся навигация через window.location.
 * onViewStone берёт slug из mentionedStones, onViewPost — из relatedPosts,
 * onBrowseInCatalog — из varietySlugs.
 */
export function BlogPostIsland({
  post,
  author,
  relatedPosts,
  varietySlugs,
}: BlogPostIslandProps) {
  const stoneSlugById = new Map(post.mentionedStones.map((s) => [s.id, s.slug]))
  const postSlugById = new Map(relatedPosts.map((p) => [p.id, p.slug]))

  const handleBackToFeed = () => {
    window.location.href = '/blog'
  }

  const handleBrowseInCatalog = (varietyId: string) => {
    const slug = varietySlugs[varietyId]
    window.location.href = slug ? `/catalog/${slug}` : '/'
  }

  const handleViewStone = (stoneId: string) => {
    const slug = stoneSlugById.get(stoneId)
    if (slug) window.location.href = `/stones/${slug}`
  }

  const handleViewPost = (postId: string) => {
    const slug = postSlugById.get(postId)
    if (slug) window.location.href = `/blog/${slug}`
  }

  const handleViewAbout = () => {
    window.location.href = '/about'
  }

  return (
    <BlogPost
      post={post}
      author={author}
      relatedPosts={relatedPosts}
      onBackToFeed={handleBackToFeed}
      onBrowseInCatalog={handleBrowseInCatalog}
      onViewStone={handleViewStone}
      onViewPost={handleViewPost}
      onViewAbout={handleViewAbout}
    />
  )
}
