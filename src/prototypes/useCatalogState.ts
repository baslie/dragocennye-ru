// Общее состояние каталога для прототипов главной: вид, цвета, цена, сортировка, «показать ещё».
// Логику фильтрации берём из каталога, чтобы прототипы вели себя как настоящая главная.
import { useMemo, useState } from "react";
import { emptyFilters, matchesFilters, sortStones } from "../components/catalog/filtering";
import type { Color, SortOption, Stone, StoneVariety } from "../components/catalog/types";

export type PriceBand = "all" | "lt10" | "10-25" | "25-60" | "gt60";

export const PRICE_BANDS: { id: PriceBand; label: string; range: [number, number] | null }[] = [
  { id: "all", label: "Любая цена", range: null },
  { id: "lt10", label: "до 10 000 ₽", range: [0, 10_000] },
  { id: "10-25", label: "10-25 тыс. ₽", range: [10_000, 25_000] },
  { id: "25-60", label: "25-60 тыс. ₽", range: [25_000, 60_000] },
  { id: "gt60", label: "от 60 тыс. ₽", range: [60_000, Number.POSITIVE_INFINITY] },
];

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Сначала новые",
  "price-asc": "Дешевле",
  "price-desc": "Дороже",
  "weight-asc": "Легче",
  "weight-desc": "Тяжелее",
};

export interface CatalogData {
  stones: Stone[];
  varieties: StoneVariety[];
  colors: Color[];
}

export function useCatalogState({ stones, colors }: CatalogData, pageSize = 12) {
  const [varietyId, setVarietyIdRaw] = useState<string | null>(null);
  const [colorIds, setColorIds] = useState<string[]>([]);
  const [priceBand, setPriceBandRaw] = useState<PriceBand>("all");
  const [sort, setSortRaw] = useState<SortOption>("newest");
  const [visible, setVisible] = useState(pageSize);

  const reset = () => setVisible(pageSize);

  const filtered = useMemo(() => {
    const f = emptyFilters(varietyId, colorIds);
    f.priceRange = PRICE_BANDS.find((b) => b.id === priceBand)?.range ?? null;
    return sortStones(
      stones.filter((s) => matchesFilters(s, f)),
      sort,
    );
  }, [stones, varietyId, colorIds, priceBand, sort]);

  // Цвета, которые реально встречаются в текущем виде, — чтобы не показывать пустые фильтры.
  const availableColors = useMemo(() => {
    const pool = varietyId ? stones.filter((s) => s.varietyId === varietyId) : stones;
    const ids = new Set(pool.map((s) => s.colorId));
    return colors.filter((c) => ids.has(c.id));
  }, [stones, colors, varietyId]);

  return {
    varietyId,
    colorIds,
    priceBand,
    sort,
    total: filtered.length,
    shown: filtered.slice(0, visible),
    hasMore: visible < filtered.length,
    availableColors,
    activeFilterCount: colorIds.length + (priceBand !== "all" ? 1 : 0),
    setVarietyId: (id: string | null) => {
      setVarietyIdRaw(id);
      setColorIds([]);
      reset();
    },
    toggleColor: (id: string) => {
      setColorIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      reset();
    },
    setPriceBand: (b: PriceBand) => {
      setPriceBandRaw(b);
      reset();
    },
    setSort: (s: SortOption) => {
      setSortRaw(s);
      reset();
    },
    clearFilters: () => {
      setColorIds([]);
      setPriceBandRaw("all");
      reset();
    },
    showMore: () => setVisible((v) => v + pageSize),
  };
}

// Камни без снимка пока приходят с общей PNG-иконкой фотоаппарата вместо фото.
export const hasPhoto = (s: Stone) => !s.photoUrl.endsWith(".png");

export const formatPrice = (rub: number) =>
  new Intl.NumberFormat("ru-RU").format(rub).replace(/ /g, " ") + " ₽";

export const formatCt = (ct: number) =>
  ct.toLocaleString("ru-RU", { maximumFractionDigits: 2 }) + " ct";

export function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const pluralStones = (n: number) => `${n} ${plural(n, ["камень", "камня", "камней"])}`;
