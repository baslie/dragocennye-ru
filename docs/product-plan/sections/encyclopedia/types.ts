export interface StoneVariety {
  id: string;
  slug: string;
  name: string;
  genitiveName: string;
  pluralName: string;
  pluralPrepositional: string;
  classLabel: string;
  teaser: string;
  coverPhotoUrl: string;
  mineralClass: string;
  formula: string;
  hardness: string;
  density: string;
  refractiveIndex: string;
  crystalSystem: string;
  stoneCount: number;
}

export interface EncyclopediaEntry {
  id: string;
  varietyId: string;
  slug: string;
  heroPhotoUrl: string;
  heroSubtitle: string;
  intro: string[];
  historyAndOrigins: string[];
  colorsAndCuts: string[];
  howToChoose: string[];
}

export interface LiveStoneCard {
  id: string;
  slug: string;
  varietyId: string;
  name: string;
  weightCt: number;
  price: number;
  photoUrl: string;
  isAvailable: boolean;
}

export interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: string;
  varietyIds: string[];
}

export type EntrySectionId = 'intro' | 'history' | 'colors' | 'choose';

export interface EncyclopediaIndexProps {
  varieties: StoneVariety[];
  /** Триггерится при клике на карточку вида — переход на `/encyclopedia/[slug]`. */
  onSelectVariety?: (varietyId: string) => void;
  /** Триггерится при клике на мета-счётчик «N камней в коллекции» в карточке — переход в `/catalog/[slug]`. */
  onBrowseInCatalog?: (varietyId: string) => void;
}

export interface EncyclopediaEntryProps {
  variety: StoneVariety;
  entry: EncyclopediaEntry;
  stonesInStock: LiveStoneCard[];
  relatedPosts: BlogPostCard[];
  /** Триггерится при клике на breadcrumb «Энциклопедия» — возврат на index. */
  onBackToIndex?: () => void;
  /** Триггерится при клике по пункту TOC — плавный скролл к H2 соответствующего раздела. */
  onScrollToSection?: (sectionId: EntrySectionId) => void;
  /** Триггерится при клике на карточку камня в live-блоке — переход на Stone Detail. */
  onViewStone?: (stoneId: string) => void;
  /** Триггерится при клике на CTA «Все [plural] в каталоге» — переход в `/catalog/[slug]`. */
  onBrowseInCatalog?: (varietyId: string) => void;
  /** Триггерится при клике на карточку поста блога — переход в блог. */
  onViewPost?: (postId: string) => void;
  /** Триггерится при клике на кнопку «Написать в Telegram» в empty state live-блока. */
  onContactForCustom?: (varietyId: string) => void;
}
