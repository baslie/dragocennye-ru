import type { BlogPostCard } from './types'
import {
  OVERLAY_VEIL,
  formatPostMeta,
  heroCoverStyle,
  hideBrokenImage,
  monoFont,
  sansFont,
} from './format'

interface FeaturedPostProps {
  post: BlogPostCard
  onClick?: () => void
}

/**
 * Immersive-hero свежего поста — первой в ленте при фильтре «Все».
 * Полноширинная насыщенная обложка, заголовок и мета лежат поверх на тёмной вуали.
 */
export function FeaturedPost({ post, onClick }: FeaturedPostProps) {
  return (
    <article
      onClick={onClick}
      className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-2xl bg-stone-200 md:aspect-[2/1]"
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        style={heroCoverStyle}
      />
      <img
        src={post.coverPhotoUrl}
        alt={post.title}
        onError={hideBrokenImage}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
      />
      <div aria-hidden className={OVERLAY_VEIL} />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
        <span
          className="text-xs uppercase tracking-wider text-[#B7BDF7]"
          style={monoFont}
        >
          Свежее
        </span>
        <p
          className="mt-3 text-xs uppercase tracking-wider text-stone-300"
          style={monoFont}
        >
          {formatPostMeta(post)}
        </p>
        <h2
          className="mt-3 max-w-[26ch] text-3xl font-medium text-white md:text-4xl lg:text-5xl"
          style={sansFont}
        >
          {post.title}
        </h2>
        <p
          className="mt-5 text-xs uppercase tracking-wider text-white/80 transition-colors group-hover:text-[#FF7444]"
          style={monoFont}
        >
          Читать →
        </p>
      </div>
    </article>
  )
}
