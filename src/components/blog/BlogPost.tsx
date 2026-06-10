import type { BlogPostProps } from './types'
import { AuthorByline } from './AuthorByline'
import { MentionedStones } from './MentionedStones'
import { PostBody } from './PostBody'
import { PostCard } from './PostCard'
import {
  OVERLAY_VEIL,
  formatDate,
  formatReadingTime,
  heroCoverStyle,
  hideBrokenImage,
  monoFont,
  sansFont,
} from './format'

/**
 * View 2 — отдельный пост (/blog/[slug]). Breadcrumb + hero + reading column с телом +
 * подпись автора + live-блок упомянутых камней + блок «Читать дальше».
 */
export function BlogPost({
  post,
  author,
  relatedPosts,
  onBackToFeed,
  onBrowseInCatalog,
  onViewStone,
  onViewPost,
  onViewAbout,
}: BlogPostProps) {
  const primaryVarietyId = post.varietyIds[0]

  return (
    <div className="pt-10 pb-24 md:pt-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Хлебные крошки"
        className="mb-6 flex items-center text-xs uppercase tracking-wider text-stone-500 md:mb-8"
        style={monoFont}
      >
        <button
          type="button"
          onClick={onBackToFeed}
          className="shrink-0 transition-colors hover:text-[#576A8F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Журнал
        </button>
        <span className="mx-2 shrink-0">/</span>
        <span className="min-w-0 truncate text-[#576A8F]">{post.title}</span>
      </nav>

      {/* Immersive hero: мета + H1 поверх обложки */}
      <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl bg-stone-200 md:mb-16 md:aspect-[21/9]">
        <div aria-hidden className="absolute inset-0" style={heroCoverStyle} />
        <img
          src={post.coverPhotoUrl}
          alt={post.title}
          onError={hideBrokenImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className={OVERLAY_VEIL} />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
          <p
            className="text-xs uppercase tracking-wider text-stone-300"
            style={monoFont}
          >
            <span>{formatDate(post.publishedAt)}</span>
            <span> · </span>
            <span>{formatReadingTime(post.readingMinutes)}</span>
            <span> · </span>
            <button
              type="button"
              onClick={() =>
                primaryVarietyId && onBrowseInCatalog?.(primaryVarietyId)
              }
              className="uppercase tracking-wider text-[#B7BDF7] transition-colors hover:text-[#FF7444] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={monoFont}
            >
              {post.varietyLabel}
            </button>
          </p>
          <h1
            className="mt-3 max-w-[24ch] text-3xl font-medium text-white md:text-5xl xl:text-6xl"
            style={sansFont}
          >
            {post.title}
          </h1>
        </div>
      </div>

      {/* Reading column: lead + тело + подпись автора */}
      <div className="mx-auto max-w-[72ch]">
        {post.lead && (
          <p
            className="text-xl leading-relaxed text-stone-700"
            style={sansFont}
          >
            {post.lead}
          </p>
        )}
        <PostBody blocks={post.body} />
        <AuthorByline author={author} onViewAbout={onViewAbout} />
      </div>

      {/* Live-блок упомянутых камней */}
      {post.mentionedStones.length > 0 && (
        <MentionedStones
          stones={post.mentionedStones}
          onViewStone={onViewStone}
          onBrowseInCatalog={() =>
            primaryVarietyId && onBrowseInCatalog?.(primaryVarietyId)
          }
        />
      )}

      {/* Читать дальше */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 md:mt-28">
          <p
            className="text-xs uppercase tracking-wider text-[#576A8F]"
            style={monoFont}
          >
            Продолжение темы
          </p>
          <h2
            className="mt-2 mb-8 text-2xl font-medium text-stone-900 md:text-3xl"
            style={sansFont}
          >
            Читать дальше
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <PostCard
                key={related.id}
                post={related}
                onClick={() => onViewPost?.(related.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
