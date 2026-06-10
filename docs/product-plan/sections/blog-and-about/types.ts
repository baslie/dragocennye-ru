// ============================================================================
// Shared entities
// ============================================================================

/** Контактный канал гемолога — определяет иконку/действие кнопки в CTA-блоке. */
export type ContactChannel = 'telegram' | 'whatsapp' | 'phone';

/** Одна крупная цифра в ленте статов на /about (лет в профессии, камней в коллекции и т.д.). */
export interface GemologistStat {
  value: string;
  label: string;
}

/** Пункт таймлайна «Образование и опыт» на /about. */
export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

/** Контакт гемолога для CTA-блока. */
export interface GemologistContact {
  channel: ContactChannel;
  label: string;
  value: string;
}

/** Полный профиль Дмитрия Салятова для страницы /about. */
export interface Gemologist {
  id: string;
  name: string;
  role: string;
  portraitUrl: string;
  intro: string[];
  stats: GemologistStat[];
  timeline: TimelineItem[];
  approach: string[];
  contacts: GemologistContact[];
}

/** Мини-подпись автора в конце поста — проекция Gemologist на три поля. */
export interface Author {
  name: string;
  role: string;
  portraitUrl: string;
}

/** Фильтр-чип ленты по виду камня. Совпадает по id/slug с varieties каталога. */
export interface Topic {
  id: string;
  slug: string;
  name: string;
  postCount: number;
}

/** Карточка публикации блога — для ленты, «Читать дальше» и «Из журнала». */
export interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  /** ISO date, например «2026-05-28». Форматируется в UI. */
  publishedAt: string;
  readingMinutes: number;
  /** Виды камней, к которым привязан пост — для фильтра и подбора связанного контента. */
  varietyIds: string[];
  /** Человекочитаемый ярлык основного вида для мета-строки («Сапфир»). */
  varietyLabel: string;
  /** Один пост в ленте помечается как featured — крупная горизонтальная карточка. */
  isFeatured: boolean;
}

/** Карточка камня для live-блока «Камни из этой статьи» — подмножество Stone из каталога. */
export interface StoneCard {
  id: string;
  slug: string;
  varietyId: string;
  name: string;
  weightCt: number;
  price: number;
  photoUrl: string;
  isAvailable: boolean;
}

// ============================================================================
// Blog post body
// ============================================================================

export type PostBlockType = 'paragraph' | 'heading' | 'quote' | 'image';

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock {
  type: 'heading';
  text: string;
}

export interface QuoteBlock {
  type: 'quote';
  text: string;
}

export interface ImageBlock {
  type: 'image';
  url: string;
  caption?: string;
}

/** Дискриминированный union блоков тела поста — рендерится по порядку в reading column. */
export type PostBlock = ParagraphBlock | HeadingBlock | QuoteBlock | ImageBlock;

/** Полный пост для view /blog/[slug] — расширяет карточку телом и связанным контентом. */
export interface BlogPost extends BlogPostCard {
  /** Опциональный вводный lead-абзац под H1. */
  lead?: string;
  body: PostBlock[];
  /** Упомянутые камни в наличии — пустой массив скрывает live-блок. */
  mentionedStones: StoneCard[];
  /** id похожих постов для блока «Читать дальше». */
  relatedPostIds: string[];
}

// ============================================================================
// Props — View 1: Blog feed (/blog)
// ============================================================================

export interface BlogFeedProps {
  posts: BlogPostCard[];
  topics: Topic[];
  /** id активного вида-фильтра, либо null для «Все». */
  activeTopicId: string | null;
  /** Триггерится при клике на чип фильтра. null — сброс на «Все». */
  onFilterByVariety?: (varietyId: string | null) => void;
  /** Триггерится при клике на карточку поста (featured или из сетки) — переход на /blog/[slug]. */
  onViewPost?: (postId: string) => void;
}

// ============================================================================
// Props — View 2: Blog post (/blog/[slug])
// ============================================================================

export interface BlogPostProps {
  post: BlogPost;
  author: Author;
  /** Похожие посты для блока «Читать дальше» — пустой массив скрывает блок. */
  relatedPosts: BlogPostCard[];
  /** Триггерится при клике на breadcrumb «Журнал» — возврат в ленту. */
  onBackToFeed?: () => void;
  /** Триггерится при клике на ярлык вида в мета-строке или CTA live-блока — переход в /catalog/[slug]. */
  onBrowseInCatalog?: (varietyId: string) => void;
  /** Триггерится при клике на карточку камня в live-блоке — переход на Stone Detail. */
  onViewStone?: (stoneId: string) => void;
  /** Триггерится при клике на карточку похожего поста — переход на /blog/[slug]. */
  onViewPost?: (postId: string) => void;
  /** Триггерится при клике на ссылку «О гемологе →» в author byline — переход на /about. */
  onViewAbout?: () => void;
}

// ============================================================================
// Props — View 3: About (/about)
// ============================================================================

export interface AboutProps {
  gemologist: Gemologist;
  /** Последние посты для блока «Из журнала» (обычно 3). */
  recentPosts: BlogPostCard[];
  /** Триггерится при клике на карточку поста в «Из журнала» — переход на /blog/[slug]. */
  onViewPost?: (postId: string) => void;
  /** Триггерится при клике на ссылку «Все публикации →» — переход в ленту /blog. */
  onViewFeed?: () => void;
  /** Триггерится при клике на контактную кнопку в CTA-блоке (Telegram / WhatsApp / телефон). */
  onContact?: (channel: ContactChannel) => void;
}
