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
// Интерлиньяж задаём в процентах и обратно кеглю: дисплей (38–96px) 92–98%, названия 28–30px 110%,
// 18–24px 120%, основной текст 155%, мелкий интерфейсный текст 150%.
// Процент наследуется готовыми пикселями, поэтому задаём его там же, где кегль.
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
        <div className="grid h-[60px] grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] min-[1920px]:h-16">
          <nav className="hidden gap-7 text-[clamp(13px,0.7vw,15px)] text-black/60 md:flex leading-[150%]">
            <a href="/prototypes/home-a" className="text-black">Каталог</a>
            <a href="/encyclopedia" className="transition-colors hover:text-black">Энциклопедия</a>
            <a href="/blog" className="transition-colors hover:text-black">Журнал</a>
            <a href="/about" className="transition-colors hover:text-black">О гемологе</a>
          </nav>
          <a
            href="/prototypes/home-a"
            className="col-start-1 justify-self-start text-[clamp(17px,1.05vw,21px)] font-medium leading-[120%] uppercase tracking-[0.32em] md:col-start-2 md:justify-self-center"
            style={serif}
          >
            Драгоценные
          </a>
          <div className="col-start-3 flex items-center justify-end gap-6 text-[clamp(13px,0.7vw,15px)] leading-[150%]">
            <button type="button" aria-label="Поиск" className="text-black/60 transition-colors hover:text-black">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <a href={telegramHref} className="hidden border-b pb-0.5 sm:inline" style={{ borderColor: INK }}>
              Написать гемологу
            </a>
          </div>
        </div>
        <nav className="flex gap-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] border-t border-black/[0.05] px-[var(--gutter)] py-2.5 text-[13px] text-black/60 md:hidden leading-[150%]">
          <a href="/encyclopedia">Энциклопедия</a>
          <a href="/blog">Журнал</a>
          <a href="/about">О гемологе</a>
          <a href={telegramHref} className="text-black">Написать гемологу</a>
        </nav>
      </header>

      <main className="px-[var(--gutter)]">
        {/* Вступление: асимметрия, слева заголовок, справа один камень */}
        <section className="grid gap-8 pb-8 pt-8 md:grid-cols-12 md:pb-[clamp(40px,3vw,72px)] md:pt-[clamp(40px,3vw,72px)]">
          <div className="md:col-span-7 md:self-end">
            <h1
              className="text-balance pb-[0.08em] text-[38px] font-light leading-[98%] tracking-[-0.01em] md:text-[clamp(52px,4vw,96px)] md:leading-[92%]"
              style={serif}
            >
              Цветные камни
              <br />
              из <em className="font-light" style={{ color: EMERALD }}>личной коллекции</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-[clamp(14px,0.8vw,17px)] leading-[155%] text-black/60">
              {pluralStones(props.stones.length)} в единственном экземпляре. У каждого паспорт, макросъёмка
              и консультация Дмитрия Салятова.
            </p>
          </div>
          <a href={`/stones/${featured.slug}`} className="group hidden md:col-span-4 md:col-start-9 md:block xl:col-span-3 xl:col-start-10">
            <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
              <img
                src={featured.photoUrl}
                alt={featured.name}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <span className="text-[clamp(18px,1.1vw,22px)] leading-[120%]" style={serif}>{featured.name}</span>
              <span className="shrink-0 text-[clamp(13px,0.72vw,18px)] text-black/60 leading-[150%]">{formatCt(featured.weightCt)}</span>
            </div>
          </a>
        </section>

        {/* Индекс видов */}
        <section aria-label="Виды камней" className="border-t border-black/[0.07] py-5 md:py-6">
          <ul className="-mx-[var(--gutter)] flex gap-x-[clamp(18px,1.4vw,30px)] gap-y-1 overflow-x-auto whitespace-nowrap px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0" style={serif}>
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
        <section className="z-10 mx-[calc(var(--gutter)*-1)] flex flex-wrap items-center gap-x-8 gap-y-3 md:sticky md:top-0 border-y border-black/[0.07] bg-white/95 px-[var(--gutter)] py-4 backdrop-blur">
          <div className="flex w-full min-w-0 items-center gap-3 md:w-auto">
            <span className="text-[clamp(12px,0.65vw,16px)] text-black/50 leading-[150%]">Цвет</span>
            <div className="flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] md:flex-wrap">
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
                    className="h-[clamp(20px,1.1vw,28px)] w-[clamp(20px,1.1vw,28px)] shrink-0 rounded-full border border-black/15 transition-shadow"
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
            <span className="text-[clamp(12px,0.65vw,16px)] text-black/50 leading-[150%]">{pluralStones(c.total)}</span>
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
              <p className="text-[32px] font-light leading-[105%]" style={serif}>Таких камней сейчас нет</p>
              <button type="button" onClick={c.clearFilters} className="mt-6 border-b pb-0.5 text-[clamp(14px,0.78vw,19px)] leading-[150%]" style={{ borderColor: INK }}>
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
                    <p className="mt-2 text-[clamp(11px,0.6vw,14px)] uppercase tracking-[0.14em] text-black/45 md:mt-3 leading-[150%]">
                      {varietyName.get(s.varietyId)}
                    </p>
                    <h3 className="mt-1 text-[19px] leading-[120%] md:text-[clamp(22px,1.5vw,30px)] md:leading-[110%]" style={serif}>
                      {s.name}
                    </h3>
                    <p className="mt-2 flex flex-wrap gap-x-4 text-[clamp(13px,0.72vw,18px)] text-black/60 leading-[150%]">
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
                className="h-12 border px-10 text-[clamp(13px,0.72vw,18px)] tracking-[0.04em] transition-colors hover:bg-[#121314] hover:text-white active:scale-[0.98] leading-[150%]"
                style={{ borderColor: INK }}
              >
                Показать ещё
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-black/[0.07]">
        <div className="flex flex-col gap-6 px-[var(--gutter)] py-12 text-[clamp(13px,0.72vw,18px)] text-black/55 md:flex-row md:items-center md:justify-between leading-[150%]">
          <span className="text-[18px] leading-[120%] uppercase tracking-[0.32em] text-black" style={serif}>Драгоценные</span>
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
        className={`text-[18px] leading-[120%] transition-colors md:text-[clamp(19px,1.15vw,24px)] ${active ? "italic" : "text-black/40 hover:text-black"}`}
        style={active ? { color: EMERALD } : undefined}
      >
        {label}
        <sup className="ml-0.5 font-sans text-[10px] not-italic text-black/40 leading-[0%]" style={{ fontFamily: "Manrope, sans-serif" }}>
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
    <label className="flex items-center gap-3 text-[clamp(13px,0.72vw,18px)] leading-[150%]">
      <span className="text-[clamp(12px,0.65vw,16px)] text-black/50 leading-[150%]">{label}</span>
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
