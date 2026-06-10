// Мастер-модель данных «Драгоценных».
// Это единый источник истины; access-слой (index.ts) проецирует мастер-сущности
// в конкретные shape'ы, которые ожидают компоненты каждой секции (см. их types.ts).

export type ColorSlug =
  | "green" | "blue" | "pink" | "yellow" | "white" | "violet" | "orange" | "red"
  | "black" | "brown" | "grey";

export type CutSlug =
  | "cushion" | "oval" | "pear" | "octagon" | "trillion" | "princess" | "marquise"
  | "round" | "cabochon" | "baguette" | "asscher" | "square" | "heart" | "carving"
  | "unknown";

export type TreatmentSlug = "unheated" | "heated" | "oiled";

export type MediaKind = "photo" | "video";

export interface MasterVariety {
  id: string;
  slug: string;
  name: string;
  genitiveName: string;
  pluralName: string;
  pluralPrepositional: string;
  classLabel: string;
  teaser: string;
  shortDescription: string;
  imageUrl: string;
  coverPhotoUrl: string;
  mineralClass: string;
  formula: string;
  hardness: string;
  density: string;
  refractiveIndex: string;
  crystalSystem: string;
}

export interface MasterCut {
  id: string;
  slug: CutSlug;
  name: string;
}

export interface MasterOrigin {
  id: string;
  slug: string;
  name: string;
  country: string;
}

export interface MasterTreatment {
  id: string;
  slug: TreatmentSlug;
  name: string;
  description: string;
}

export interface MasterColor {
  id: string;
  slug: ColorSlug;
  name: string;
  hex: string;
}

export interface MasterCertificate {
  id: string;
  lab: string;
  number: string;
  issuedAt: string;
  scanUrl: string;
  verificationUrl: string;
}

export interface StoneMedia {
  id: string;
  kind: MediaKind;
  url: string;
  posterUrl: string | null;
  alt: string;
}

export interface StoneCharacteristics {
  clarity: string;
  luster: string;
  hardness: string;
  refractiveIndex: string;
}

export interface MasterStone {
  id: string;
  slug: string;
  varietyId: string;
  colorId: string;
  cutId: string;
  originId: string;
  treatmentId: string;
  certificateId: string | null;
  name: string;
  weightCt: number;
  dimensionsMm: string;
  price: number;
  isAvailable: boolean;
  addedAt: string; // ISO date
  media: StoneMedia[];
  editorial: string[];
  characteristics: StoneCharacteristics;
}

export interface MasterEncyclopediaEntry {
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

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; caption?: string };

export interface MasterPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  varietyIds: string[];
  varietyLabel: string;
  isFeatured: boolean;
  lead?: string;
  body: PostBlock[];
  relatedPostIds: string[];
}

export interface GemologistStat { value: string; label: string }
export interface TimelineItem { year: string; title: string; description: string }
export interface GemologistContact {
  channel: "telegram" | "whatsapp" | "phone";
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
