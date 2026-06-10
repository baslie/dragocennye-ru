// =============================================================================
// UI Data Shapes — Combined Reference
//
// Эти типы определяют данные, которые UI-компоненты ожидают получить через props.
// Это контракт фронтенда, не схема БД. Как вы моделируете, храните и получаете эти
// данные — решение реализации.
//
// Одноимённые сущности (StoneVariety, Cut, Origin, Treatment, Color, Certificate,
// BlogPostCard, ContactChannel) имеют РАЗНЫЙ набор полей в разных секциях — поэтому
// они разнесены по namespace’ам. Props-интерфейсы компонентов сюда не включены —
// см. types.ts каждой секции.
// =============================================================================

// -----------------------------------------------------------------------------
// From: sections/catalog-browse
// -----------------------------------------------------------------------------
export namespace CatalogBrowse {
  export type ColorSlug =
    | 'green' | 'blue' | 'pink' | 'yellow' | 'white' | 'violet' | 'orange' | 'red';

  export type CutSlug =
    | 'cushion' | 'oval' | 'pear' | 'octagon' | 'trillion' | 'princess' | 'marquise';

  export type TreatmentSlug = 'unheated' | 'heated' | 'oiled';

  export type SortOption =
    | 'newest' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc';

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
}

// -----------------------------------------------------------------------------
// From: sections/stone-detail
// -----------------------------------------------------------------------------
export namespace StoneDetail {
  export type CutSlug =
    | 'cushion' | 'oval' | 'pear' | 'octagon' | 'trillion' | 'princess' | 'marquise';

  export type TreatmentSlug = 'unheated' | 'heated' | 'oiled';
  export type MediaKind = 'photo' | 'video';
  export type ContactChannelType = 'telegram' | 'whatsapp' | 'phone';

  export interface StoneMedia {
    id: string;
    kind: MediaKind;
    url: string;
    posterUrl: string | null;
    alt: string;
  }

  export interface StoneVariety {
    id: string;
    slug: string;
    name: string;
    genitiveName: string;
    pluralName: string;
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
    country: string;
  }

  export interface Treatment {
    id: string;
    slug: TreatmentSlug;
    name: string;
    description: string;
  }

  export interface Color {
    id: string;
    slug: string;
    name: string;
    hex: string;
  }

  export interface StoneCertificate {
    id: string;
    lab: string;
    number: string;
    issuedAt: string;
    scanUrl: string;
    verificationUrl: string;
  }

  export interface StoneCharacteristics {
    clarity: string;
    luster: string;
    hardness: string;
    refractiveIndex: string;
  }

  export interface StoneDetailEntity {
    id: string;
    slug: string;
    name: string;
    varietyId: string;
    colorId: string;
    cutId: string;
    originId: string;
    treatmentId: string;
    certificateId: string | null;
    weightCt: number;
    dimensionsMm: string;
    price: number;
    isAvailable: boolean;
    addedAt: string;
    media: StoneMedia[];
    editorial: string[];
    characteristics: StoneCharacteristics;
  }

  export interface SimilarStoneCard {
    id: string;
    slug: string;
    name: string;
    weightCt: number;
    price: number;
    photoUrl: string;
    varietyId: string;
    isAvailable: boolean;
  }

  export interface ContactChannel {
    type: ContactChannelType;
    label: string;
    href: string;
  }
}

// -----------------------------------------------------------------------------
// From: sections/inquiry
// -----------------------------------------------------------------------------
export namespace Inquiry {
  export type InquiryChannelType = 'telegram' | 'whatsapp' | 'phone';
  export type InquiryChannelIcon = 'Send' | 'MessageCircle' | 'Phone';
  export type InquiryState = 'idle' | 'loading' | 'sent' | 'error';

  export interface InquiryStoneMini {
    id: string;
    name: string;
    weightCt: number;
    cutName: string;
    photoUrl: string;
    price: number;
  }

  export interface InquiryChannel {
    type: InquiryChannelType;
    label: string;
    icon: InquiryChannelIcon;
  }

  export interface InquiryFormValues {
    name: string;
    contact: string;
    channel: InquiryChannelType | null;
    comment: string;
    consent: boolean;
  }

  export interface InquiryFieldErrors {
    name?: string;
    contact?: string;
    channel?: string;
    comment?: string;
    consent?: string;
  }

  export interface InquiryConsent {
    label: string;
    policyHref: string;
  }
}

// -----------------------------------------------------------------------------
// From: sections/encyclopedia
// -----------------------------------------------------------------------------
export namespace Encyclopedia {
  export type EntrySectionId = 'intro' | 'history' | 'colors' | 'choose';

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
}

// -----------------------------------------------------------------------------
// From: sections/blog-and-about
// -----------------------------------------------------------------------------
export namespace BlogAndAbout {
  export type ContactChannel = 'telegram' | 'whatsapp' | 'phone';

  export interface GemologistStat {
    value: string;
    label: string;
  }

  export interface TimelineItem {
    year: string;
    title: string;
    description: string;
  }

  export interface GemologistContact {
    channel: ContactChannel;
    label: string;
    value: string;
  }

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

  export interface Author {
    name: string;
    role: string;
    portraitUrl: string;
  }

  export interface Topic {
    id: string;
    slug: string;
    name: string;
    postCount: number;
  }

  export interface BlogPostCard {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverPhotoUrl: string;
    publishedAt: string;
    readingMinutes: number;
    varietyIds: string[];
    varietyLabel: string;
    isFeatured: boolean;
  }

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

  export type PostBlockType = 'paragraph' | 'heading' | 'quote' | 'image';

  export interface ParagraphBlock { type: 'paragraph'; text: string; }
  export interface HeadingBlock { type: 'heading'; text: string; }
  export interface QuoteBlock { type: 'quote'; text: string; }
  export interface ImageBlock { type: 'image'; url: string; caption?: string; }

  export type PostBlock = ParagraphBlock | HeadingBlock | QuoteBlock | ImageBlock;

  export interface BlogPost extends BlogPostCard {
    lead?: string;
    body: PostBlock[];
    mentionedStones: StoneCard[];
    relatedPostIds: string[];
  }
}
