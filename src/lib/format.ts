// Форматтеры для цен и веса. Разделитель тысяч — неразрывный пробел (U+00A0).

const NBSP = " ";

export function formatPrice(amount: number): string {
  const s = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  return `${s}${NBSP}₽`;
}

export function formatWeight(weightCt: number): string {
  return `${weightCt.toFixed(2).replace(".", ",")}${NBSP}ct`;
}

export function formatDate(iso: string): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
