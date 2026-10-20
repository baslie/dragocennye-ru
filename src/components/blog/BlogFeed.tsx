// Лента журнала: вступление, фильтр по виду камня, главный материал крупно и сетка публикаций.
// Фильтр клиентский — постов мало, отдельные страницы под каждый вид не нужны.
import { useState } from "react";
import { typo } from "../../lib/format";
import { HAIRLINE, PostCard, T, postMeta } from "../ui";
import type { BlogPostCard, Topic } from "./types";

const INTRO =
  "Дмитрий Салятов разбирает камни так, как их видит гемолог: что делает с корундом печь, почему происхождение важнее размера и за что коллекционеры платят премию. Без маркетинга — только то, что видно под лупой.";

export function BlogFeed({ posts, topics }: { posts: BlogPostCard[]; topics: Topic[] }) {
  const [topicId, setTopicId] = useState<string | null>(null);

  const filtered = topicId ? posts.filter((p) => p.varietyIds.includes(topicId)) : posts;
  // Главный материал выносим наверх только в ленте «Все».
  const featured = topicId === null ? (posts.find((p) => p.isFeatured) ?? null) : null;
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered;

  return (
    <div className="px-[var(--gutter)] pb-24">
      <header className="grid gap-6 pb-10 pt-8 lg:grid-cols-12 lg:gap-8 md:pb-[clamp(48px,3.5vw,80px)] md:pt-[clamp(40px,3vw,72px)]">
        <div className="lg:col-span-7 lg:self-end">
          <p className={T.eyebrow}>Журнал гемолога</p>
          <h1 className={`mt-4 ${T.display}`}>
            Камни <em className="text-emerald">под лупой</em>
          </h1>
        </div>
        <p className={`max-w-[52ch] lg:col-span-5 lg:col-start-8 lg:self-end ${T.lead}`}>{INTRO}</p>
      </header>

      <nav aria-label="Темы" className={`border-y ${HAIRLINE} py-5 md:py-6`}>
        <ul className="-mx-[var(--gutter)] flex gap-x-[clamp(18px,1.4vw,30px)] gap-y-1 overflow-x-auto whitespace-nowrap px-[var(--gutter)] font-serif [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          <TopicButton label="Все темы" count={posts.length} active={topicId === null} onClick={() => setTopicId(null)} />
          {topics.map((t) => (
            <TopicButton key={t.id} label={t.name} count={t.postCount} active={topicId === t.id} onClick={() => setTopicId(t.id)} />
          ))}
        </ul>
      </nav>

      {featured && (
        <a href={`/blog/${featured.slug}`} className={`group grid gap-6 border-b ${HAIRLINE} py-12 md:grid-cols-12 md:gap-8 md:py-16`}>
          <div className="aspect-video overflow-hidden bg-paper md:col-span-7">
            <img
              src={featured.coverPhotoUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          </div>
          <div className="md:col-span-5 md:self-end">
            <p className={T.eyebrow}>Главный материал</p>
            <h2 className={`mt-3 transition-colors group-hover:text-emerald ${T.h2}`}>{typo(featured.title)}</h2>
            <p className={`mt-4 max-w-[48ch] ${T.lead}`}>{typo(featured.excerpt)}</p>
            <p className={`mt-4 ${T.label}`}>{postMeta(featured)}</p>
          </div>
        </a>
      )}

      {rest.length > 0 ? (
        <ul className="grid gap-x-[clamp(32px,2.2vw,56px)] gap-y-14 pt-12 md:grid-cols-2 md:gap-y-16 md:pt-16 min-[1024px]:grid-cols-3">
          {rest.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      ) : (
        !featured && (
          <div className="py-24 text-center">
            <p className="font-serif text-[32px] font-light leading-[105%]">Пока нет публикаций об этом камне</p>
            <button type="button" onClick={() => setTopicId(null)} className={`mt-6 border-b border-ink pb-0.5 ${T.ui}`}>
              Показать все темы
            </button>
          </div>
        )
      )}
    </div>
  );
}

function TopicButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`text-[18px] leading-[120%] transition-colors md:text-[clamp(19px,1.15vw,24px)] ${active ? "text-emerald" : "text-black/75 hover:text-black"}`}
      >
        <span className={active ? "underline decoration-1 underline-offset-[0.25em]" : undefined}>{label}</span>
        <sup className="ml-0.5 font-sans text-[10px] leading-[0%] text-black/55">{count}</sup>
      </button>
    </li>
  );
}
