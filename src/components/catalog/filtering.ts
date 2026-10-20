// Чистая логика фильтрации и сортировки каталога — общая для острова каталога и прототипов главной.
import type { CatalogFilters, SortOption, Stone } from "./types";

export function emptyFilters(varietyId: string | null, colorIds: string[]): CatalogFilters {
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

export function parseRange(min: string | null, max: string | null): [number, number] | null {
  const a = min != null ? parseFloat(min) : NaN;
  const b = max != null ? parseFloat(max) : NaN;
  if (!Number.isFinite(a) && !Number.isFinite(b)) return null;
  return [
    Number.isFinite(a) ? a : 0,
    Number.isFinite(b) ? b : Number.POSITIVE_INFINITY,
  ];
}

export function matchesFilters(stone: Stone, f: CatalogFilters): boolean {
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

export function sortStones(list: Stone[], sort: SortOption): Stone[] {
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
