// Access-слой данных «Драгоценных».
// Собирает мастер-данные и проецирует их в shape'ы, которые ждут компоненты секций.
import type {
  MasterStone,
  MasterVariety,
  MasterPost,
  MasterEncyclopediaEntry,
} from "./model";
import { varieties as masterVarieties } from "./varieties";
import { stones as masterStones } from "./stones";
import { cuts, origins, treatments, colors, certificates } from "./taxonomy";
import { encyclopediaEntries } from "./encyclopedia";
import { posts as masterPosts, gemologist as baseGemologist } from "./blog";
import { plural } from "../lib/format";

// --- Производные счётчики -----------------------------------------------------
const countByVariety = new Map<string, number>();
for (const s of masterStones) {
  countByVariety.set(s.varietyId, (countByVariety.get(s.varietyId) ?? 0) + 1);
}

export type VarietyWithCount = MasterVariety & { stoneCount: number };

export const varieties: VarietyWithCount[] = masterVarieties.map((v) => ({
  ...v,
  stoneCount: countByVariety.get(v.id) ?? 0,
}));

export const stones = masterStones;
export {
  cuts,
  origins,
  treatments,
  colors,
  certificates,
  encyclopediaEntries,
};

// Профиль гемолога: число камней берём из каталога, а не из текста.
export const gemologist = {
  ...baseGemologist,
  stats: baseGemologist.stats.map((st) =>
    st.label === "камней в коллекции"
      ? { value: String(masterStones.length), label: `${plural(masterStones.length, ["камень", "камня", "камней"])} в коллекции` }
      : st,
  ),
};
export const posts = masterPosts;

// --- Индексы -----------------------------------------------------------------
const varietyById = new Map(varieties.map((v) => [v.id, v]));
const varietyBySlug = new Map(varieties.map((v) => [v.slug, v]));
const stoneById = new Map(masterStones.map((s) => [s.id, s]));
const stoneBySlug = new Map(masterStones.map((s) => [s.slug, s]));
const colorBySlug = new Map<string, (typeof colors)[number]>(
  colors.map((c) => [c.slug, c]),
);
const colorById = new Map<string, (typeof colors)[number]>(
  colors.map((c) => [c.id, c]),
);
const cutById = new Map(cuts.map((c) => [c.id, c]));
const originById = new Map(origins.map((o) => [o.id, o]));
const treatmentById = new Map(treatments.map((t) => [t.id, t]));
const certificateById = new Map(certificates.map((c) => [c.id, c]));
const entryByVarietyId = new Map(encyclopediaEntries.map((e) => [e.varietyId, e]));
const postById = new Map(masterPosts.map((p) => [p.id, p]));

// Нейтральный цвет на случай камня без цвета в таксономии.
const FALLBACK_HEX = "#8a8a8a";

// --- Базовые геттеры ---------------------------------------------------------
export const getVariety = (id: string) => varietyById.get(id) ?? null;
export const getVarietyBySlug = (slug: string) => varietyBySlug.get(slug) ?? null;
export const getColorBySlug = (slug: string) => colorBySlug.get(slug) ?? null;
export const getColor = (id: string) => colorById.get(id) ?? null;
export const getStone = (id: string) => stoneById.get(id) ?? null;
export const getStoneBySlug = (slug: string) => stoneBySlug.get(slug) ?? null;
export const getCut = (id: string) => cutById.get(id) ?? null;
export const getOrigin = (id: string) => originById.get(id) ?? null;
export const getTreatment = (id: string) => treatmentById.get(id) ?? null;
export const getCertificate = (id: string | null) =>
  id ? certificateById.get(id) ?? null : null;

export const photoFor = (s: MasterStone): string => s.media[0]?.url ?? "";

// --- Карточные проекции ------------------------------------------------------
/** Полная карточка камня для каталога (catalog-browse Stone). */
export function toCatalogStone(s: MasterStone) {
  return {
    id: s.id,
    slug: s.slug,
    varietyId: s.varietyId,
    colorId: s.colorId,
    name: s.name,
    weightCt: s.weightCt,
    dimensionsMm: s.dimensionsMm,
    price: s.price,
    cutId: s.cutId,
    originId: s.originId,
    treatmentId: s.treatmentId,
    certificateId: s.certificateId,
    photoUrl: photoFor(s),
    isAvailable: s.isAvailable,
    addedAt: s.addedAt,
  };
}

/** Мини-карточка камня (similar / live / blog mentioned). */
export function toStoneCard(s: MasterStone) {
  return {
    id: s.id,
    slug: s.slug,
    varietyId: s.varietyId,
    name: s.name,
    weightCt: s.weightCt,
    price: s.price,
    photoUrl: photoFor(s),
    isAvailable: s.isAvailable,
    colorHex: colorById.get(s.colorId)?.hex ?? FALLBACK_HEX,
    varietyName: varietyById.get(s.varietyId)?.name ?? "",
    dimensionsMm: s.dimensionsMm,
  };
}

/** Мини-карточка для модалки заявки (inquiry InquiryStoneMini). */
export function toInquiryMini(s: MasterStone) {
  return {
    id: s.id,
    name: s.name,
    weightCt: s.weightCt,
    cutName: cutById.get(s.cutId)?.name ?? "",
    photoUrl: photoFor(s),
    price: s.price,
  };
}

// --- Каталог -----------------------------------------------------------------
/** Проекция вида в shape каталожного таба (StoneVariety) — без тяжёлого editorial. */
export function toCatalogVariety(v: VarietyWithCount) {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    imageUrl: v.imageUrl,
    stoneCount: v.stoneCount,
    shortDescription: v.shortDescription,
  };
}

/** Все виды как каталожные табы. */
export const catalogVarieties = () => varieties.map(toCatalogVariety);

export const allCatalogStones = () =>
  [...masterStones].sort((a, b) => b.addedAt.localeCompare(a.addedAt)).map(toCatalogStone);

export function stonesForVariety(varietyId: string): MasterStone[] {
  return masterStones
    .filter((s) => s.varietyId === varietyId)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

/** Похожие камни того же вида (для Stone Detail). */
export function similarStones(stone: MasterStone, limit = 4) {
  return masterStones
    .filter((s) => s.varietyId === stone.varietyId && s.id !== stone.id)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit)
    .map(toStoneCard);
}

/** Камни вида в наличии (для live-блоков энциклопедии/блога). */
export function liveStonesForVariety(varietyId: string, limit = 5) {
  return masterStones
    .filter((s) => s.varietyId === varietyId && s.isAvailable)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit)
    .map(toStoneCard);
}

/** Камни любого из видов поста в наличии. */
export function liveStonesForVarieties(varietyIds: string[], limit = 5) {
  const set = new Set(varietyIds);
  return masterStones
    .filter((s) => set.has(s.varietyId) && s.isAvailable)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit)
    .map(toStoneCard);
}

/** Цвета, реально встречающиеся у камней данного вида (для SEO-роутов /catalog/[v]/[color]). */
export function colorsForVariety(varietyId: string) {
  const ids = new Set(
    masterStones.filter((s) => s.varietyId === varietyId).map((s) => s.colorId),
  );
  return colors.filter((c) => ids.has(c.id));
}

// --- Stone Detail ------------------------------------------------------------
/** Лёгкая проекция вида для Stone Detail (StoneVariety). */
export function toDetailVariety(v: MasterVariety) {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    genitiveName: v.genitiveName,
    pluralName: v.pluralName,
  };
}

// --- Энциклопедия ------------------------------------------------------------
export const getEntryByVarietyId = (varietyId: string): MasterEncyclopediaEntry | null =>
  entryByVarietyId.get(varietyId) ?? null;

export const getEntryBySlug = (slug: string): MasterEncyclopediaEntry | null =>
  encyclopediaEntries.find((e) => e.slug === slug) ?? null;

/** Виды, для которых есть статья энциклопедии (для index и getStaticPaths). */
export const encyclopediaVarieties = () =>
  varieties.filter((v) => entryByVarietyId.has(v.id));

// --- Блог --------------------------------------------------------------------
export const getPost = (id: string) => postById.get(id) ?? null;
export const getPostBySlug = (slug: string) =>
  masterPosts.find((p) => p.slug === slug) ?? null;

export const sortedPosts = () =>
  [...masterPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const postsForVariety = (varietyId: string) =>
  sortedPosts().filter((p) => p.varietyIds.includes(varietyId));

export function relatedPosts(post: MasterPost, limit = 3) {
  const byId = post.relatedPostIds
    .map((id) => postById.get(id))
    .filter((p): p is MasterPost => Boolean(p));
  if (byId.length >= limit) return byId.slice(0, limit);
  // добор по общему виду
  const extra = sortedPosts().filter(
    (p) => p.id !== post.id && !byId.includes(p) && p.varietyIds.some((v) => post.varietyIds.includes(v)),
  );
  return [...byId, ...extra].slice(0, limit);
}

export function mentionedStonesForPost(post: MasterPost, limit = 4) {
  const set = new Set(post.varietyIds);
  return masterStones
    .filter((s) => set.has(s.varietyId) && s.isAvailable)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit)
    .map(toStoneCard);
}

/** Карточка поста (BlogPostCard) — без тела. */
export function toPostCard(p: MasterPost) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverPhotoUrl: p.coverPhotoUrl,
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes,
    varietyIds: p.varietyIds,
    varietyLabel: p.varietyLabel,
    isFeatured: p.isFeatured,
  };
}

/** Темы (фильтр-чипы) блога — виды, по которым есть посты, с счётчиком. */
export function blogTopics() {
  return varieties
    .map((v) => ({
      id: v.id,
      slug: v.slug,
      name: v.name,
      postCount: masterPosts.filter((p) => p.varietyIds.includes(v.id)).length,
    }))
    .filter((t) => t.postCount > 0);
}

// --- Контакты гемолога -------------------------------------------------------
const TELEGRAM_USER = "dmitry_gem";
const PHONE_E164 = "79050000000";

/** Контакт-каналы для Stone Detail с предзаполненным текстом по камню. */
export function contactChannelsFor(stoneName: string, weightCt: number) {
  const msg = `Интересует камень ${stoneName} ${weightCt.toFixed(2).replace(".", ",")} ct`;
  const enc = encodeURIComponent(msg);
  return [
    { type: "telegram" as const, label: `@${TELEGRAM_USER}`, href: `https://t.me/${TELEGRAM_USER}?text=${enc}` },
    { type: "whatsapp" as const, label: "+7 905 000-00-00", href: `https://wa.me/${PHONE_E164}?text=${enc}` },
    { type: "phone" as const, label: "+7 905 000-00-00", href: `tel:+${PHONE_E164}` },
  ];
}

/** Каналы для модалки заявки (с lucide-иконками). */
export const inquiryChannels = [
  { type: "telegram" as const, label: "Telegram", icon: "Send" as const },
  { type: "whatsapp" as const, label: "WhatsApp", icon: "MessageCircle" as const },
  { type: "phone" as const, label: "Телефон", icon: "Phone" as const },
];

/** Ссылка на канал по типу (для About onContact / empty-state энциклопедии). */
export function contactHref(channel: "telegram" | "whatsapp" | "phone"): string {
  if (channel === "telegram") return `https://t.me/${TELEGRAM_USER}`;
  if (channel === "whatsapp") return `https://wa.me/${PHONE_E164}`;
  return `tel:+${PHONE_E164}`;
}

// --- Главная -----------------------------------------------------------------
/** Виды для индекса над каталогом: только с камнями, самые многочисленные первыми. */
export const indexVarieties = () =>
  catalogVarieties()
    .filter((v) => v.stoneCount > 0)
    .sort((a, b) => b.stoneCount - a.stoneCount);

// «Живые» кадры для слайд-шоу во вступлении: камень в руке, в кольце, на коралле.
// Отобраны вручную из фото каталога: [slug камня, файл].
const HERO_SHOTS: [string, string][] = [
  ["0201-fioletovaya-shpinel", "01.jpg"],
  ["0109-zelyonyy-sapfir", "01.jpg"],
  ["0711-zheltyy-topaz", "04.jpg"],
  ["0221-krupnaya-birmanskaya-grozovaya-shpinel", "01.jpg"],
  ["0808-fioletovyy-ametist", "01.jpg"],
  ["0231-siniy-lazurit", "01.jpg"],
  ["0101-oranzhevo-rozovyy-sapfir-padparadzha", "06.jpg"],
  ["0103-zelyonyy-sapfir", "01.jpg"],
];

export const heroSlides = () =>
  HERO_SHOTS.flatMap(([slug, file]) => {
    const s = stoneBySlug.get(slug);
    return s ? [{ href: `/stones/${slug}`, src: `/images/stones/${slug}/${file}`, name: s.name, weightCt: s.weightCt }] : [];
  });

export { capitalize, pluralColor } from "../lib/format";
