// Карточка публикации журнала: кадр 4:3, мета мелко, заголовок Spectral, лид.
// Нужна в ленте журнала, в статьях энциклопедии и на странице гемолога.
import { formatDate, typo } from "../../lib/format";
import { T } from "./type";

export interface CardPost {
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: string;
  readingMinutes?: number;
  varietyLabel?: string;
}

export const postMeta = (p: CardPost) =>
  [formatDate(p.publishedAt), p.readingMinutes ? `${p.readingMinutes} мин` : null, p.varietyLabel].filter(Boolean).join(" · ");

export function PostCard({ post }: { post: CardPost }) {
  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden bg-paper">
        <img
          src={post.coverPhotoUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
      <p className={`mt-3 ${T.label}`}>{postMeta(post)}</p>
      <h3 className="mt-1.5 text-balance font-serif text-[21px] leading-[120%] transition-colors group-hover:text-emerald md:text-[clamp(22px,1.4vw,28px)] md:leading-[115%]">
        {typo(post.title)}
      </h3>
      <p className={`mt-2 line-clamp-3 ${T.lead}`}>{typo(post.excerpt)}</p>
    </a>
  );
}
