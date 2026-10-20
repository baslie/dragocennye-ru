// Строка фильтров над сеткой: цвет, цена, «Ещё фильтры», счётчик и порядок.
// «Ещё фильтры» раскрывает панель с огранкой, происхождением, обработкой и весом.
import { useEffect, useState } from "react";
import { pluralStones } from "../../lib/format";
import { Chip, Chips, HAIRLINE, Select, T } from "../ui";
import type { SortOption } from "./types";
import { PRICE_BANDS, SORT_LABELS, type PriceBand, type useCatalogState } from "./useCatalogState";

type State = ReturnType<typeof useCatalogState>;

export function CatalogFilters({ c }: { c: State }) {
  const [open, setOpen] = useState(false);
  const priceOptions = PRICE_BANDS.map((b) => [b.id, b.label] as [string, string]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section
      aria-label="Фильтры"
      className={`z-10 mx-[calc(var(--gutter)*-1)] border-y ${HAIRLINE} bg-white/95 px-[var(--gutter)] backdrop-blur md:sticky md:top-0`}
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <div className="flex w-full min-w-0 items-center gap-3 md:w-auto">
          <span className={T.label}>Цвет</span>
          <div className="flex gap-2 overflow-x-auto p-1 [scrollbar-width:none] md:flex-wrap">
            {c.options.colors.map((col) => {
              const on = c.colorId === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  title={col.name}
                  aria-label={col.name}
                  aria-pressed={on}
                  onClick={() => c.selectColor(col.id)}
                  className="h-[clamp(20px,1.1vw,28px)] w-[clamp(20px,1.1vw,28px)] shrink-0 rounded-full border border-black/15 transition-shadow"
                  style={{ backgroundColor: col.hex, boxShadow: on ? "0 0 0 2px #fff, 0 0 0 3px var(--color-ink)" : undefined }}
                />
              );
            })}
          </div>
        </div>
        {/* Цена: на широких экранах чипами, на узких — выпадающим списком. */}
        <div className="lg:hidden">
          <Select label="Цена" value={c.priceBand} onChange={(v) => c.setPriceBand(v as PriceBand)} options={priceOptions} />
        </div>
        <Chips label="Цена" value={c.priceBand} onChange={(v) => c.setPriceBand(v as PriceBand)} options={priceOptions} className="hidden lg:flex" />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="more-filters"
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-1.5 border-b pb-0.5 ${T.ui} ${open || c.extraCount ? "border-ink" : "border-black/20 text-black/75 hover:text-black"}`}
        >
          Ещё фильтры
          {c.extraCount > 0 && <span className="text-emerald">· {c.extraCount}</span>}
        </button>
        <div className="ml-auto flex items-center gap-8">
          <span className={T.label}>{pluralStones(c.total)}</span>
          <Select label="Порядок" value={c.sort} onChange={(v) => c.setSort(v as SortOption)} options={Object.entries(SORT_LABELS)} />
        </div>
      </div>

      {open && (
        <div id="more-filters" className={`max-h-[60vh] overflow-y-auto border-t ${HAIRLINE} py-6`}>
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
            <Group label="Огранка" items={c.options.cuts} selected={c.extra.cutIds} onToggle={c.toggleCut} />
            <Group label="Происхождение" items={c.options.origins} selected={c.extra.originIds} onToggle={c.toggleOrigin} />
            <Group label="Обработка" items={c.options.treatments} selected={c.extra.treatmentIds} onToggle={c.toggleTreatment} />
            <WeightRange value={c.extra.weight} onChange={c.setWeight} />
          </div>
          <div className="mt-6 flex items-center gap-8">
            {c.activeCount > 0 && (
              <button type="button" onClick={c.clearFilters} className={`border-b border-ink pb-0.5 ${T.ui}`}>
                Сбросить фильтры
              </button>
            )}
            <button type="button" onClick={() => setOpen(false)} className={`${T.ui} text-black/60 hover:text-black`}>
              Свернуть
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Group({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (items.length < 2) return null;
  return (
    <div role="group" aria-label={label}>
      <p className={T.label}>{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Chip key={it.id} on={selected.includes(it.id)} onClick={() => onToggle(it.id)}>
            {it.name}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const toNum = (s: string) => {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/** Вес «от / до» в каратах; применяется, когда поле теряет фокус или по Enter. */
function WeightRange({ value, onChange }: { value: [number, number] | null; onChange: (v: [number, number] | null) => void }) {
  const fmt = (n: number | undefined) => (n != null && n > 0 && Number.isFinite(n) ? String(n).replace(".", ",") : "");
  const [min, setMin] = useState(fmt(value?.[0]));
  const [max, setMax] = useState(fmt(value?.[1]));

  useEffect(() => {
    setMin(fmt(value?.[0]));
    setMax(fmt(value?.[1]));
  }, [value]);

  const commit = () => {
    const a = toNum(min);
    const b = toNum(max);
    onChange(a == null && b == null ? null : [a ?? 0, b ?? Number.POSITIVE_INFINITY]);
  };

  const input = (v: string, set: (s: string) => void, placeholder: string, label: string) => (
    <input
      inputMode="decimal"
      value={v}
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => set(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      className={`w-20 border-b border-black/20 bg-transparent pb-0.5 placeholder:text-black/30 focus:border-black focus:outline-none ${T.ui}`}
    />
  );

  return (
    <div role="group" aria-label="Вес">
      <p className={T.label}>Вес, ct</p>
      <div className={`mt-2.5 flex items-center gap-3 ${T.ui}`}>
        {input(min, setMin, "от", "Вес от, карат")}
        <span className="text-black/30">—</span>
        {input(max, setMax, "до", "Вес до, карат")}
      </div>
    </div>
  );
}
