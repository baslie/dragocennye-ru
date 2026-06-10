import type { BlogPostCard } from './types'

/** Шрифтовые токены секции — Noto Sans для текста, Noto Sans Mono для мета/подписей. */
export const sansFont = { fontFamily: "'Noto Sans', sans-serif" } as const
export const monoFont = { fontFamily: "'Noto Sans Mono', ui-monospace, monospace" } as const

// ============================================================================
// Обложки-плейсхолдеры
// ----------------------------------------------------------------------------
// Реальных фото нет (public/ пуст) — обложки рисуются насыщенным нейтральным
// «самоцветом» из radial-gradient + граней + зерна (язык StoneCard каталога).
// Реальное фото ляжет поверх через <img onError={hideBrokenImage}>.
// ============================================================================

const FACETS =
  'linear-gradient(115deg, transparent 46%, rgba(255,255,255,0.5) 50%, transparent 54%), linear-gradient(62deg, transparent 47%, rgba(255,255,255,0.28) 50%, transparent 53%)'

const GRAIN =
  'radial-gradient(circle at 12% 18%, rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(circle at 62% 72%, rgba(0,0,0,0.05) 1px, transparent 1px)'

/** Обычная обложка (PostCard, image-блоки): мягкий нейтральный jewel-градиент без граней. */
export const coverStyle = {
  backgroundImage: `
    ${GRAIN},
    radial-gradient(ellipse 78% 64% at 38% 36%, #9AA4C6 0%, #7782AE 32%, #B7BDF7 60%, transparent 84%),
    radial-gradient(circle at 72% 78%, #C8CEE4 0%, transparent 46%),
    linear-gradient(155deg, #EEF0F6 0%, #DADEEC 55%, #C8CEE4 100%)
  `,
} as const

/** Immersive hero (featured, шапка поста): ещё глубже — под белый overlay-текст. */
export const heroCoverStyle = {
  backgroundImage: `
    ${GRAIN},
    ${FACETS},
    radial-gradient(ellipse 70% 64% at 50% 38%, #6E7BA6 0%, #576A8F 32%, #3F4E72 62%, transparent 82%),
    radial-gradient(circle at 28% 22%, rgba(255,255,255,0.4) 0%, transparent 26%),
    linear-gradient(155deg, #5C6B8E 0%, #45527A 50%, #313D5E 100%)
  `,
} as const

/** Портрет (about hero, author byline): тёплый steel/periwinkle jewel-градиент. */
export const portraitStyle = {
  backgroundImage: `
    radial-gradient(ellipse 70% 66% at 50% 36%, #9AA4C6 0%, #6E7BA6 34%, #576A8F 64%, transparent 84%),
    radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5) 0%, transparent 26%),
    linear-gradient(155deg, #E7E9F1 0%, #CFD5E6 55%, #B9C0DC 100%)
  `,
} as const

/** Тёмная вуаль снизу — обеспечивает читаемость белого overlay-текста поверх обложки. */
export const OVERLAY_VEIL =
  'pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent'

const RU_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

/** ISO-дата «2026-05-28» → «28 мая 2026». Без таймзонных сдвигов — парсим компоненты вручную. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  return `${day} ${RU_MONTHS[month - 1]} ${year}`
}

/** Минуты чтения → «8 мин». */
export function formatReadingTime(minutes: number): string {
  return `${minutes} мин`
}

/** Цена в рублях с разрядами по-русски → «248 000 ₽». */
export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`
}

/** Вес камня → «2.47 ct» (точка-разделитель — по спеке live-блока). */
export function formatWeight(carats: number): string {
  return `${carats.toFixed(2)} ct`
}

/** Мета-строка карточки поста → «28 мая 2026 · 8 мин · Сапфир». */
export function formatPostMeta(post: BlogPostCard): string {
  return `${formatDate(post.publishedAt)} · ${formatReadingTime(post.readingMinutes)} · ${post.varietyLabel}`
}

/** Скрывает <img> при 404 — под ним остаётся градиентная подложка. */
export function hideBrokenImage(
  event: React.SyntheticEvent<HTMLImageElement>,
): void {
  event.currentTarget.style.display = 'none'
}
