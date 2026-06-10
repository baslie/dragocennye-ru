export type ColorSlug =
  | 'green'
  | 'blue'
  | 'pink'
  | 'yellow'
  | 'white'
  | 'violet'
  | 'orange'
  | 'red';

export type CutSlug =
  | 'cushion'
  | 'oval'
  | 'pear'
  | 'octagon'
  | 'trillion'
  | 'princess'
  | 'marquise';

export type TreatmentSlug = 'unheated' | 'heated' | 'oiled';

export type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'weight-asc'
  | 'weight-desc';

export interface StoneVariety {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  stoneCount: number;
  shortDescription: string;
}

export interface Cut {
  id: string;
  slug: CutSlug;
  name: string;
}

export interface Origin {
  id: string;
  slug: string;
  name: string;
}

export interface Treatment {
  id: string;
  slug: TreatmentSlug;
  name: string;
}

export interface Color {
  id: string;
  slug: ColorSlug;
  name: string;
  hex: string;
}

export interface Certificate {
  id: string;
  lab: string;
  number: string;
}

export interface Stone {
  id: string;
  slug: string;
  varietyId: string;
  colorId: string;
  name: string;
  weightCt: number;
  dimensionsMm: string;
  price: number;
  cutId: string;
  originId: string;
  treatmentId: string;
  certificateId: string | null;
  photoUrl: string;
  isAvailable: boolean;
  addedAt: string;
}

export interface CatalogFilters {
  varietyId: string | null;
  colorIds: string[];
  cutIds: string[];
  weightRange: [number, number] | null;
  priceRange: [number, number] | null;
  originIds: string[];
  treatmentIds: string[];
  hasCertificate: boolean | null;
}

export interface CatalogBrowseProps {
  varieties: StoneVariety[];
  cuts: Cut[];
  origins: Origin[];
  treatments: Treatment[];
  colors: Color[];
  certificates: Certificate[];
  stones: Stone[];
  filters: CatalogFilters;
  sort: SortOption;
  page: number;
  pageSize: number;
  /** Триггерится при клике на таб вида камня или на «Все». */
  onSelectVariety?: (varietyId: string | null) => void;
  /** Триггерится при изменении любого фильтра в тонкой строке. */
  onFilterChange?: (filters: CatalogFilters) => void;
  /** Триггерится при смене сортировки в дропдауне. */
  onSortChange?: (sort: SortOption) => void;
  /** Триггерится при смене страницы в пагинаторе. */
  onPageChange?: (page: number) => void;
  /** Триггерится при клике на карточку камня — навигация на Stone Detail. */
  onStoneClick?: (stoneId: string) => void;
  /** Триггерится при нажатии «Сбросить фильтры» в empty state. */
  onResetFilters?: () => void;
}
