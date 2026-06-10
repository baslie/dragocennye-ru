import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CatalogBrowse } from "./CatalogBrowse";
import type {
  CatalogFilters,
  Certificate,
  Color,
  Cut,
  Origin,
  SortOption,
  Stone,
  StoneVariety,
  Treatment,
} from "./types";

interface CatalogBrowseIslandProps {
  stones: Stone[];
  varieties: StoneVariety[];
  cuts: Cut[];
  origins: Origin[];
  treatments: Treatment[];
  colors: Color[];
  certificates: Certificate[];
  /** Предвыбранный вид (со страницы /catalog/[variety]). */
  initialVarietyId?: string | null;
  /** Предвыбранный цвет (со страницы /catalog/[variety]/[color]). */
  initialColorId?: string | null;
  pageSize?: number;
}

const PAGE_SIZE_DEFAULT = 12;
const SORT_OPTIONS: SortOption[] = [
  "newest",
  "price-asc",
  "price-desc",
  "weight-asc",
  "weight-desc",
];

function emptyFilters(varietyId: string | null, colorIds: string[]): CatalogFilters {
  return {
    varietyId,
    colorIds,
    cutIds: [],
    weightRange: null,
    priceRange: null,
    originIds: [],
    treatmentIds: [],
    hasCertificate: null,
  };
}

function parseRange(min: string | null, max: string | null): [number, number] | null {
  const a = min != null ? parseFloat(min) : NaN;
  const b = max != null ? parseFloat(max) : NaN;
  if (!Number.isFinite(a) && !Number.isFinite(b)) return null;
  return [
    Number.isFinite(a) ? a : 0,
    Number.isFinite(b) ? b : Number.POSITIVE_INFINITY,
  ];
}

function matchesFilters(stone: Stone, f: CatalogFilters): boolean {
  if (f.varietyId && stone.varietyId !== f.varietyId) return false;
  if (f.colorIds.length && !f.colorIds.includes(stone.colorId)) return false;
  if (f.cutIds.length && !f.cutIds.includes(stone.cutId)) return false;
  if (f.originIds.length && !f.originIds.includes(stone.originId)) return false;
  if (f.treatmentIds.length && !f.treatmentIds.includes(stone.treatmentId)) return false;
  if (f.weightRange) {
    const [a, b] = f.weightRange;
    if (stone.weightCt < a || stone.weightCt > b) return false;
  }
  if (f.priceRange) {
    const [a, b] = f.priceRange;
    if (stone.price < a || stone.price > b) return false;
  }
  if (f.hasCertificate === true && !stone.certificateId) return false;
  if (f.hasCertificate === false && stone.certificateId) return false;
  return true;
}

function sortStones(list: Stone[], sort: SortOption): Stone[] {
  const out = [...list];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "weight-asc":
      return out.sort((a, b) => a.weightCt - b.weightCt);
    case "weight-desc":
      return out.sort((a, b) => b.weightCt - a.weightCt);
    case "newest":
    default:
      return out.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }
}

export function CatalogBrowseIsland({
  stones,
  varieties,
  cuts,
  origins,
  treatments,
  colors,
  certificates,
  initialVarietyId = null,
  initialColorId = null,
  pageSize = PAGE_SIZE_DEFAULT,
}: CatalogBrowseIslandProps) {
  // Карты slug <-> id для читаемых query-параметров.
  const slugMaps = useMemo(() => {
    const idBySlug = (items: { id: string; slug: string }[]) =>
      new Map(items.map((i) => [i.slug, i.id]));
    const slugById = (items: { id: string; slug: string }[]) =>
      new Map(items.map((i) => [i.id, i.slug]));
    return {
      colorIdBySlug: idBySlug(colors),
      colorSlugById: slugById(colors),
      cutIdBySlug: idBySlug(cuts),
      cutSlugById: slugById(cuts),
      originIdBySlug: idBySlug(origins),
      originSlugById: slugById(origins),
      treatmentIdBySlug: idBySlug(treatments),
      treatmentSlugById: slugById(treatments),
    };
  }, [colors, cuts, origins, treatments]);

  const varietySlugById = useMemo(
    () => new Map(varieties.map((v) => [v.id, v.slug])),
    [varieties],
  );

  // Разбор тонких фильтров из URL query поверх route-базы.
  const readFromUrl = useCallback((): { filters: CatalogFilters; sort: SortOption; page: number } => {
    const base = emptyFilters(
      initialVarietyId,
      initialColorId ? [initialColorId] : [],
    );
    if (typeof window === "undefined") {
      return { filters: base, sort: "newest", page: 1 };
    }
    const q = new URLSearchParams(window.location.search);

    const idsFromSlugs = (key: string, map: Map<string, string>): string[] => {
      const raw = q.get(key);
      if (!raw) return [];
      return raw
        .split(",")
        .map((s) => map.get(s.trim()))
        .filter((x): x is string => Boolean(x));
    };

    const colorIds = idsFromSlugs("color", slugMaps.colorIdBySlug);
    const filters: CatalogFilters = {
      ...base,
      colorIds: colorIds.length ? colorIds : base.colorIds,
      cutIds: idsFromSlugs("cut", slugMaps.cutIdBySlug),
      originIds: idsFromSlugs("origin", slugMaps.originIdBySlug),
      treatmentIds: idsFromSlugs("treatment", slugMaps.treatmentIdBySlug),
      weightRange: parseRange(q.get("wmin"), q.get("wmax")),
      priceRange: parseRange(q.get("pmin"), q.get("pmax")),
      hasCertificate:
        q.get("cert") === "yes" ? true : q.get("cert") === "no" ? false : null,
    };

    const sortRaw = q.get("sort") as SortOption | null;
    const sort = sortRaw && SORT_OPTIONS.includes(sortRaw) ? sortRaw : "newest";
    const pageRaw = parseInt(q.get("page") ?? "1", 10);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    return { filters, sort, page };
  }, [initialVarietyId, initialColorId, slugMaps]);

  const initial = useMemo(
    () => readFromUrl(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [filters, setFilters] = useState<CatalogFilters>(initial.filters);
  const [sort, setSort] = useState<SortOption>(initial.sort);
  const [page, setPage] = useState<number>(initial.page);

  const gridRef = useRef<HTMLDivElement>(null);

  // Сериализация состояния в URL (pathname сохраняется — он несёт вид/цвет).
  const writeToUrl = useCallback(
    (f: CatalogFilters, s: SortOption, p: number, push: boolean) => {
      if (typeof window === "undefined") return;
      const q = new URLSearchParams();
      const slugsOf = (ids: string[], map: Map<string, string>) =>
        ids.map((id) => map.get(id)).filter(Boolean).join(",");

      // Цвет пишем в query только если он не зафиксирован маршрутом.
      if (!initialColorId && f.colorIds.length)
        q.set("color", slugsOf(f.colorIds, slugMaps.colorSlugById));
      if (f.cutIds.length) q.set("cut", slugsOf(f.cutIds, slugMaps.cutSlugById));
      if (f.originIds.length)
        q.set("origin", slugsOf(f.originIds, slugMaps.originSlugById));
      if (f.treatmentIds.length)
        q.set("treatment", slugsOf(f.treatmentIds, slugMaps.treatmentSlugById));
      if (f.weightRange) {
        const [a, b] = f.weightRange;
        if (a > 0) q.set("wmin", String(a));
        if (Number.isFinite(b)) q.set("wmax", String(b));
      }
      if (f.priceRange) {
        const [a, b] = f.priceRange;
        if (a > 0) q.set("pmin", String(a));
        if (Number.isFinite(b)) q.set("pmax", String(b));
      }
      if (f.hasCertificate === true) q.set("cert", "yes");
      if (f.hasCertificate === false) q.set("cert", "no");
      if (s !== "newest") q.set("sort", s);
      if (p > 1) q.set("page", String(p));

      const qs = q.toString();
      const url = window.location.pathname + (qs ? `?${qs}` : "");
      if (push) window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [initialColorId, slugMaps],
  );

  // Назад/вперёд в браузере — перечитать состояние из URL.
  useEffect(() => {
    const onPop = () => {
      const next = readFromUrl();
      setFilters(next.filters);
      setSort(next.sort);
      setPage(next.page);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [readFromUrl]);

  const scrollToGrid = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  // --- Обработчики ----------------------------------------------------------
  const handleSelectVariety = (varietyId: string | null) => {
    // Смена вида = переход на SEO-посадочную (новый pathname, чистые фильтры).
    const href = varietyId ? `/catalog/${varietySlugById.get(varietyId) ?? ""}` : "/";
    window.location.href = href;
  };

  const handleFilterChange = (next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
    writeToUrl(next, sort, 1, false);
  };

  const handleSortChange = (next: SortOption) => {
    setSort(next);
    setPage(1);
    writeToUrl(filters, next, 1, false);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    writeToUrl(filters, sort, next, true);
    scrollToGrid();
  };

  const handleResetFilters = () => {
    const reset = emptyFilters(
      filters.varietyId,
      initialColorId ? [initialColorId] : [],
    );
    setFilters(reset);
    setPage(1);
    writeToUrl(reset, sort, 1, false);
  };

  const handleStoneClick = (stoneId: string) => {
    const stone = stones.find((s) => s.id === stoneId);
    if (stone) window.location.href = `/stones/${stone.slug}`;
  };

  // --- Производный список ----------------------------------------------------
  const processed = useMemo(() => {
    const filtered = stones.filter((s) => matchesFilters(s, filters));
    return sortStones(filtered, sort);
  }, [stones, filters, sort]);

  return (
    <div ref={gridRef}>
      <CatalogBrowse
        varieties={varieties}
        cuts={cuts}
        origins={origins}
        treatments={treatments}
        colors={colors}
        certificates={certificates}
        stones={processed}
        filters={filters}
        sort={sort}
        page={page}
        pageSize={pageSize}
        onSelectVariety={handleSelectVariety}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onStoneClick={handleStoneClick}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
