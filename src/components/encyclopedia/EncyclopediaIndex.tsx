// Оглавление энциклопедии: вступление и карточки видов. Без интерактива — рендерится на сборке.
import { pluralStones, withBase } from "../../lib/format";
import { HAIRLINE, T, TextLink } from "../ui";
import type { StoneVariety } from "./types";

const INTRO = [
  "Здесь Дмитрий Салятов собирает знания о камнях так, как их различает гемолог: по минералогическим классам, а не по маркетинговым ярлыкам. Каждая статья — о виде: откуда он родом, какими бывают цвета и огранки, на что смотреть при оценке.",
  "Энциклопедия идёт рядом с каталогом: из любого раздела можно перейти к камням, которые сейчас есть в коллекции.",
];

export function EncyclopediaIndex({ varieties }: { varieties: StoneVariety[] }) {
  return (
    <div className="px-[var(--gutter)] pb-24">
      <header className="grid gap-6 pb-10 pt-8 lg:grid-cols-12 lg:gap-8 md:pb-[clamp(48px,3.5vw,80px)] md:pt-[clamp(40px,3vw,72px)]">
        <div className="lg:col-span-7 lg:self-end">
          <p className={T.eyebrow}>Справочник коллекционера</p>
          <h1 className={`mt-4 ${T.display}`}>
            Энциклопедия <em className="text-emerald">камней</em>
          </h1>
        </div>
        <div className="space-y-3 lg:col-span-5 lg:col-start-8 lg:self-end">
          {INTRO.map((p, i) => (
            <p key={i} className={`max-w-[52ch] ${T.lead}`}>
              {p}
            </p>
          ))}
        </div>
      </header>

      <ul className={`grid gap-x-[clamp(32px,2.2vw,56px)] gap-y-14 border-t ${HAIRLINE} pt-12 md:grid-cols-2 md:gap-y-20 md:pt-16 min-[1024px]:grid-cols-3`}>
        {varieties.map((v) => (
          <li key={v.id}>
            <article>
              <a href={withBase(`/encyclopedia/${v.slug}`)} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-paper">
                  <img
                    src={v.coverPhotoUrl}
                    alt={v.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <p className={`mt-4 ${T.eyebrow}`}>{v.classLabel}</p>
                <h2 className={`mt-1 transition-colors group-hover:text-emerald ${T.h3}`}>{v.name}</h2>
                <p className={`mt-2 line-clamp-3 ${T.lead}`}>{v.teaser}</p>
              </a>
              <div className={`mt-4 flex flex-wrap gap-x-6 gap-y-2 ${T.ui}`}>
                <TextLink href={withBase(`/encyclopedia/${v.slug}`)}>Читать статью</TextLink>
                {v.stoneCount > 0 && (
                  <a href={withBase(`/catalog/${v.slug}`)} className="text-black/60 transition-colors hover:text-black">
                    {pluralStones(v.stoneCount)} в коллекции
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
