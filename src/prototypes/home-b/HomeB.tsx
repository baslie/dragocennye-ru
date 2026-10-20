// Макет B «Галерея»: швейцарская сетка, камни как лоты. Onest + IBM Plex Mono,
// холодные нейтральные, один сочный акцент — коралловый.
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  PRICE_BANDS,
  SORT_LABELS,
  formatCt,
  formatPrice,
  lotNumber,
  plural,
  pluralStones,
  useCatalogState,
  type CatalogData,
} from "../useCatalogState";
import type { SortOption, Stone } from "../../components/catalog/types";

interface Props extends CatalogData {
  telegramHref: string;
  featured: Stone;
}

const INK = "#17171a";
const ACCENT = "#f0532b";
const mono = { fontFamily: '"IBM Plex Mono", ui-monospace, monospace' };

export function HomeB(props: Props) {
  const { varieties, telegramHref } = props;
  const c = useCatalogState(props, 12);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const varietyName = new Map(varieties.map((v) => [v.id, v.name]));
  const activeVariety = varieties.find((v) => v.id === c.varietyId);

  return (
    <div
      className="min-h-[100dvh] bg-white antialiased"
      style={{ color: INK, fontFamily: '"Onest", system-ui, sans-serif' }}
    >
      {/* Шапка */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-10 px-5 md:px-10">
          <a href="/prototypes/home-b" className="text-[19px] font-semibold tracking-[-0.03em]">
            Драгоценные<span style={{ color: ACCENT }}>.</span>
          </a>
          <nav className="hidden gap-7 text-[14px] text-zinc-500 md:flex">
            <a href="/prototypes/home-b" className="text-zinc-900">Каталог</a>
            <a href="/encyclopedia" className="hover:text-zinc-900">Энциклопедия</a>
            <a href="/blog" className="hover:text-zinc-900">Журнал</a>
            <a href="/about" className="hover:text-zinc-900">О гемологе</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="hidden h-9 w-64 items-center gap-2 rounded-[2px] bg-zinc-100 px-3 text-[13px] text-zinc-500 transition-colors hover:bg-zinc-200/70 lg:flex"
            >
              <Search size={15} strokeWidth={1.75} />
              Поиск по камням
            </button>
            <a
              href={telegramHref}
              className="flex h-9 items-center rounded-[2px] px-4 text-[13px] font-medium text-white transition-transform active:scale-[0.98]"
              style={{ backgroundColor: INK }}
            >
              Telegram
            </a>
          </div>
        </div>
        <nav className="flex gap-6 overflow-x-auto border-t border-zinc-100 px-5 py-2.5 text-[13px] text-zinc-500 md:hidden">
          <a href="/encyclopedia">Энциклопедия</a>
          <a href="/blog">Журнал</a>
          <a href="/about">О гемологе</a>
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Вступление: крупный гротеск + факты из каталога */}
        <section className="grid gap-8 pb-12 pt-14 md:grid-cols-12 md:pb-16 md:pt-20">
          <h1 className="text-balance text-[42px] font-medium leading-[0.98] tracking-[-0.045em] md:col-span-8 md:text-[88px]">
            Цветные камни
            <br />
            <span className="text-zinc-400">с паспортом гемолога</span>
          </h1>
          <dl className="grid grid-cols-3 gap-4 self-end border-t border-zinc-900 pt-4 md:col-span-4" style={mono}>
            <Fact value={String(props.stones.length)} label={`${plural(props.stones.length, ["камень", "камня", "камней"])} в наличии`} />
            <Fact value={String(varieties.length)} label={plural(varieties.length, ["вид", "вида", "видов"])} />
            <Fact value="1" label="экземпляр каждого камня" />
          </dl>
        </section>

        {/* Виды: плитки-образцы с прокруткой */}
        <section aria-label="Виды камней" className="-mx-5 md:-mx-10">
          <ul className="flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-4 md:scroll-px-10 [scrollbar-width:none] md:px-10">
            <SwatchTile
              label="Все"
              count={props.stones.length}
              active={c.varietyId === null}
              onClick={() => c.setVarietyId(null)}
            />
            {varieties.map((v) => (
              <SwatchTile
                key={v.id}
                label={v.name}
                count={v.stoneCount}
                image={v.imageUrl}
                active={c.varietyId === v.id}
                onClick={() => c.setVarietyId(v.id)}
              />
            ))}
          </ul>
        </section>

        <div className="mt-10 grid gap-10 pb-24 md:grid-cols-12">
          {/* Фильтры: липкая колонка на десктопе, раскрывающаяся панель на мобильном */}
          <aside className="md:col-span-3 xl:col-span-2">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex h-11 w-full items-center justify-between border border-zinc-200 px-4 text-[14px] md:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} strokeWidth={1.75} /> Фильтры
                {c.activeFilterCount > 0 && <span style={{ color: ACCENT }}>{c.activeFilterCount}</span>}
              </span>
              {filtersOpen && <X size={16} />}
            </button>
            <div className={`${filtersOpen ? "block" : "hidden"} mt-6 space-y-10 md:sticky md:top-24 md:mt-0 md:block`}>
              <FilterGroup title="Цвет">
                <ul className="space-y-1">
                  {c.availableColors.map((col) => {
                    const on = c.colorIds.includes(col.id);
                    return (
                      <li key={col.id}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => c.toggleColor(col.id)}
                          className={`flex w-full items-center gap-3 py-1 text-left text-[14px] transition-colors ${on ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: col.hex, boxShadow: on ? `0 0 0 2px #fff, 0 0 0 3.5px ${ACCENT}` : undefined }}
                          />
                          {col.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </FilterGroup>
              <FilterGroup title="Цена">
                <ul className="space-y-1">
                  {PRICE_BANDS.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        aria-pressed={c.priceBand === b.id}
                        onClick={() => c.setPriceBand(b.id)}
                        className={`flex w-full items-center gap-3 py-1 text-left text-[14px] ${c.priceBand === b.id ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}
                      >
                        <span
                          className="flex h-3.5 w-3.5 items-center justify-center rounded-full border"
                          style={{ borderColor: c.priceBand === b.id ? ACCENT : "#d4d4d8" }}
                        >
                          {c.priceBand === b.id && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />}
                        </span>
                        {b.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </FilterGroup>
              {c.activeFilterCount > 0 && (
                <button type="button" onClick={c.clearFilters} className="text-[13px] underline underline-offset-4">
                  Сбросить
                </button>
              )}
            </div>
          </aside>

          <section className="md:col-span-9 xl:col-span-10">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-zinc-200 pb-4">
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">
                {activeVariety?.name ?? "Все камни"}{" "}
                <span className="text-zinc-400">{c.total}</span>
              </h2>
              <label className="flex items-center gap-2 text-[13px] text-zinc-500">
                <span className="hidden sm:inline">Сортировка</span>
                <select
                  value={c.sort}
                  onChange={(e) => c.setSort(e.target.value as SortOption)}
                  className="h-9 cursor-pointer rounded-[2px] border border-zinc-200 bg-white px-2 text-zinc-900 focus:border-zinc-900 focus:outline-none"
                >
                  {Object.entries(SORT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </label>
            </div>

            {c.shown.length === 0 ? (
              <div className="border border-dashed border-zinc-300 py-20 text-center">
                <p className="text-[20px] font-medium">Под эти фильтры камней нет</p>
                <button type="button" onClick={c.clearFilters} className="mt-4 text-[14px] underline underline-offset-4">
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
                {c.shown.map((s) => (
                  <li key={s.id}>
                    <a href={`/stones/${s.slug}`} className="group block">
                      <div className="relative aspect-square overflow-hidden bg-zinc-100">
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500" style={mono}>
                        <span>№ {lotNumber(s.slug)}</span>
                        <span>{varietyName.get(s.varietyId)}</span>
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 text-[15px] font-medium leading-snug tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">
                        {s.name}
                      </h3>
                      <div className="mt-2 flex items-baseline justify-between border-t border-zinc-200 pt-2 text-[13px]" style={mono}>
                        <span className="text-zinc-500">{formatCt(s.weightCt)}</span>
                        <span className="font-medium text-zinc-900">{formatPrice(s.price)}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {c.hasMore && (
              <button
                type="button"
                onClick={c.showMore}
                className="mt-14 flex h-14 w-full items-center justify-center gap-3 border border-zinc-900 text-[14px] font-medium transition-colors hover:bg-zinc-900 hover:text-white active:scale-[0.995]"
              >
                Показать ещё <span className="text-zinc-400" style={mono}>{c.total - c.shown.length}</span>
              </button>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-12 text-[14px] text-zinc-500 md:grid-cols-12 md:px-10">
          <span className="text-[19px] font-semibold tracking-[-0.03em] text-zinc-900 md:col-span-4">
            Драгоценные<span style={{ color: ACCENT }}>.</span>
          </span>
          <nav className="flex flex-col gap-2 md:col-span-3">
            <a href="/encyclopedia" className="hover:text-zinc-900">Энциклопедия</a>
            <a href="/blog" className="hover:text-zinc-900">Журнал</a>
            <a href="/about" className="hover:text-zinc-900">О гемологе</a>
          </nav>
          <a href={telegramHref} className="hover:text-zinc-900 md:col-span-3">Telegram</a>
          <span className="md:col-span-2 md:text-right" style={mono}>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-[28px] font-medium tracking-[-0.03em] md:text-[34px]" style={{ fontFamily: "Onest, sans-serif" }}>
        {value}
      </dd>
      <dd className="mt-1 text-[11px] leading-tight text-zinc-500">{label}</dd>
    </div>
  );
}

function SwatchTile({
  label,
  count,
  image,
  active,
  onClick,
}: {
  label: string;
  count: number;
  image?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li className="shrink-0 snap-start">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className="group w-[112px] text-left"
      >
        <div
          className="aspect-square overflow-hidden bg-zinc-100 transition-shadow"
          style={{ boxShadow: active ? `inset 0 0 0 2px ${ACCENT}` : undefined }}
        >
          {image ? (
            <img src={image} alt="" loading="lazy" className={`h-full w-full object-cover transition-opacity ${active ? "opacity-100" : "opacity-90 group-hover:opacity-100"}`} />
          ) : (
            <div className="flex h-full items-center justify-center text-[28px] font-medium tracking-[-0.04em]">
              {count}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2 text-[13px]">
          <span className={active ? "font-medium" : "text-zinc-600"}>{label}</span>
          <span className="text-[11px] text-zinc-400" style={mono}>{count}</span>
        </div>
      </button>
    </li>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] uppercase tracking-[0.12em] text-zinc-400" style={mono}>{title}</h3>
      {children}
    </div>
  );
}
