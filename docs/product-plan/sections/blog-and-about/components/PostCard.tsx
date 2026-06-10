import type { BlogPostCard } from '../types'
import {
  coverStyle,
  formatPostMeta,
  hideBrokenImage,
  monoFont,
  sansFont,
} from './format'

interface PostCardProps {
  post: BlogPostCard
  onClick?: () => void
}

/**
 * Editorial-карточка публикации: обложка 4:3 + mono-мета + заголовок + тизер.
 * Переиспользуется в ленте, блоке «Читать дальше» и «Из журнала».
 */
export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className="group block cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200"
        style={coverStyle}
      >
        <img
          src={post.coverPhotoUrl}
          alt={post.title}
          onError={hideBrokenImage}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <p
        className="mt-5 text-xs uppercase tracking-wider text-stone-500"
        style={monoFont}
      >
        {formatPostMeta(post)}
      </p>

      <h3
        className="mt-2 text-xl font-medium text-stone-900 transition-colors duration-200 group-hover:text-[#FF7444] md:text-2xl"
        style={sansFont}
      >
        {post.title}
      </h3>

      <p
        className="mt-3 line-clamp-3 text-base leading-relaxed text-stone-700"
        style={sansFont}
      >
        {post.excerpt}
      </p>
    </article>
  )
}
