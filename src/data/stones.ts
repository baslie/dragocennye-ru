import { withBase } from "../lib/format";
import type { MasterStone, StoneMedia, StoneCharacteristics } from "./model";
import { varieties } from "./varieties";
import { colors, cuts, origins } from "./taxonomy";
import { baseCatalog, type GeneratedStone } from "./catalog.generated";

// Каталог собран из реального ассортимента (docs/about-project/catalog.md + photos/**)
// генератором scripts/migrate-catalog.mjs. Здесь мы достраиваем media / editorial /
// characteristics над сгенерированной базой baseCatalog.

const colorById = new Map(colors.map((c) => [c.id, c]));
const cutById = new Map(cuts.map((c) => [c.id, c]));
const originById = new Map(origins.map((o) => [o.id, o]));
const varietyById = new Map(varieties.map((v) => [v.id, v]));

// Блеск по виду — заполняет паспорт камня (нет в исходных данных Tilda).
const lusterByVariety: Record<string, string> = {
  "v-cirkon": "Алмазный",
  "v-sfen": "Алмазный",
  "v-opal": "Опалесцирующий",
  "v-lunnyy-kamen": "Перламутровый",
  "v-nefrit": "Восковой",
  "v-hrizopraz": "Восковой",
  "v-lazurit": "Стеклянно-матовый",
};

// Родительный падеж страны для редакторского текста.
const countryGenitive: Record<string, string> = {
  Танзания: "Танзании",
  Мадагаскар: "Мадагаскара",
  Мозамбик: "Мозамбика",
  "Шри-Ланка": "Шри-Ланки",
  Бразилия: "Бразилии",
  Мьянма: "Мьянмы",
  Колумбия: "Колумбии",
  Африка: "Африки",
  Нигерия: "Нигерии",
  Камбоджа: "Камбоджи",
  Мексика: "Мексики",
  Эфиопия: "Эфиопии",
  Боливия: "Боливии",
  Австралия: "Австралии",
  Россия: "России",
  Намибия: "Намибии",
  Афганистан: "Афганистана",
  Индия: "Индии",
  Пакистан: "Пакистана",
  Таиланд: "Таиланда",
};

// ---------------------------------------------------------------------------
// media — все реальные фото камня (/images/stones/<slug>/<file>).
// ---------------------------------------------------------------------------
function buildMedia(s: GeneratedStone): StoneMedia[] {
  const v = varietyById.get(s.varietyId)!;
  const base = withBase(`/images/stones/${s.slug}`);
  const altFor = (idx: number): string => {
    if (idx === 0) return `${s.name} ${s.weightCt ? s.weightCt + " ct" : ""} — общий вид`.replace(/\s+/g, " ").trim();
    if (idx === 1) return `Макро ${v.genitiveName} — видны чистота и огранка`;
    return `${s.name} — ракурс ${idx + 1}`;
  };
  return s.photos.map((file, idx) => ({
    id: `${s.id}-m${idx + 1}`,
    kind: "photo",
    url: `${base}/${file}`,
    posterUrl: null,
    alt: altFor(idx),
  }));
}

function buildCharacteristics(s: GeneratedStone): StoneCharacteristics {
  const v = varietyById.get(s.varietyId)!;
  return {
    clarity: s.clarity || "—",
    luster: lusterByVariety[s.varietyId] ?? "Стеклянный",
    hardness: v.hardness,
    refractiveIndex: v.refractiveIndex,
  };
}

function buildEditorial(s: GeneratedStone): string[] {
  const v = varietyById.get(s.varietyId)!;
  const color = colorById.get(s.colorId)!;
  const cut = cutById.get(s.cutId ?? "c-unknown") ?? null;
  const origin = originById.get(s.originId ?? "o-unknown") ?? null;
  const hasCut = Boolean(s.cutId) && cut?.id !== "c-unknown";
  const hasOrigin = Boolean(s.originId) && origin?.id !== "o-unknown";

  const treatmentName =
    s.treatmentId === "t-unheated"
      ? "негретый"
      : s.treatmentId === "t-heated"
        ? "нагретый"
        : "промасленный";
  const weightPhrase = s.weightCt
    ? ` массой ${s.weightCt.toFixed(2).replace(".", ",")} ct`
    : "";
  const originPhrase = hasOrigin
    ? ` из ${countryGenitive[origin!.country] ?? origin!.country}`
    : "";

  const mm = s.dimensionsMm.replaceAll(".", ",");

  const luster = (lusterByVariety[s.varietyId] ?? "Стеклянный").toLowerCase();

  const para1 =
    `${color.name} ${v.name.toLowerCase()}${originPhrase}${weightPhrase} — ` +
    `природный камень, ${treatmentName}, без скрытых заполнений.`;

  const para2 = hasCut
    ? `Огранка «${cut!.name.toLowerCase()}» работает на весь вес: камень собран, блеск ${luster}.` +
      (mm ? ` Размеры ${mm} мм дают камню присутствие в оправе.` : "")
    : `Форма подобрана под характер камня, блеск ${luster}.` +
      (mm ? ` Размеры ${mm} мм.` : "");

  const para3 = `Хороший кандидат как центральный камень в украшение или для коллекции. Паспорт характеристик подготовлен Дмитрием лично.`;

  return [para1, para2, para3];
}

// ---------------------------------------------------------------------------
// Сборка финального массива MasterStone.
// ---------------------------------------------------------------------------
function assemble(): MasterStone[] {
  return baseCatalog.map((s) => ({
    id: s.id,
    slug: s.slug,
    varietyId: s.varietyId,
    colorId: s.colorId,
    cutId: s.cutId ?? "c-unknown",
    originId: s.originId ?? "o-unknown",
    treatmentId: s.treatmentId,
    certificateId: null,
    name: s.name,
    weightCt: s.weightCt,
    dimensionsMm: s.dimensionsMm,
    price: s.price,
    isAvailable: s.isAvailable,
    addedAt: s.addedAt,
    media: buildMedia(s),
    editorial: buildEditorial(s),
    characteristics: buildCharacteristics(s),
  }));
}

export const stones: MasterStone[] = assemble();
