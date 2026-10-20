import type { CardStone } from "../ui";

export type CutSlug =
  | 'cushion'
  | 'oval'
  | 'pear'
  | 'octagon'
  | 'trillion'
  | 'princess'
  | 'marquise'
  | 'round'
  | 'cabochon'
  | 'baguette'
  | 'asscher'
  | 'square'
  | 'heart'
  | 'carving'
  | 'unknown';

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

export interface StoneDetail {
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

export type SimilarStoneCard = CardStone & { id: string };

export interface ContactChannel {
  type: ContactChannelType;
  label: string;
  href: string;
}

export interface StoneDetailProps {
  stone: StoneDetail;
  variety: StoneVariety;
  cut: Cut;
  origin: Origin;
  treatment: Treatment;
  color: Color;
  certificate: StoneCertificate | null;
  similarStones: SimilarStoneCard[];
  contactChannels: ContactChannel[];
  /** Клик по «Оставить заявку» — открыть модалку заявки. */
  onInquire?: (stoneId: string) => void;
}
