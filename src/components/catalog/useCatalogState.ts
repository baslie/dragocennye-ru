// Состояние каталога: цвет, цена, огранка, происхождение, обработка, вес, порядок и «показать ещё».
// Фильтры живут в URL (replaceState), поэтому ссылкой на подборку можно поделиться.
// Вид задаёт маршрут (/catalog/<вид>), на нём же цвет — отдельный маршрут (/catalog/<вид>/<цвет>).
import { useCallback, useEffect, useMemo, useState } from "react";
import { emptyFilters, matchesFilters, parseRange, sortStones } from "./filtering";
import type { Color, Cut, Origin, SortOption, Stone, StoneVariety, Treatment } from "./types";

export type PriceBand = "all" | "lt10" | "10-25" | "25-60" | "gt60";

export const PRICE_BANDS: { id: PriceBand; label: string; range: [number, number] | null }[] = [
  { id: "all", label: "Любая цена", range: null },
  { id: "lt10", label: "до 10 000 ₽", range: [0, 10_000] },
  { id: "10-25", label: "10–25 тыс. ₽", range: [10_000, 25_000] },
  { id: "25-60", label: "25–60 тыс. ₽", range: [25_000, 60_000] },
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
  cuts: Cut[];
  origins: Origin[];
  treatments: Treatment[];
}

interface Options {
  varietyId: string | null;
  /** Цвет из маршрута /catalog/<вид>/<цвет>. */
  routeColorId: string | null;
  pageSize: number;
}

interface Extra {
  cutIds: string[];
  originIds: string[];
  treatmentIds: string[];
  weight: [number, number] | null;
}

const NO_EXTRA: Extra = { cutIds: [], originIds: [], treatmentIds: [], weight: null };

// Пункты «не указано» в фильтрах не показываем.
const isKnown = (id: string) => !id.endsWith("-unknown");

interface UrlState {
  colorId: string | null;
  priceBand: PriceBand;
  extra: Extra;
  sort: SortOption;
}

export function useCatalogState(data: CatalogData, { varietyId, routeColorId, pageSize }: Options) {
  const { stones, colors, cuts, origins, treatments, varieties } = data;

  const maps = useMemo(() => {
    const bySlug = (xs: { id: string; slug: string }[]) => new Map(xs.map((x) => [x.slug, x.id]));
    const byId = (xs: { id: string; slug: string }[]) => new Map(xs.map((x) => [x.id, x.slug]));
    return {
      color: [bySlug(colors), byId(colors)],
      cut: [bySlug(cuts), byId(cuts)],
      origin: [bySlug(origins), byId(origins)],
      treatment: [bySlug(treatments), byId(treatments)],
    } as const;
  }, [colors, cuts, origins, treatments]);

  const routeState = (): UrlState => ({ colorId: routeColorId, priceBand: "all", extra: NO_EXTRA, sort: "newest" });

  const readUrl = useCallback((): UrlState => {
    if (typeof window === "undefined") return routeState();
    const q = new URLSearchParams(window.location.search);
    const ids = (key: keyof typeof maps) =>
      (q.get(key) ?? "")
        .split(",")
        .map((s) => maps[key][0].get(s.trim()))
        .filter((x): x is string => Boolean(x));
    const price = q.get("price") as PriceBand | null;
    const sort = q.get("sort") as SortOption | null;
    return {
      colorId: routeColorId ?? ids("color")[0] ?? null,
      priceBand: price && PRICE_BANDS.some((b) => b.id === price) ? price : "all",
      extra: {
        cutIds: ids("cut"),
        originIds: ids("origin"),
        treatmentIds: ids("treatment"),
        weight: parseRange(q.get("wmin"), q.get("wmax")),
      },
      sort: sort && sort in SORT_LABELS ? sort : "newest",
    };
  }, [maps, routeColorId]);

  // На сборке URL нет — стартуем с маршрута, а query подхватываем после гидрации,
  // иначе разметка острова разошлась бы с HTML со сборки.
  const [state, setState] = useState<UrlState>(routeState);
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => {
    setState(readUrl());
    const onPop = () => setState(readUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [readUrl]);

  const writeUrl = (next: UrlState) => {
    const q = new URLSearchParams();
    const slugs = (key: keyof typeof maps, list: string[]) => list.map((id) => maps[key][1].get(id)).filter(Boolean).join(",");
    if (next.colorId && !routeColorId) q.set("color", slugs("color", [next.colorId]));
    if (next.priceBand !== "all") q.set("price", next.priceBand);
    if (next.extra.cutIds.length) q.set("cut", slugs("cut", next.extra.cutIds));
    if (next.extra.originIds.length) q.set("origin", slugs("origin", next.extra.originIds));
    if (next.extra.treatmentIds.length) q.set("treatment", slugs("treatment", next.extra.treatmentIds));
    if (next.extra.weight) {
      const [a, b] = next.extra.weight;
      if (a > 0) q.set("wmin", String(a));
      if (Number.isFinite(b)) q.set("wmax", String(b));
    }
    if (next.sort !== "newest") q.set("sort", next.sort);
    const qs = q.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
  };

  const update = (patch: Partial<UrlState>) => {
    const next = { ...state, ...patch };
    setState(next);
    setVisible(pageSize);
    writeUrl(next);
  };

  const setExtra = (patch: Partial<Extra>) => update({ extra: { ...state.extra, ...patch } });

  const filtered = useMemo(() => {
    const f = emptyFilters(varietyId, state.colorId ? [state.colorId] : []);
    f.priceRange = PRICE_BANDS.find((b) => b.id === state.priceBand)?.range ?? null;
    f.cutIds = state.extra.cutIds;
    f.originIds = state.extra.originIds;
    f.treatmentIds = state.extra.treatmentIds;
    f.weightRange = state.extra.weight;
    return sortStones(
      stones.filter((s) => matchesFilters(s, f)),
      state.sort,
    );
  }, [stones, varietyId, state]);

  // Варианты фильтров — только те, что реально встречаются в текущем виде, чтобы не было пустых.
  const options = useMemo(() => {
    const pool = varietyId ? stones.filter((s) => s.varietyId === varietyId) : stones;
    const has = (pick: (s: Stone) => string) => new Set(pool.map(pick));
    const colorSet = has((s) => s.colorId);
    const cutSet = has((s) => s.cutId);
    const originSet = has((s) => s.originId);
    const treatmentSet = has((s) => s.treatmentId);
    return {
      colors: colors.filter((c) => colorSet.has(c.id)),
      cuts: cuts.filter((c) => cutSet.has(c.id) && isKnown(c.id)),
      origins: origins.filter((o) => originSet.has(o.id) && isKnown(o.id)),
      treatments: treatments.filter((t) => treatmentSet.has(t.id)),
    };
  }, [stones, colors, cuts, origins, treatments, varietyId]);

  const { extra } = state;
  const extraCount = extra.cutIds.length + extra.originIds.length + extra.treatmentIds.length + (extra.weight ? 1 : 0);
  const ownColor = state.colorId && !routeColorId ? 1 : 0;

  const varietySlug = varieties.find((v) => v.id === varietyId)?.slug ?? null;

  return {
    colorId: state.colorId,
    priceBand: state.priceBand,
    sort: state.sort,
    extra,
    options,
    total: filtered.length,
    shown: filtered.slice(0, visible),
    hasMore: visible < filtered.length,
    extraCount,
    activeCount: extraCount + ownColor + (state.priceBand !== "all" ? 1 : 0),
    selectColor: (id: string) => {
      // Цвет выбирается один: клик по другому заменяет выбор, повторный клик снимает его.
      const next = state.colorId === id ? null : id;
      if (varietySlug) {
        // На странице вида цвет — свой маршрут с SEO-заголовком; остальные фильтры переносим.
        writeUrl({ ...state, colorId: null });
        const colorSlug = next ? maps.color[1].get(next) : null;
        window.location.href = `/catalog/${varietySlug}${colorSlug ? `/${colorSlug}` : ""}${window.location.search}`;
        return;
      }
      update({ colorId: next });
    },
    setPriceBand: (priceBand: PriceBand) => update({ priceBand }),
    setSort: (sort: SortOption) => update({ sort }),
    toggleCut: (id: string) => setExtra({ cutIds: toggle(extra.cutIds, id) }),
    toggleOrigin: (id: string) => setExtra({ originIds: toggle(extra.originIds, id) }),
    toggleTreatment: (id: string) => setExtra({ treatmentIds: toggle(extra.treatmentIds, id) }),
    setWeight: (weight: [number, number] | null) => setExtra({ weight }),
    clearFilters: () => {
      // Цвет из маршрута сбросить нельзя без перехода — снимаем его ссылкой на страницу вида.
      update({ colorId: routeColorId, priceBand: "all", extra: NO_EXTRA });
    },
    showMore: () => setVisible((v) => v + pageSize),
  };
}

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
