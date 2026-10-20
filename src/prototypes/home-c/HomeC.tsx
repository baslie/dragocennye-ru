// Макет C «Свет и стекло»: Apple-подход. Inter Tight, стеклянная капсула-навигация,
// скруглённые плитки, мягкие отклики на нажатие и наведение.
import { Search } from "lucide-react";
import {
  PRICE_BANDS,
  SORT_LABELS,
  formatCt,
  formatPrice,
  pluralStones,
  useCatalogState,
  type CatalogData,
} from "../useCatalogState";
import type { SortOption, Stone } from "../../components/catalog/types";
import "./home-c.css";

interface Props extends CatalogData {
  telegramHref: string;
  featured: Stone;
}

export function HomeC(props: Props) {
  const { varieties, telegramHref } = props;
  const c = useCatalogState(props, 13);
  const varietyName = new Map(varieties.map((v) => [v.id, v.name]));

  return (
    <div className="hc min-h-[100dvh] bg-white antialiased">
      {/* Плавающая стеклянная капсула */}
      <header className="fixed inset-x-0 top-3 z-30 flex justify-center px-3 md:top-5">
        <div className="hc-glass flex h-14 w-full max-w-[880px] items-center gap-2 rounded-full pl-6 pr-2">
          <a href="/prototypes/home-c" className="mr-auto text-[17px] font-semibold tracking-[-0.02em] md:mr-6">
            Драгоценные
          </a>
          <nav className="mr-auto hidden gap-1 text-[14px] text-[var(--hc-muted)] md:flex">
            <a href="/prototypes/home-c" className="rounded-full px-3 py-1.5 text-[var(--hc-ink)]">Каталог</a>
            <a href="/encyclopedia" className="rounded-full px-3 py-1.5 transition-colors hover:text-[var(--hc-ink)]">Энциклопедия</a>
            <a href="/blog" className="rounded-full px-3 py-1.5 transition-colors hover:text-[var(--hc-ink)]">Журнал</a>
            <a href="/about" className="rounded-full px-3 py-1.5 transition-colors hover:text-[var(--hc-ink)]">О гемологе</a>
          </nav>
          <button
            type="button"
            aria-label="Поиск"
            className="hc-press flex h-10 w-10 items-center justify-center rounded-full text-[var(--hc-muted)] hover:bg-black/5 hover:text-[var(--hc-ink)]"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
          <a
            href={telegramHref}
            className="hc-press flex h-10 items-center rounded-full bg-[var(--hc-ink)] px-5 text-[14px] font-medium text-white"
          >
            Написать
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1360px] px-4 md:px-8">
        {/* Вступление: короткий манифест по центру */}
        <section className="pb-10 pt-32 text-center md:pb-14 md:pt-40">
          <h1 className="mx-auto max-w-[20ch] text-balance text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[64px]">
            Редкие цветные камни.{" "}
            <span className="text-[#a1a1a6]">Каждый в единственном экземпляре.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--hc-muted)]">
            {pluralStones(props.stones.length)} с паспортом и макросъёмкой. Выберите вид, цвет и бюджет.
          </p>
          <nav className="mt-6 flex justify-center gap-5 text-[14px] text-[var(--hc-muted)] md:hidden">
            <a href="/encyclopedia">Энциклопедия</a>
            <a href="/blog">Журнал</a>
            <a href="/about">О гемологе</a>
          </nav>
        </section>

        {/* Лента видов */}
        <section aria-label="Виды камней" className="hc-fade-x -mx-4 overflow-x-auto md:-mx-8">
          <ul className="flex w-max gap-2 px-6 py-2 md:mx-auto md:px-8">
            <VarietyPill label="Все" active={c.varietyId === null} onClick={() => c.setVarietyId(null)} />
            {varieties.map((v) => (
              <VarietyPill
                key={v.id}
                label={v.name}
                image={v.imageUrl}
                active={c.varietyId === v.id}
                onClick={() => c.setVarietyId(v.id)}
              />
            ))}
          </ul>
        </section>

        {/* Фильтры */}
        <section className="mt-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-[24px] bg-[var(--hc-surface)] p-1 md:rounded-full" role="group" aria-label="Цвет">
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
                  className={`hc-press flex h-8 w-8 items-center justify-center rounded-full ${on ? "bg-white shadow-[0_1px_4px_rgb(0_0_0/0.12)]" : "hover:bg-white/70"}`}
                >
                  <span className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]" style={{ backgroundColor: col.hex }} />
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <PillSelect
              label="Цена"
              value={c.priceBand}
              onChange={(v) => c.setPriceBand(v as typeof c.priceBand)}
              options={PRICE_BANDS.map((b) => [b.id, b.label])}
            />
            <PillSelect
              label="Сортировка"
              value={c.sort}
              onChange={(v) => c.setSort(v as SortOption)}
              options={Object.entries(SORT_LABELS)}
            />
          </div>
        </section>

        {/* Сетка с одной крупной плиткой для ритма */}
        <section className="pb-24 pt-8">
          {c.shown.length === 0 ? (
            <div className="rounded-[28px] bg-[var(--hc-surface)] px-6 py-24 text-center">
              <p className="text-[24px] font-semibold tracking-[-0.02em]">Таких камней сейчас нет</p>
              <button
                type="button"
                onClick={c.clearFilters}
                className="hc-press mt-6 h-11 rounded-full bg-[var(--hc-ink)] px-6 text-[14px] font-medium text-white"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" key={`${c.varietyId}-${c.colorIds.join()}-${c.priceBand}-${c.sort}`}>
              {c.shown.map((s, i) => {
                const big = i === 0;
                return (
                  <li
                    key={s.id}
                    className={`hc-enter ${big ? "sm:col-span-2 lg:row-span-2" : ""}`}
                    style={{ ["--i" as string]: Math.min(i, 12) }}
                  >
                    <a
                      href={`/stones/${s.slug}`}
                      className="hc-tile flex h-full flex-col rounded-[28px] bg-[var(--hc-surface)] p-2.5"
                    >
                      <div className={`overflow-hidden rounded-[20px] bg-[#e8e8ed] ${big ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-[4/3]"}`}>
                        <img src={s.photoUrl} alt={s.name} loading={i < 4 ? "eager" : "lazy"} className="h-full w-full object-cover" />
                      </div>
                      <div className={`flex items-end justify-between gap-3 px-2.5 pb-1.5 ${big ? "pt-5" : "pt-3.5"}`}>
                        <div className="min-w-0">
                          <p className="text-[12px] text-[var(--hc-muted)]">
                            {varietyName.get(s.varietyId)}, {formatCt(s.weightCt)}
                          </p>
                          <h3 className={`mt-0.5 truncate font-semibold tracking-[-0.015em] ${big ? "text-[24px]" : "text-[16px]"}`}>
                            {s.name}
                          </h3>
                        </div>
                        <span className={`shrink-0 font-medium tabular-nums ${big ? "text-[17px]" : "text-[14px]"}`}>
                          {formatPrice(s.price)}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {c.hasMore && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={c.showMore}
                className="hc-press h-12 rounded-full bg-[var(--hc-surface)] px-8 text-[15px] font-medium hover:bg-[#ebebed]"
              >
                Показать ещё
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-black/[0.06]">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-4 py-10 text-[13px] text-[var(--hc-muted)] md:flex-row md:items-center md:justify-between md:px-8">
          <span className="text-[15px] font-semibold text-[var(--hc-ink)]">Драгоценные</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/encyclopedia" className="hover:text-[var(--hc-ink)]">Энциклопедия</a>
            <a href="/blog" className="hover:text-[var(--hc-ink)]">Журнал</a>
            <a href="/about" className="hover:text-[var(--hc-ink)]">О гемологе</a>
          </nav>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}

function VarietyPill({ label, image, active, onClick }: { label: string; image?: string; active: boolean; onClick: () => void }) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`hc-press flex h-11 items-center gap-2.5 rounded-full text-[14px] font-medium ${image ? "pl-1.5 pr-4" : "px-5"} ${active ? "bg-[var(--hc-ink)] text-white" : "bg-[var(--hc-surface)] hover:bg-[#ebebed]"}`}
      >
        {image && <img src={image} alt="" loading="lazy" className="h-8 w-8 rounded-full object-cover" />}
        {label}
      </button>
    </li>
  );
}

function PillSelect({
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
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-full bg-[var(--hc-surface)] px-4 text-[13px] font-medium transition-colors hover:bg-[#ebebed] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hc-ink)]"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}
