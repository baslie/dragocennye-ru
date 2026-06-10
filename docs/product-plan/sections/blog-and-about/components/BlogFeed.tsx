import type { BlogFeedProps } from '../types'
import { FeaturedPost } from './FeaturedPost'
import { PostCard } from './PostCard'
import { VarietyFilter } from './VarietyFilter'
import { monoFont, sansFont } from './format'

const INTRO =
  'Дмитрий Салятов разбирает камни так, как их видит гемолог: что делает с корундом печь, почему происхождение важнее размера и за что коллекционеры платят премию. Без маркетинга — только то, что видно под лупой.'

/**
 * View 1 — лента блога (/blog). Hero + фильтр по виду + featured-пост (при «Все») +
 * editorial-grid остальных постов. Фильтрация и featured-логика выводятся из props.
 */
export function BlogFeed({
  posts,
  topics,
  activeTopicId,
  onFilterByVariety,
  onViewPost,
}: BlogFeedProps) {
  const filtered =
    activeTopicId === null
      ? posts
      : posts.filter((post) => post.varietyIds.includes(activeTopicId))

  const featured =
    activeTopicId === null ? (posts.find((post) => post.isFeatured) ?? null) : null

  const gridPosts = featured
    ? filtered.filter((post) => post.id !== featured.id)
    : filtered

  const isEmpty = filtered.length === 0

  return (
    <div className="pt-10 pb-24 md:pt-14">
      {/* Hero */}
      <header className="mb-12 md:mb-16">
        <p
          className="mb-4 text-xs uppercase tracking-wider text-[#576A8F]"
          style={monoFont}
        >
          Журнал гемолога
        </p>
        <h1
          className="text-4xl font-medium text-stone-900 md:text-5xl xl:text-6xl"
          style={sansFont}
        >
          Журнал
        </h1>
        <p
          className="mt-6 max-w-[72ch] text-lg leading-relaxed text-stone-700"
          style={sansFont}
        >
          {INTRO}
        </p>
      </header>

      {/* Фильтр по виду */}
      <div className="mb-12 md:mb-16">
        <VarietyFilter
          topics={topics}
          activeTopicId={activeTopicId}
          onFilter={onFilterByVariety}
        />
      </div>

      {isEmpty ? (
        <EmptyState onReset={() => onFilterByVariety?.(null)} />
      ) : (
        <>
          {featured && (
            <div className="mb-16 md:mb-20">
              <FeaturedPost
                post={featured}
                onClick={() => onViewPost?.(featured.id)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
            {gridPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onViewPost?.(post.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-[#FFF8DE] px-8 py-16 text-center">
      <h3
        className="text-2xl font-medium text-stone-900"
        style={sansFont}
      >
        Пока нет публикаций об этом камне
      </h3>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-lg border border-[#576A8F] px-6 py-3 text-xs uppercase tracking-wider text-[#576A8F] transition-colors hover:bg-[#576A8F] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8DE]"
        style={monoFont}
      >
        Сбросить фильтр
      </button>
    </div>
  )
}
