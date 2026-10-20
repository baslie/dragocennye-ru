// Форматтеры и мелкие помощники, общие для всех страниц.
// Разделитель тысяч и пробел перед единицей — неразрывные (U+00A0).

const NBSP = " ";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.round(amount)).replace(/\s/g, NBSP) + NBSP + "₽";
}

/** Вес без лишних нулей: «2,1 ct», «0,85 ct». */
export function formatCt(weightCt: number): string {
  return weightCt.toLocaleString("ru-RU", { maximumFractionDigits: 2 }) + NBSP + "ct";
}

export function formatDate(iso: string): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function plural(n: number, [one, few, many]: [string, string, string]) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

export const pluralStones = (n: number) => `${n}${NBSP}${plural(n, ["камень", "камня", "камней"])}`;

// Камни без снимка пока приходят с общей PNG-иконкой фотоаппарата вместо фото.
export const hasPhoto = (url: string | null | undefined) => Boolean(url) && !url!.endsWith(".png");

/** Инвентарный номер камня — первая часть slug («0101-…» → «0101»). */
export const stoneCode = (slug: string) => slug.split("-")[0];

/** Размеры в русской записи: «8.1x6.2» → «8,1x6,2 мм». */
export const formatMm = (mm: string) => mm.replaceAll(".", ",") + NBSP + "мм";

/** @deprecated Старое имя formatCt — уйдёт вместе со старыми компонентами. */
export const formatWeight = formatCt;
