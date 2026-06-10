import type { MasterStone, StoneMedia, StoneCharacteristics } from "./model";
import { varieties } from "./varieties";
import { colors, cuts, origins } from "./taxonomy";

// Базовый набор камней (полей каталога) — взят из handoff sample-data.
// media / editorial / characteristics достраиваются билдером ниже.
interface BaseStone {
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
  isAvailable: boolean;
  addedAt: string;
}

const baseStones: BaseStone[] = [
  { id: "st-0101", slug: "padparadzha-388ct", varietyId: "v-sapfir", colorId: "col-orange", name: "Оранжево-розовый сапфир Падпараджа", weightCt: 3.88, dimensionsMm: "10×8.5×4.7", price: 58200, cutId: "c-oval", originId: "o-tanzania", treatmentId: "t-unheated", certificateId: "cert-grs-2401", isAvailable: true, addedAt: "2026-03-28" },
  { id: "st-0102", slug: "zelyonyy-sapfir-363ct", varietyId: "v-sapfir", colorId: "col-green", name: "Зелёный сапфир", weightCt: 3.63, dimensionsMm: "10.8×8.3×4.5", price: 40800, cutId: "c-oval", originId: "o-mozambique", treatmentId: "t-heated", certificateId: "cert-grs-2401", isAvailable: true, addedAt: "2026-03-25" },
  { id: "st-0103", slug: "zelyonyy-sapfir-184ct", varietyId: "v-sapfir", colorId: "col-green", name: "Зелёный сапфир", weightCt: 1.84, dimensionsMm: "6.6×6", price: 27600, cutId: "c-cushion", originId: "o-tanzania", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-03-20" },
  { id: "st-0119", slug: "belyy-sapfir-081ct", varietyId: "v-sapfir", colorId: "col-white", name: "Белый сапфир", weightCt: 0.81, dimensionsMm: "5×4", price: 18200, cutId: "c-oval", originId: "o-sri-lanka", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-03-18" },
  { id: "st-0116", slug: "rozovyy-sapfir-038ct", varietyId: "v-sapfir", colorId: "col-pink", name: "Розовый сапфир", weightCt: 0.38, dimensionsMm: "7×3.5", price: 4300, cutId: "c-marquise", originId: "o-madagascar", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-03-15" },
  { id: "st-0114", slug: "rozovyy-sapfir-219ct", varietyId: "v-sapfir", colorId: "col-pink", name: "Розовый сапфир", weightCt: 2.19, dimensionsMm: "8.2×6.1×4.0", price: 32900, cutId: "c-pear", originId: "o-madagascar", treatmentId: "t-heated", certificateId: "cert-gia-2402", isAvailable: true, addedAt: "2026-03-12" },
  { id: "st-0113", slug: "fioletovyy-sapfir-034ct", varietyId: "v-sapfir", colorId: "col-violet", name: "Фиолетовый сапфир", weightCt: 0.34, dimensionsMm: "5×3.4", price: 7700, cutId: "c-oval", originId: "o-madagascar", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-03-10" },
  { id: "st-0112", slug: "oranzhevyy-sapfir-227ct", varietyId: "v-sapfir", colorId: "col-orange", name: "Оранжевый сапфир", weightCt: 2.27, dimensionsMm: "8.0×6.2×4.1", price: 25500, cutId: "c-oval", originId: "o-tanzania", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-03-08" },
  { id: "st-0110", slug: "zheltyy-sapfir-princessa-255ct", varietyId: "v-sapfir", colorId: "col-yellow", name: "Зеленовато-жёлтый сапфир Принцесса", weightCt: 2.55, dimensionsMm: "5×5", price: 28700, cutId: "c-princess", originId: "o-sri-lanka", treatmentId: "t-unheated", certificateId: "cert-ssef-2403", isAvailable: true, addedAt: "2026-03-05" },
  { id: "st-0201", slug: "rozovaya-shpinel-180ct", varietyId: "v-shpinel", colorId: "col-pink", name: "Розовая шпинель", weightCt: 1.80, dimensionsMm: "7.4×6.0×4.2", price: 42000, cutId: "c-cushion", originId: "o-tanzania", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-03-01" },
  { id: "st-0202", slug: "krasnaya-shpinel-210ct", varietyId: "v-shpinel", colorId: "col-red", name: "Красная шпинель", weightCt: 2.10, dimensionsMm: "8.1×6.4×4.5", price: 89000, cutId: "c-oval", originId: "o-myanmar", treatmentId: "t-unheated", certificateId: "cert-grs-2404", isAvailable: false, addedAt: "2026-02-28" },
  { id: "st-0301", slug: "zelyonyy-turmalin-420ct", varietyId: "v-turmalin", colorId: "col-green", name: "Зелёный турмалин верделит", weightCt: 4.20, dimensionsMm: "11.2×8.7×5.8", price: 65000, cutId: "c-octagon", originId: "o-mozambique", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-02-22" },
  { id: "st-0302", slug: "paraiba-turmalin-150ct", varietyId: "v-turmalin", colorId: "col-blue", name: "Параиба-турмалин", weightCt: 1.50, dimensionsMm: "7.3×5.4×4.0", price: 180000, cutId: "c-pear", originId: "o-brazil", treatmentId: "t-unheated", certificateId: "cert-gia-2405", isAvailable: true, addedAt: "2026-02-18" },
  { id: "st-0401", slug: "cavorit-granat-120ct", varietyId: "v-granat", colorId: "col-green", name: "Цаворит", weightCt: 1.20, dimensionsMm: "6.2×6.2×3.8", price: 36000, cutId: "c-trillion", originId: "o-tanzania", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-02-15" },
  { id: "st-0402", slug: "rodolit-granat-350ct", varietyId: "v-granat", colorId: "col-pink", name: "Родолит", weightCt: 3.50, dimensionsMm: "9.8×7.6×5.0", price: 19800, cutId: "c-oval", originId: "o-madagascar", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-02-12" },
  { id: "st-0501", slug: "siniy-cirkon-280ct", varietyId: "v-cirkon", colorId: "col-blue", name: "Синий циркон", weightCt: 2.80, dimensionsMm: "8.4×6.5×4.8", price: 14200, cutId: "c-oval", originId: "o-sri-lanka", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-02-10" },
  { id: "st-0502", slug: "zheltyy-cirkon-310ct", varietyId: "v-cirkon", colorId: "col-yellow", name: "Золотистый циркон", weightCt: 3.10, dimensionsMm: "8.8×7.0×4.9", price: 12600, cutId: "c-cushion", originId: "o-tanzania", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-02-07" },
  { id: "st-0601", slug: "akvamarin-beryll-450ct", varietyId: "v-beryll", colorId: "col-blue", name: "Аквамарин", weightCt: 4.50, dimensionsMm: "11.5×9.0×6.2", price: 52000, cutId: "c-oval", originId: "o-brazil", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-02-05" },
  { id: "st-0602", slug: "geliodor-beryll-520ct", varietyId: "v-beryll", colorId: "col-yellow", name: "Гелиодор", weightCt: 5.20, dimensionsMm: "12.0×9.2×6.4", price: 38000, cutId: "c-octagon", originId: "o-madagascar", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-02-02" },
  { id: "st-0701", slug: "ametist-830ct", varietyId: "v-kvarz", colorId: "col-violet", name: "Аметист", weightCt: 8.30, dimensionsMm: "14.5×10.8×7.2", price: 9200, cutId: "c-pear", originId: "o-brazil", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-30" },
  { id: "st-0702", slug: "citrin-710ct", varietyId: "v-kvarz", colorId: "col-yellow", name: "Цитрин", weightCt: 7.10, dimensionsMm: "13.8×10.2×6.8", price: 7800, cutId: "c-cushion", originId: "o-brazil", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-01-28" },
  { id: "st-0801", slug: "belyy-opal-240ct", varietyId: "v-opal", colorId: "col-white", name: "Белый благородный опал", weightCt: 2.40, dimensionsMm: "9.2×7.4×4.5", price: 15600, cutId: "c-oval", originId: "o-madagascar", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-25" },
  { id: "st-0802", slug: "ognennyy-opal-190ct", varietyId: "v-opal", colorId: "col-orange", name: "Огненный опал", weightCt: 1.90, dimensionsMm: "8.6×6.7×4.0", price: 21000, cutId: "c-oval", originId: "o-madagascar", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-22" },
  { id: "st-0901", slug: "goluboy-topaz-650ct", varietyId: "v-topaz", colorId: "col-blue", name: "Голубой топаз Sky Blue", weightCt: 6.50, dimensionsMm: "13.2×10.1×6.8", price: 16800, cutId: "c-oval", originId: "o-brazil", treatmentId: "t-heated", certificateId: null, isAvailable: true, addedAt: "2026-01-20" },
  { id: "st-0902", slug: "medovyy-topaz-420ct", varietyId: "v-topaz", colorId: "col-yellow", name: "Медовый топаз", weightCt: 4.20, dimensionsMm: "10.8×8.5×5.4", price: 22400, cutId: "c-octagon", originId: "o-sri-lanka", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-18" },
  { id: "st-1001", slug: "siniy-tanzanit-210ct", varietyId: "v-tanzanit", colorId: "col-blue", name: "Синий танзанит", weightCt: 2.10, dimensionsMm: "8.0×6.2×4.3", price: 48000, cutId: "c-trillion", originId: "o-tanzania", treatmentId: "t-heated", certificateId: "cert-gia-2402", isAvailable: true, addedAt: "2026-01-15" },
  { id: "st-0303", slug: "rubellit-turmalin-285ct", varietyId: "v-turmalin", colorId: "col-pink", name: "Рубеллит", weightCt: 2.85, dimensionsMm: "9.1×7.0×5.2", price: 34500, cutId: "c-oval", originId: "o-mozambique", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-12" },
  { id: "st-0403", slug: "spessartin-granat-195ct", varietyId: "v-granat", colorId: "col-orange", name: "Спессартин", weightCt: 1.95, dimensionsMm: "7.5×6.0×4.3", price: 28900, cutId: "c-cushion", originId: "o-mozambique", treatmentId: "t-unheated", certificateId: null, isAvailable: true, addedAt: "2026-01-10" },
];

// ---------------------------------------------------------------------------
// Профили генерации дополнительных камней по видам — чтобы каталог, табы и
// пагинация работали на реальном объёме (~70 камней). Детерминированно.
// ---------------------------------------------------------------------------
interface VarietyProfile {
  target: number; // желаемое число камней вида (включая базовые)
  colorIds: string[];
  originIds: string[];
  cutIds: string[];
  pricePerCt: number; // базовая цена за карат
  baseWeight: number;
  luster: string;
  nameFor: (colorName: string) => string;
}

const profiles: Record<string, VarietyProfile> = {
  "v-sapfir": { target: 15, colorIds: ["col-blue", "col-green", "col-yellow", "col-pink", "col-violet", "col-orange", "col-white"], originIds: ["o-sri-lanka", "o-madagascar", "o-tanzania", "o-mozambique"], cutIds: ["c-oval", "c-cushion", "c-octagon", "c-pear", "c-princess"], pricePerCt: 14000, baseWeight: 1.4, luster: "Стеклянный", nameFor: (c) => `${c} сапфир` },
  "v-shpinel": { target: 7, colorIds: ["col-pink", "col-red", "col-violet", "col-blue"], originIds: ["o-myanmar", "o-tanzania", "o-sri-lanka"], cutIds: ["c-cushion", "c-oval", "c-octagon"], pricePerCt: 22000, baseWeight: 1.2, luster: "Стеклянный", nameFor: (c) => `${c} шпинель` },
  "v-turmalin": { target: 8, colorIds: ["col-green", "col-pink", "col-blue", "col-yellow"], originIds: ["o-brazil", "o-mozambique"], cutIds: ["c-octagon", "c-oval", "c-pear", "c-cushion"], pricePerCt: 13000, baseWeight: 2.2, luster: "Стеклянный", nameFor: (c) => `${c} турмалин` },
  "v-granat": { target: 7, colorIds: ["col-green", "col-orange", "col-pink", "col-red"], originIds: ["o-tanzania", "o-madagascar", "o-mozambique"], cutIds: ["c-trillion", "c-cushion", "c-oval"], pricePerCt: 11000, baseWeight: 1.6, luster: "Стеклянный", nameFor: (c) => `${c} гранат` },
  "v-cirkon": { target: 6, colorIds: ["col-blue", "col-yellow", "col-white"], originIds: ["o-sri-lanka", "o-tanzania"], cutIds: ["c-oval", "c-cushion"], pricePerCt: 4500, baseWeight: 2.6, luster: "Алмазный", nameFor: (c) => `${c} циркон` },
  "v-beryll": { target: 5, colorIds: ["col-blue", "col-yellow", "col-pink"], originIds: ["o-brazil", "o-madagascar"], cutIds: ["c-octagon", "c-oval"], pricePerCt: 9000, baseWeight: 4.0, luster: "Стеклянный", nameFor: (c) => `${c} берилл` },
  "v-kvarz": { target: 7, colorIds: ["col-violet", "col-yellow", "col-pink", "col-white"], originIds: ["o-brazil", "o-madagascar"], cutIds: ["c-pear", "c-cushion", "c-oval", "c-octagon"], pricePerCt: 1200, baseWeight: 6.5, luster: "Стеклянный", nameFor: (c) => `${c} кварц` },
  "v-opal": { target: 5, colorIds: ["col-white", "col-orange", "col-blue"], originIds: ["o-madagascar"], cutIds: ["c-oval"], pricePerCt: 8000, baseWeight: 2.0, luster: "Опалесцирующий", nameFor: (c) => `${c} опал` },
  "v-topaz": { target: 6, colorIds: ["col-blue", "col-yellow", "col-orange", "col-white"], originIds: ["o-brazil", "o-sri-lanka"], cutIds: ["c-oval", "c-octagon", "c-pear"], pricePerCt: 3500, baseWeight: 5.0, luster: "Стеклянный", nameFor: (c) => `${c} топаз` },
  "v-tanzanit": { target: 3, colorIds: ["col-blue", "col-violet"], originIds: ["o-tanzania"], cutIds: ["c-trillion", "c-oval"], pricePerCt: 23000, baseWeight: 1.8, luster: "Стеклянный", nameFor: (c) => `${c} танзанит` },
};

const clarityCycle = ["Eye-clean", "VVS", "VS", "Eye-clean", "SI (видимые включения)"];
const treatmentCycle = ["t-unheated", "t-heated", "t-unheated", "t-oiled"];

const colorById = new Map(colors.map((c) => [c.id, c]));
const varietyById = new Map(varieties.map((v) => [v.id, v]));

function adjective(colorName: string): string {
  // «Зелёный» → «Зелёного» не нужно; используем как есть в начале названия
  return colorName;
}

function round100(n: number): number {
  return Math.round(n / 100) * 100;
}

function dimsFor(weightCt: number): string {
  const l = (5 + weightCt * 1.4).toFixed(1);
  const w = (4 + weightCt * 1.05).toFixed(1);
  const d = (2.6 + weightCt * 0.55).toFixed(1);
  return `${l}×${w}×${d}`;
}

function isoMinusDays(anchorIso: string, days: number): string {
  const ms = new Date(anchorIso + "T00:00:00Z").getTime() - days * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

function generatedFor(varietyId: string, existing: BaseStone[]): BaseStone[] {
  const profile = profiles[varietyId];
  if (!profile) return [];
  const need = profile.target - existing.length;
  if (need <= 0) return [];
  const variety = varietyById.get(varietyId)!;
  const out: BaseStone[] = [];
  for (let k = 0; k < need; k++) {
    const colorId = profile.colorIds[k % profile.colorIds.length];
    const cutId = profile.cutIds[k % profile.cutIds.length];
    const originId = profile.originIds[k % profile.originIds.length];
    const treatmentId = treatmentCycle[k % treatmentCycle.length];
    const color = colorById.get(colorId)!;
    const weightCt = Number((profile.baseWeight + (k % 5) * 0.43 + (k % 3) * 0.17).toFixed(2));
    const colorFactor = 1 + ((k % 4) * 0.18);
    const price = round100(weightCt * profile.pricePerCt * colorFactor);
    const seq = String(k + 1).padStart(2, "0");
    const name = profile.nameFor(adjective(color.name));
    const id = `st-${variety.slug}-g${seq}`;
    out.push({
      id,
      slug: `${variety.slug}-${color.slug}-${String(weightCt).replace(".", "")}ct-${seq}`,
      varietyId,
      colorId,
      name,
      weightCt,
      dimensionsMm: dimsFor(weightCt),
      price,
      cutId,
      originId,
      treatmentId,
      certificateId: null,
      isAvailable: k % 8 !== 3,
      addedAt: isoMinusDays("2026-01-08", k * 4 + (varietyId.length % 5)),
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Достраивание media / editorial / characteristics для каждого камня.
// ---------------------------------------------------------------------------
function buildMedia(s: BaseStone): StoneMedia[] {
  const v = varietyById.get(s.varietyId)!;
  const base = `/images/stones/${s.id}`;
  return [
    { id: `${s.id}-m1`, kind: "photo", url: `${base}/front.jpg`, posterUrl: null, alt: `${s.name} ${s.weightCt} ct — вид спереди на белом фоне` },
    { id: `${s.id}-m2`, kind: "photo", url: `${base}/macro.jpg`, posterUrl: null, alt: `Макро ${v.genitiveName} — видна внутренняя чистота и огранка` },
    { id: `${s.id}-m3`, kind: "photo", url: `${base}/scale.jpg`, posterUrl: null, alt: `${s.name} рядом с линейкой — масштаб ${s.dimensionsMm} мм` },
  ];
}

function buildCharacteristics(s: BaseStone, idx: number): StoneCharacteristics {
  const v = varietyById.get(s.varietyId)!;
  const profile = profiles[s.varietyId];
  return {
    clarity: clarityCycle[idx % clarityCycle.length],
    luster: profile?.luster ?? "Стеклянный",
    hardness: v.hardness,
    refractiveIndex: v.refractiveIndex,
  };
}

function buildEditorial(s: BaseStone): string[] {
  const v = varietyById.get(s.varietyId)!;
  const color = colorById.get(s.colorId)!;
  const cut = cuts.find((c) => c.id === s.cutId)!;
  const origin = origins.find((o) => o.id === s.originId)!;
  const treatmentName = s.treatmentId === "t-unheated" ? "негретый" : s.treatmentId === "t-heated" ? "нагретый" : "промасленный";
  return [
    `${color.name} ${v.name.toLowerCase()} из ${origin.country === "Мадагаскар" ? "Мадагаскара" : origin.country} массой ${s.weightCt.toFixed(2).replace(".", ",")} ct — чистый тон без посторонних оттенков. Камень ${treatmentName}, без стеклянных заполнений.`,
    `Огранка «${cut.name.toLowerCase()}» работает на весь вес: камень собран, окно минимальное, блеск ${buildCharacteristics(s, 0).luster.toLowerCase()}. Размеры ${s.dimensionsMm} мм дают камню присутствие в оправе.`,
    `Хороший кандидат как центральный камень в кольцо или для коллекции. ${s.certificateId ? "С полным лабораторным сертификатом." : "Паспорт характеристик подготовлен Дмитрием лично."}`,
  ];
}

// ---------------------------------------------------------------------------
// Сборка финального массива MasterStone.
// ---------------------------------------------------------------------------
function assemble(): MasterStone[] {
  const byVariety = new Map<string, BaseStone[]>();
  for (const s of baseStones) {
    const arr = byVariety.get(s.varietyId) ?? [];
    arr.push(s);
    byVariety.set(s.varietyId, arr);
  }

  const all: BaseStone[] = [...baseStones];
  for (const v of varieties) {
    const existing = byVariety.get(v.id) ?? [];
    all.push(...generatedFor(v.id, existing));
  }

  return all.map((s, idx) => ({
    ...s,
    media: buildMedia(s),
    editorial: buildEditorial(s),
    characteristics: buildCharacteristics(s, idx),
  }));
}

export const stones: MasterStone[] = assemble();
