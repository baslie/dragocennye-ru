// Одноразовый мигратор каталога «Драгоценных».
// Фаза 1: копирует реальные фото из docs/about-project/photos/** в public/images/stones/<folderSlug>/
//         с нормализацией регистра расширений; собирает манифест файлов на камень.
// Фаза 2: парсит docs/about-project/catalog.md (224 камня) в src/data/catalog.generated.ts,
//         приклеивая список реальных фото к каждой записи.
//
// Запуск:  node scripts/migrate-catalog.mjs
// Вывод (коммитится): public/images/stones/**, src/data/catalog.generated.ts
//
// Канонический ключ камня = folderSlug (имя папки с числовым префиксом). Номера НЕ уникальны
// между категориями, поэтому ключуемся по folderSlug — он латинский и уникален по построению.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTOS_SRC = path.join(ROOT, "docs", "about-project", "photos");
const CATALOG_MD = path.join(ROOT, "docs", "about-project", "catalog.md");
const PUBLIC_STONES = path.join(ROOT, "public", "images", "stones");
const OUT_TS = path.join(ROOT, "src", "data", "catalog.generated.ts");

const IMG_RE = /\.(jpe?g|png)$/i;

// --- словари --------------------------------------------------------------

// Категория (кириллица из catalog.md) → varietyId
const CATEGORY_TO_VARIETY = {
  "Сапфир": "v-sapfir",
  "Шпинель": "v-shpinel",
  "Турмалин": "v-turmalin",
  "Гранат": "v-granat",
  "Лунный камень": "v-lunnyy-kamen",
  "Циркон": "v-cirkon",
  "Берилл": "v-beryll",
  "Топаз": "v-topaz",
  "Кварц": "v-kvarz",
  "Опал": "v-opal",
  "Сфен": "v-sfen",
  "Кунцит": "v-kuntsit",
  "Грандидьерит": "v-grandiderit",
  "Хризоберилл": "v-hrizoberill",
  "Танзанит": "v-tanzanit",
  "Апатит": "v-apatit",
  "Хризопраз": "v-hrizopraz",
  "Нефрит": "v-nefrit",
  "Хромдиопсид": "v-hromdiopsid",
  "Андалузит": "v-andaluzit",
  "Иолит": "v-iolit",
  "Лазурит": "v-lazurit",
  "Хризолит": "v-hrizolit",
};

// Огранка: упорядоченный список [подстрока в описании, cutId]. Проверяется сверху вниз.
const CUT_RULES = [
  ["кабошон", "c-cabochon"],
  ["восьмиугольник", "c-octagon"],
  ["изумрудн", "c-octagon"],
  ["октагон", "c-octagon"],
  ["триллион", "c-trillion"],
  ["принцесс", "c-princess"],
  ["маркиз", "c-marquise"],
  ["груш", "c-pear"],
  ["подушк", "c-cushion"],
  ["кушон", "c-cushion"],
  ["квадрат", "c-square"],
  ["багет", "c-baguette"],
  ["ашер", "c-asscher"],
  ["сердц", "c-heart"],
  ["резьб", "c-carving"],
  ["резн", "c-carving"],
  ["круг", "c-round"],
  ["овал", "c-oval"], // покрывает «овальный», «овальная», «овал»
];

// Происхождение: подстрока (кириллица) → originId. Длинные/специфичные — раньше.
const ORIGIN_RULES = [
  ["Шри-Ланк", "o-sri-lanka"],
  ["Мадагаскар", "o-madagascar"],
  ["Мозамбик", "o-mozambique"],
  ["Танзани", "o-tanzania"],
  ["Бразили", "o-brazil"],
  ["Мьянм", "o-myanmar"],
  ["Бирм", "o-myanmar"],
  ["Колумби", "o-colombia"],
  ["Нигери", "o-nigeria"],
  ["Камбодж", "o-cambodia"],
  ["Мексик", "o-mexico"],
  ["Эфиопи", "o-ethiopia"],
  ["Боливи", "o-bolivia"],
  ["Австрали", "o-australia"],
  ["Намиби", "o-namibia"],
  ["Афганистан", "o-afghanistan"],
  ["Индия", "o-india"],
  ["Инди", "o-india"],
  ["Пакистан", "o-pakistan"],
  ["Таиланд", "o-thailand"],
  ["Росси", "o-russia"],
  ["Урал", "o-russia"],
  ["Африк", "o-africa"], // generic — последним среди стран
];

// Цвет: подстрока-основа → colorId. Используется посегментно.
const HUE_RULES = [
  ["неонов", "col-blue"],
  ["голуб", "col-blue"],
  ["син", "col-blue"],
  ["зелен", "col-green"],
  ["зелён", "col-green"],
  ["золот", "col-yellow"],
  ["желт", "col-yellow"],
  ["жёлт", "col-yellow"],
  ["лимонн", "col-yellow"],
  ["розов", "col-pink"],
  ["фиолетов", "col-violet"],
  ["пурпурн", "col-violet"],
  ["сиренев", "col-violet"],
  ["оранж", "col-orange"],
  ["вишн", "col-red"],
  ["красн", "col-red"],
  ["чёрн", "col-black"],
  ["черн", "col-black"],
  ["шампан", "col-brown"],
  ["коричн", "col-brown"],
  ["бел", "col-white"],
  ["бесцвет", "col-grey"],
  ["платинов", "col-grey"],
  ["сер", "col-grey"],
];

function matchHue(token) {
  for (const [needle, id] of HUE_RULES) if (token.includes(needle)) return id;
  return null;
}

// Вторичный словарь: цвет, подразумеваемый названием камня/разновидности
// (нет явного прилагательного). Применяется ко всей строке, когда первичный проход пуст.
const NAME_HUE_RULES = [
  ["рубин", "col-red"],
  ["клубничн", "col-pink"],
  ["морган", "col-pink"],
  ["аметист", "col-violet"],
  ["аметрин", "col-violet"],
  ["цитрин", "col-yellow"],
  ["гелиодор", "col-yellow"],
  ["рутил", "col-yellow"],
  ["бирюз", "col-blue"],
  ["лагун", "col-blue"],
  ["lagoon", "col-blue"],
  ["нефрит", "col-green"],
  ["празиолит", "col-green"],
  ["хром", "col-green"],
  ["гессонит", "col-orange"],
  ["гомед", "col-orange"],
  ["гошенит", "col-white"],
  ["хрусталь", "col-white"],
  ["лунный", "col-white"],
];

// Цвет камня из названия. В составном слове предпочитаем последний ХРОМАТИЧЕСКИЙ тон
// нейтральному (grey): «фиолетово-серый» → violet, «платиново-серый» → grey,
// «голубовато-зелёный» → green.
function resolveColor(name) {
  const lower = name.toLowerCase();
  if (lower.includes("падпарадж")) return "col-orange";
  const words = lower.split(/[\s(),]+/).filter(Boolean);
  for (const w of words) {
    const segs = w.split("-");
    let lastChromatic = null;
    let lastAny = null;
    for (const seg of segs) {
      const m = matchHue(seg);
      if (m) {
        lastAny = m;
        if (m !== "col-grey") lastChromatic = m;
      }
    }
    const found = lastChromatic ?? lastAny;
    if (found) return found;
  }
  // подразумеваемый цвет по названию-камню
  for (const [needle, id] of NAME_HUE_RULES) if (lower.includes(needle)) return id;
  return null; // → залогируем, фолбэк grey в вызывающем коде
}

function resolveCut(desc) {
  const lower = desc.toLowerCase();
  for (const [needle, id] of CUT_RULES) if (lower.includes(needle)) return id;
  return null;
}

function resolveOrigin(desc) {
  for (const [needle, id] of ORIGIN_RULES) if (desc.includes(needle)) return id;
  return null;
}

function resolveTreatment(desc) {
  const lower = desc.toLowerCase();
  if (/негрет|без облагоражив|необлагороженн|без облагораж|unheated|не подвергал/.test(lower))
    return "t-unheated";
  if (/масл|oiled|промасл/.test(lower)) return "t-oiled";
  if (/нагрев|h-heated|heated|подвергнут нагреву|термич/.test(lower)) return "t-heated";
  return "t-unheated"; // по умолчанию не приписываем нагрев
}

function parseWeight(desc) {
  const m = desc.match(/(\d+(?:[.,]\d+)?)\s*(?:ct|карат)/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

function parseDimensions(desc) {
  // ловим A x B (x C) mm с латинским x, × или кириллической х
  const m = desc.match(
    /(\d+(?:[.,]\d+)?)\s*[x×х]\s*(\d+(?:[.,]\d+)?)(?:\s*[x×х]\s*(\d+(?:[.,]\d+)?))?\s*mm/i,
  );
  if (!m) return "";
  const parts = [m[1], m[2], m[3]].filter(Boolean).map((p) => p.replace(",", "."));
  return parts.join("×");
}

function parseClarity(desc) {
  let m = desc.match(/Чистота камня\s+([A-Za-z0-9][A-Za-z0-9\-]*)/);
  if (m) return m[1].toUpperCase();
  m = desc.match(/\b(IF-VS|VVS\d?|VS\d?|SI[0-9]?(?:-I)?|I[12](?:-I[12])?)\b/);
  if (m) return m[1].toUpperCase();
  return "";
}

function parseStock(desc) {
  const m = desc.match(/в наличии\s+(\d+)\s*шт/i);
  return m ? Number(m[1]) : 1;
}

function parsePrice(line) {
  const m = line.match(/([\d\s ]+)\s*₽/);
  return m ? Number(m[1].replace(/[\s ]/g, "")) : 0;
}

// folderSlug → ведущие цифры (display SKU)
function numberOf(folderSlug) {
  const m = folderSlug.match(/^(\d+)/);
  return m ? m[1] : folderSlug;
}

function naturalSort(a, b) {
  return a.localeCompare(b, "en", { numeric: true });
}

// --- Фаза 1: копирование фото --------------------------------------------

function copyPhotos() {
  // карта folderSlug → { category, files[] }
  const manifest = new Map();
  const categories = fs
    .readdirSync(PHOTOS_SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  let copied = 0;
  for (const cat of categories) {
    const catDir = path.join(PHOTOS_SRC, cat.name);
    const stones = fs
      .readdirSync(catDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const st of stones) {
      const srcDir = path.join(catDir, st.name);
      const files = fs
        .readdirSync(srcDir)
        .filter((f) => IMG_RE.test(f))
        .sort(naturalSort);
      if (!files.length) {
        console.warn(`⚠ пустая папка фото: ${cat.name}/${st.name}`);
        continue;
      }
      const destDir = path.join(PUBLIC_STONES, st.name);
      fs.mkdirSync(destDir, { recursive: true });
      const outFiles = [];
      for (const f of files) {
        const lower = f.toLowerCase(); // 01.JPG → 01.jpg
        fs.copyFileSync(path.join(srcDir, f), path.join(destDir, lower));
        outFiles.push(lower);
        copied++;
      }
      manifest.set(st.name, { category: cat.name, files: outFiles });
    }
  }
  console.log(`✔ Фаза 1: скопировано ${copied} фото в ${path.relative(ROOT, PUBLIC_STONES)} (${manifest.size} камней)`);
  return manifest;
}

// --- Фаза 2: парсинг catalog.md ------------------------------------------

function parseCatalog(manifest) {
  const md = fs.readFileSync(CATALOG_MD, "utf8");
  const lines = md.split(/\r?\n/);

  let category = null;
  const records = [];
  let cur = null;

  const flush = () => {
    if (cur) records.push(cur);
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^##\s+(.+)$/)) && !line.startsWith("###")) {
      const name = m[1].trim();
      if (name === "Оглавление") continue;
      category = name;
      continue;
    }
    if ((m = line.match(/^###\s+(\S+)\s+·\s+(.+)$/))) {
      flush();
      cur = { category, number: m[1].trim(), name: m[2].trim(), price: 0, desc: "" };
      continue;
    }
    if (!cur) continue;
    if ((m = line.match(/^-\s+\*\*Цена:\*\*\s*(.+)$/))) {
      cur.price = parsePrice(m[1]);
    } else if ((m = line.match(/^-\s+\*\*Описание:\*\*\s*(.+)$/))) {
      cur.desc = m[1].replace(/<br\s*\/?>/gi, " ").replace(/#nbsp;|&nbsp;/gi, " ").trim();
    } else if ((m = line.match(/\]\(photos\/[^/]+\/([^/]+)\//))) {
      cur.folderSlug = m[1];
    }
  }
  flush();

  // карта возможных проблем для лога
  const issues = { color: [], cut: [], origin: [], weight: [], nophotos: [] };
  const ANCHOR = "2026-04-13";

  const stones = records.map((r, idx) => {
    const varietyId = CATEGORY_TO_VARIETY[r.category];
    if (!varietyId) throw new Error(`Неизвестная категория: «${r.category}» у ${r.number}`);
    const folderSlug = r.folderSlug;
    if (!folderSlug) throw new Error(`Нет folderSlug у записи ${r.number} (${r.name})`);

    const man = manifest.get(folderSlug);
    const photos = man ? man.files : [];
    if (!photos.length) issues.nophotos.push(folderSlug);

    const colorId = resolveColor(r.name) ?? "col-grey";
    if (resolveColor(r.name) === null) issues.color.push(`${r.number} ${r.name}`);

    const cutId = resolveCut(r.desc);
    if (!cutId) issues.cut.push(`${r.number} ${r.name}`);

    const originId = resolveOrigin(r.desc);
    if (!originId) issues.origin.push(`${r.number} ${r.name}`);

    const weightCt = parseWeight(r.desc);
    if (weightCt === null) issues.weight.push(`${r.number} ${r.name}`);

    const dimensionsMm = parseDimensions(r.desc);
    const clarity = parseClarity(r.desc);
    const treatmentId = resolveTreatment(r.desc);
    const stockCount = parseStock(r.desc);

    const addedAt = isoMinusDays(ANCHOR, idx);

    return {
      id: `st-${folderSlug}`,
      slug: folderSlug,
      number: numberOf(folderSlug),
      varietyId,
      colorId,
      cutId,
      originId,
      treatmentId,
      name: r.name,
      price: r.price,
      weightCt: weightCt ?? 0,
      dimensionsMm,
      clarity,
      stockCount,
      isAvailable: true,
      category: r.category,
      photos,
      addedAt,
    };
  });

  // отчёт о непарсинге (фолбэки не должны молча маскировать пропуски)
  console.log(`✔ Фаза 2: распарсено ${stones.length} камней`);
  const rep = (label, arr) =>
    arr.length && console.log(`   • ${label}: ${arr.length}${arr.length <= 20 ? " → " + arr.join("; ") : ""}`);
  rep("без цвета (→ grey)", issues.color);
  rep("без огранки (→ null)", issues.cut);
  rep("без происхождения (→ null)", issues.origin);
  rep("без веса (→ 0)", issues.weight);
  rep("без фото на диске", issues.nophotos);

  return stones;
}

function isoMinusDays(anchorIso, days) {
  const ms = new Date(anchorIso + "T00:00:00Z").getTime() - days * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

// --- Эмиссия TS ----------------------------------------------------------

function emit(stones) {
  const header = `// АВТОГЕНЕРАЦИЯ — не редактировать вручную.
// Источник: docs/about-project/catalog.md + docs/about-project/photos/**
// Генератор: scripts/migrate-catalog.mjs (node scripts/migrate-catalog.mjs)
// Всего камней: ${stones.length}

export interface GeneratedStone {
  id: string;
  slug: string;
  number: string;
  varietyId: string;
  colorId: string;
  cutId: string | null;
  originId: string | null;
  treatmentId: string;
  name: string;
  price: number;
  weightCt: number;
  dimensionsMm: string;
  clarity: string;
  stockCount: number;
  isAvailable: boolean;
  category: string;
  photos: string[];
  addedAt: string;
}

export const baseCatalog: GeneratedStone[] = ${JSON.stringify(stones, null, 2)};
`;
  fs.writeFileSync(OUT_TS, header, "utf8");
  console.log(`✔ Записано ${path.relative(ROOT, OUT_TS)}`);
}

// --- main ----------------------------------------------------------------

const manifest = copyPhotos();
const stones = parseCatalog(manifest);
emit(stones);

// сводка по видам — для сверки со счётчиками каталога
const byVar = {};
for (const s of stones) byVar[s.varietyId] = (byVar[s.varietyId] ?? 0) + 1;
console.log("Камней по видам:", JSON.stringify(byVar));
