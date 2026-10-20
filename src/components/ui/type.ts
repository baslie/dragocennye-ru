// Типографическая шкала «Ювелирного дома». Классы собраны строками, чтобы кегль и интерлиньяж
// всегда стояли на одном элементе: процент наследуется готовыми пикселями.
// Интерлиньяж обратно кеглю: дисплей 92–98%, названия 28–30px 110%, 18–24px 120%,
// основной текст 155%, мелкий интерфейсный текст 150%.
export const T = {
  /** Главный заголовок вступления на главной. */
  display:
    "font-serif font-light text-balance pb-[0.08em] text-[38px] leading-[98%] tracking-[-0.01em] md:text-[clamp(52px,4vw,96px)] md:leading-[92%]",
  /** H1 внутренних страниц. */
  h1: "font-serif font-light text-balance pb-[0.06em] text-[36px] leading-[100%] tracking-[-0.01em] md:text-[clamp(44px,3.2vw,76px)] md:leading-[95%]",
  /** Заголовок раздела. */
  h2: "font-serif font-light text-balance text-[28px] leading-[110%] md:text-[clamp(32px,2.2vw,48px)] md:leading-[105%]",
  /** Название в карточке. */
  h3: "font-serif text-[19px] leading-[120%] md:text-[clamp(22px,1.5vw,30px)] md:leading-[110%]",
  /** Подзаголовок внутри текста, 18–24px. */
  h4: "font-serif text-[20px] leading-[120%] md:text-[clamp(21px,1.25vw,26px)]",
  /** Мелкая надпись над заголовком. */
  eyebrow: "text-[clamp(11px,0.6vw,14px)] uppercase tracking-[0.14em] text-black/48 leading-[150%]",
  /** Основной текст статьи. */
  body: "text-[clamp(16px,1vw,20px)] leading-[160%]",
  /** Лид под заголовком. */
  lead: "text-[clamp(14px,0.8vw,17px)] leading-[155%] text-black/60",
  /** Интерфейсный текст: метаданные, ссылки, кнопки. */
  ui: "text-[clamp(13px,0.72vw,18px)] leading-[150%]",
  /** Подпись поля, метка фильтра. */
  label: "text-[clamp(12px,0.65vw,16px)] text-black/48 leading-[150%]",
} as const;

/** Тонкая линия-разделитель. */
export const HAIRLINE = "border-black/[0.07]";

/** Сетка карточек камней: 2 → 3 → 4 колонки. Брейкпоинты совпадают с useGridColumns. */
export const STONE_GRID =
  "grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-[clamp(32px,2.2vw,56px)] md:gap-y-16 min-[1024px]:grid-cols-3 min-[1440px]:grid-cols-4";
