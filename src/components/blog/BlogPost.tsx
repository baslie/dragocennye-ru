// Публикация журнала: крошки, заголовок и лид, кадр 16:9, колонка чтения, подпись автора,
// камни из материала и «Читать дальше». Без интерактива — рендерится на сборке.
import { typo, withBase } from "../../lib/format";
import { Breadcrumbs, HAIRLINE, PostCard, STONE_GRID, StoneCard, T, TextLink, postMeta } from "../ui";
import { Portrait } from "./Portrait";
import { PostBody } from "./PostBody";
import type { BlogPostProps } from "./types";

export function BlogPost({ post, author, relatedPosts, catalogHref }: BlogPostProps) {
  return (
    <div className="px-[var(--gutter)] pb-24">
      <header className="pb-10 pt-6 md:pb-14 md:pt-8">
        <Breadcrumbs items={[{ label: "Журнал", href: withBase("/blog") }, { label: post.varietyLabel }]} />
        <div className="mx-auto mt-10 max-w-[1100px] text-center md:mt-16">
          <p className={T.label}>{postMeta(post)}</p>
          <h1 className={`mx-auto mt-4 max-w-[24ch] ${T.h1}`}>{typo(post.title)}</h1>
          {post.lead && <p className={`mx-auto mt-6 max-w-[56ch] ${T.lead}`}>{typo(post.lead)}</p>}
        </div>
      </header>

      <div className="aspect-[16/9] overflow-hidden bg-paper md:aspect-[21/9]">
        <img src={post.coverPhotoUrl} alt="" className="h-full w-full object-cover" />
      </div>

      <article className="mx-auto max-w-[68ch] pt-8 md:pt-12">
        <PostBody blocks={post.body} />

        <footer className={`mt-14 flex items-center gap-4 border-t ${HAIRLINE} pt-8`}>
          <Portrait url={author.portraitUrl} name={author.name} className="h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[20px] leading-[120%]">{author.name}</p>
            <p className={`mt-0.5 ${T.label}`}>{author.role}</p>
          </div>
          <TextLink href={withBase("/about")} className={`shrink-0 ${T.ui}`}>
            О гемологе
          </TextLink>
        </footer>
      </article>

      {post.mentionedStones.length > 0 && (
        <section aria-labelledby="mentioned" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="mentioned" className={T.h2}>
              Камни из материала
            </h2>
            <TextLink href={catalogHref} className={T.ui}>
              Смотреть в каталоге
            </TextLink>
          </div>
          <ul className={`mt-10 ${STONE_GRID}`}>
            {post.mentionedStones.map((s, i) => (
              <li key={s.id} className={i === 3 ? "min-[1024px]:max-[1439px]:hidden" : undefined}>
                <StoneCard stone={s} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section aria-labelledby="related" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
          <h2 id="related" className={T.h2}>
            Читать дальше
          </h2>
          <ul className="mt-10 grid gap-x-[clamp(32px,2.2vw,56px)] gap-y-12 md:grid-cols-2 min-[1024px]:grid-cols-3">
            {relatedPosts.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
