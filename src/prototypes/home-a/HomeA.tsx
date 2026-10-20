// Макет A «Ювелирный дом»: editorial luxury. Cormorant Garamond + Manrope,
// чернила на белом, единственный акцент — изумрудный.
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  PRICE_BANDS,
  SORT_LABELS,
  formatCt,
  formatPrice,
  pluralStones,
  useCatalogState,
  type CatalogData,
  type PriceBand,
} from "../useCatalogState";
import type { SortOption, Stone } from "../../components/catalog/types";

interface Props extends CatalogData {
  telegramHref: string;
  featured: Stone;
}

const INK = "#121314";
const EMERALD = "#0d5c4b";
const serif = { fontFamily: '"Cormorant Garamond", Georgia, serif' };
// Боковой отступ растёт вместе с экраном: сайт занимает всю ширину окна без пустых полей.
const GUTTER = "clamp(20px, 3.5vw, 96px)";

// Число колонок сетки — совпадает с брейкпоинтами классов grid-cols-* ниже.
const COLUMN_QUERIES: [string, number][] = [
  ["(min-width: 1440px)", 4],
  ["(min-width: 1024px)", 3],
];

function useGridColumns() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const lists = COLUMN_QUERIES.map(([q]) => window.matchMedia(q));
    const update = () => setCols(COLUMN_QUERIES.find((_, i) => lists[i].matches)?.[1] ?? 2);
    update();
    lists.forEach((l) => l.addEventListener("change", update));
    return () => lists.forEach((l) => l.removeEventListener("change", update));
  }, []);
  return cols;
}

export function HomeA(props: Props) {
  const { varieties, featured, telegramHref } = props;
  const c = useCatalogState(props, 24);
  const cols = useGridColumns();
  // Пока есть «Показать ещё», последний ряд всегда полный.
  const visible = c.hasMore ? c.shown.slice(0, Math.max(cols, c.shown.length - (c.shown.length % cols))) : c.shown;
  const varietyName = new Map(varieties.map((v) => [v.id, v.name]));

  return (
    <div
      className="min-h-[100dvh] bg-white antialiased"
      style={{ color: INK, fontFamily: '"Manrope", system-ui, sans-serif', ["--gutter" as string]: GUTTER }}
    >
      {/* Шапка */}
      <header className="border-b border-black/[0.07]">
        <div className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] min-[1920px]:h-20">
          <nav className="hidden gap-8 text-[clamp(13px,0.72vw,18px)] text-black/60 md:flex">
            <a href="/prototypes/home-a" className="text-black">Каталог</a>
            <a href="/encyclopedia" className="transition-colors hover:text-black">Энциклопедия</a>
            <a href="/blog" className="transition-colors hover:text-black">Журнал</a>
            <a href="/about" className="transition-colors hover:text-black">О гемологе</a>
          </nav>
          <a
            href="/prototypes/home-a"
            className="col-start-1 justify-self-start text-[clamp(20px,1.5vw,28px)] font-medium uppercase tracking-[0.32em] md:col-start-2 md:justify-self-center"
            style={serif}
          >
            Драгоценные
          </a>
          <div className="col-start-3 flex items-center justify-end gap-6 text-[clamp(13px,0.72vw,18px)]">
            <button type="button" aria-label="Поиск" className="text-black/60 transition-colors hover:text-black">
              <Search className="h-[clamp(18px,1vw,24px)] w-[clamp(18px,1vw,24px)]" strokeWidth={1.5} />
            </button>
            <a href={telegramHref} className="hidden border-b pb-0.5 sm:inline" style={{ borderColor: INK }}>
              Написать гемологу
            </a>
          </div>
        </div>
        <nav className="flex gap-6 overflow-x-auto border-t border-black/[0.05] px-[var(--gutter)] py-3 text-[clamp(13px,0.72vw,18px)] text-black/60 md:hidden">
          <a href="/encyclopedia">Энциклопедия</a>
          <a href="/blog">Журнал</a>
          <a href="/about">О гемологе</a>
          <a href={telegramHref} className="text-black">Написать гемологу</a>
        </nav>
      </header>

      <main className="px-[var(--gutter)]">
        {/* Вступление: асимметрия, слева заголовок, справа один камень */}
        <section className="grid gap-10 pb-12 pt-12 md:grid-cols-12 md:pb-[clamp(64px,5vw,128px)] md:pt-[clamp(64px,5vw,128px)]">
          <div className="md:col-span-7 md:self-end">
            <h1
              className="text-balance text-[44px] font-light leading-[1.02] tracking-[-0.01em] md:text-[clamp(64px,5.8vw,150px)]"
              style={serif}
            >
              Цветные камни
              <br />
              из <em className="font-light" style={{ color: EMERALD }}>личной коллекции</em>
            </h1>
            <p className="mt-8 max-w-[44ch] text-[clamp(15px,0.85vw,21px)] leading-relaxed text-black/60">
              {pluralStones(props.stones.length)} в единственном экземпляре. У каждого паспорт, макросъёмка
              и консультация Дмитрия Салятова.
            </p>
          </div>
          <a href={`/stones/${featured.slug}`} className="group md:col-span-4 md:col-start-9">
            <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
              <img
                src={featured.photoUrl}
                alt={featured.name}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-[clamp(20px,1.4vw,28px)] leading-tight" style={serif}>{featured.name}</span>
              <span className="shrink-0 text-[clamp(13px,0.72vw,18px)] text-black/60">{formatCt(featured.weightCt)}</span>
            </div>
          </a>
        </section>

        {/* Индекс видов */}
        <section aria-label="Виды камней" className="border-t border-black/[0.07] py-10">
          <ul className="flex flex-wrap gap-x-[clamp(28px,2vw,48px)] gap-y-3" style={serif}>
            <VarietyLink label="Все камни" count={props.stones.length} active={c.varietyId === null} onClick={() => c.setVarietyId(null)} />
            {varieties.map((v) => (
              <VarietyLink
                key={v.id}
                label={v.name}
                count={v.stoneCount}
                active={c.varietyId === v.id}
                onClick={() => c.setVarietyId(v.id)}
              />
            ))}
          </ul>
        </section>

        {/* Фильтры: одна тихая строка */}
        <section className="sticky top-0 z-10 mx-[calc(var(--gutter)*-1)] flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-black/[0.07] bg-white/95 px-[var(--gutter)] py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-[clamp(12px,0.65vw,16px)] text-black/50">Цвет</span>
            <div className="flex flex-wrap gap-2">
              {c.availableColors.map((col) => {
                const on = c.colorIds.includes(col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    title={col.name}
                    aria-label={col.name}
                    aria-pressed={on}
                    onClick={() => c.toggleColor(col.id)}
                    className="h-[clamp(20px,1.1vw,28px)] w-[clamp(20px,1.1vw,28px)] rounded-full border border-black/15 transition-shadow"
                    style={{
                      backgroundColor: col.hex,
                      boxShadow: on ? `0 0 0 2px #fff, 0 0 0 3px ${INK}` : undefined,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <Select
            label="Цена"
            value={c.priceBand}
            onChange={(v) => c.setPriceBand(v as PriceBand)}
            options={PRICE_BANDS.map((b) => [b.id, b.label])}
          />
          <div className="ml-auto flex items-center gap-8">
            <span className="text-[clamp(12px,0.65vw,16px)] text-black/50">{pluralStones(c.total)}</span>
            <Select
              label="Порядок"
              value={c.sort}
              onChange={(v) => c.setSort(v as SortOption)}
              options={Object.entries(SORT_LABELS)}
            />
          </div>
        </section>

        {/* Сетка */}
        <section className="pb-24 pt-12">
          {c.shown.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[32px] font-light" style={serif}>Таких камней сейчас нет</p>
              <button type="button" onClick={c.clearFilters} className="mt-6 border-b pb-0.5 text-[clamp(14px,0.78vw,19px)]" style={{ borderColor: INK }}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-[clamp(32px,2.2vw,56px)] md:gap-y-16 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4">
              {visible.map((s) => (
                <li key={s.id}>
                  <a href={`/stones/${s.slug}`} className="group block">
                    <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-2 text-[clamp(11px,0.6vw,14px)] uppercase tracking-[0.14em] text-black/45 md:mt-3">
                      {varietyName.get(s.varietyId)}
                    </p>
                    <h3 className="mt-1 text-[19px] leading-snug md:text-[clamp(22px,1.5vw,30px)]" style={serif}>
                      {s.name}
                    </h3>
                    <p className="mt-2 flex flex-wrap gap-x-4 text-[clamp(13px,0.72vw,18px)] text-black/60">
                      <span>{formatCt(s.weightCt)}</span>
                      <span style={{ color: INK }} className="font-medium">{formatPrice(s.price)}</span>
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {c.hasMore && (
            <div className="mt-20 flex justify-center">
              <button
                type="button"
                onClick={c.showMore}
                className="h-12 border px-10 text-[clamp(13px,0.72vw,18px)] tracking-[0.04em] transition-colors hover:bg-[#121314] hover:text-white active:scale-[0.98]"
                style={{ borderColor: INK }}
              >
                Показать ещё
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-black/[0.07]">
        <div className="flex flex-col gap-6 px-[var(--gutter)] py-12 text-[clamp(13px,0.72vw,18px)] text-black/55 md:flex-row md:items-center md:justify-between">
          <span className="text-[18px] uppercase tracking-[0.32em] text-black" style={serif}>Драгоценные</span>
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            <a href="/encyclopedia" className="hover:text-black">Энциклопедия</a>
            <a href="/blog" className="hover:text-black">Журнал</a>
            <a href="/about" className="hover:text-black">О гемологе</a>
            <a href={telegramHref} className="hover:text-black">Telegram</a>
          </nav>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

function VarietyLink({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`text-[22px] leading-[1.25] transition-colors md:text-[clamp(28px,1.9vw,40px)] ${active ? "italic" : "text-black/40 hover:text-black"}`}
        style={active ? { color: EMERALD } : undefined}
      >
        {label}
        <sup className="ml-1 font-sans text-[clamp(11px,0.6vw,14px)] not-italic text-black/40" style={{ fontFamily: "Manrope, sans-serif" }}>
          {count}
        </sup>
      </button>
    </li>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex items-center gap-3 text-[clamp(13px,0.72vw,18px)]">
      <span className="text-[clamp(12px,0.65vw,16px)] text-black/50">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none border-b border-black/20 bg-transparent pb-0.5 pr-1 focus:border-black focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}
