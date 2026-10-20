import type { CardPost, CardStone } from "../ui";

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

export type LiveStoneCard = CardStone & { id: string };

export type BlogPostCard = CardPost & { id: string };

export type EntrySectionId = 'intro' | 'history' | 'colors' | 'choose';

export interface EncyclopediaEntryProps {
  variety: StoneVariety;
  entry: EncyclopediaEntry;
  stonesInStock: LiveStoneCard[];
  relatedPosts: BlogPostCard[];
  /** Ссылка на Telegram гемолога — для пустого блока «Сейчас в коллекции». */
  contactHref: string;
}
