// Главная и страницы видов: вступление, индекс видов, строка фильтров, сетка с автоподгрузкой.
// На главной во вступлении слайд-шоу, на странице вида — заголовок и описание вида.
import { useMemo } from "react";
import { Breadcrumbs, HAIRLINE, LoadMore, STONE_GRID, StoneCard, T, useGridColumns } from "../ui";
import { CatalogFilters } from "./CatalogFilters";
import { HeroSlideshow, type HeroSlide } from "./HeroSlideshow";
import { useCatalogState, type CatalogData } from "./useCatalogState";

type Intro =
  | { kind: "home"; slides: HeroSlide[] }
  | { kind: "variety"; title: string; paragraphs: string[]; crumbs: { label: string; href?: string }[] };

interface Props extends CatalogData {
  intro: Intro;
  varietyId?: string | null;
  routeColorId?: string | null;
}

const PAGE_SIZE = 24;

export function CatalogPage({ intro, varietyId = null, routeColorId = null, ...data }: Props) {
  const c = useCatalogState(data, { varietyId, routeColorId, pageSize: PAGE_SIZE });
  const cols = useGridColumns();
  // Пока есть «Показать ещё», последний ряд всегда полный.
  const visible = c.hasMore ? c.shown.slice(0, Math.max(cols, c.shown.length - (c.shown.length % cols))) : c.shown;

  const varietyName = useMemo(() => new Map(data.varieties.map((v) => [v.id, v.name])), [data.varieties]);
  const colorHex = useMemo(() => new Map(data.colors.map((col) => [col.id, col.hex])), [data.colors]);
  const totalStones = data.stones.length;

  return (
    <div className="px-[var(--gutter)]">
      {intro.kind === "home" ? (
        // Вступление: асимметрия, слева заголовок, справа слайд-шоу
        <section className="grid gap-8 pb-8 pt-8 md:grid-cols-12 md:pb-[clamp(40px,3vw,72px)] md:pt-[clamp(40px,3vw,72px)]">
          <div className="md:col-span-7 md:self-end">
            <h1 className={T.display}>
              Цветные камни
              <br />
              из <em className="text-emerald">личной коллекции</em>
            </h1>
            <p className={`mt-5 max-w-[46ch] ${T.lead}`}>
              Каждый камень в единственном экземпляре. У каждого паспорт, макросъёмка и консультация Дмитрия Салятова.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <HeroSlideshow slides={intro.slides} />
          </div>
        </section>
      ) : (
        <section className="grid gap-6 pb-8 pt-8 md:grid-cols-12 md:gap-8 md:pb-[clamp(40px,3vw,72px)] md:pt-[clamp(32px,2.4vw,56px)]">
          <div className="md:col-span-7 md:self-end">
            <Breadcrumbs items={intro.crumbs} />
            <h1 className={`mt-5 ${T.display}`}>{intro.title}</h1>
          </div>
          <div className="space-y-3 md:col-span-5 md:col-start-8 md:self-end">
            {intro.paragraphs.map((p, i) => (
              <p key={i} className={`max-w-[52ch] ${T.lead}`}>
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Индекс видов: настоящие ссылки на страницы видов */}
      <nav aria-label="Виды камней" className={`border-t ${HAIRLINE} py-5 md:py-6`}>
        <ul className="-mx-[var(--gutter)] flex gap-x-[clamp(18px,1.4vw,30px)] gap-y-1 overflow-x-auto whitespace-nowrap px-[var(--gutter)] font-serif [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          <VarietyLink href="/" label="Все камни" count={totalStones} active={varietyId === null} />
          {data.varieties.map((v) => (
            <VarietyLink key={v.id} href={`/catalog/${v.slug}`} label={v.name} count={v.stoneCount} active={varietyId === v.id} />
          ))}
        </ul>
      </nav>

      <CatalogFilters c={c} />

      <section aria-label="Камни" className="pb-24 pt-12">
        {c.shown.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-[32px] font-light leading-[105%]">Таких камней сейчас нет</p>
            <p className={`mx-auto mt-4 max-w-[44ch] ${T.lead}`}>
              Дмитрий может подобрать камень под ваш запрос — напишите ему.
            </p>
            <button type="button" onClick={c.clearFilters} className={`mt-6 border-b border-ink pb-0.5 ${T.ui}`}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <ul className={STONE_GRID}>
            {visible.map((s, i) => (
              <li key={s.id}>
                <StoneCard
                  eager={i < 4}
                  stone={{
                    ...s,
                    colorHex: colorHex.get(s.colorId) ?? "#8a8a8a",
                    varietyName: varietyId ? undefined : varietyName.get(s.varietyId),
                  }}
                />
              </li>
            ))}
          </ul>
        )}

        {c.hasMore && <LoadMore onLoad={c.showMore} />}
      </section>
    </div>
  );
}

function VarietyLink({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <li>
      <a
        href={href}
        aria-current={active ? "page" : undefined}
        className={`text-[18px] leading-[120%] transition-colors md:text-[clamp(19px,1.15vw,24px)] ${active ? "text-emerald" : "text-black/75 hover:text-black"}`}
      >
        {/* Подчёркивание только на названии: со ссылки оно протянулось бы и под счётчик. */}
        <span className={active ? "underline decoration-1 underline-offset-[0.25em]" : undefined}>{label}</span>
        <sup className="ml-0.5 font-sans text-[10px] leading-[0%] text-black/55">{count}</sup>
      </a>
    </li>
  );
}
