# Драгоценные — Complete Implementation Instructions

---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---

## Testing

Each section includes a `tests.md` file with UI behavior test specs. These are **framework-agnostic** — adapt them to your testing setup.

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

---

# Драгоценные — Product Overview

## Summary

Интернет-магазин коллекционных драгоценных камней гемолога Дмитрия Салятова: каждый камень — в
единственном экземпляре, с крупными фото, видео и полным паспортом характеристик. Сайт совмещает
визуальную простоту для ценителей и детальные фильтры для профи, коллекционеров и ювелиров.

**Проблемы и решения:**

1. **Из поиска долго добираться до нужного камня** → SEO-структура вокруг запросов вида «зелёный сапфир купить»: они ведут сразу на вид камня с фильтрами или в карточку экземпляра, а не на главную.
2. **Без профессиональной подачи камень сложно оценить** → крупные фото, видео и полный паспорт: вес, размеры, огранка, цвет, происхождение, обработка, сертификат лаборатории.
3. **Непонятно, кому доверять** → страница о гемологе Дмитрии Салятове и блог с его публикациями строят доверие.
4. **Новичкам камни кажутся сложными** → энциклопедия объясняет виды, огранки и характеристики простым языком (плюс SEO по информационным запросам).
5. **Типовые магазины перегружены** → путь от входа до конкретного камня — минимум кликов; никаких длинных блоков, баннеров и слайдеров.

## Planned Sections

1. **Catalog Browse** — главная с галереей видов камней, предфильтрами и листингом категорий с боковыми фильтрами и сеткой карточек.
2. **Stone Detail** — карточка отдельного камня: крупная галерея фото и видео, паспорт характеристик, сертификат, блок похожих камней.
3. **Inquiry** — модалка заявки на один конкретный камень: мини-карточка, поля «Имя / Контакт / Канал связи / Комментарий», обязательное согласие 152-ФЗ, четыре состояния (idle, loading, sent, error). Корзины и онлайн-оплаты нет.
4. **Encyclopedia** — справочные страницы по видам камней со свойствами, огранками и ссылками на актуальные позиции в каталоге; одновременно SEO-посадочные.
5. **Blog & About** — лента публикаций Дмитрия и страница о гемологе с образованием, опытом и подходом к подбору камней.

## Product Entities

- **Stone** — конкретный камень в единственном экземпляре (фото/видео, паспорт, статус наличия). Основная единица продажи.
- **StoneVariety** — вид камня (сапфир, изумруд, турмалин…): категория каталога и справочная статья.
- **Cut** — форма огранки (кушон, груша, овал, октагон, триллион…).
- **Origin** — месторождение и страна происхождения (Мозамбик, Бразилия, Мадагаскар…).
- **Treatment** — способ облагораживания (негретый, нагретый, промасленный…).
- **Certificate** — сертификат лаборатории: название, номер, дата, скан, ссылка на проверку.
- **Inquiry** — заявка клиента: камень(и) + контакты и предпочитаемый канал связи. Без онлайн-оплаты.
- **BlogPost** — публикация блога Дмитрия: новости, разборы камней, заметки с рынка, истории коллекций.
- **EncyclopediaEntry** — справочная статья по виду камня (свойства, история, как выбирать). Связана с StoneVariety один-к-одному.
- **Gemologist** — профиль Дмитрия Салятова: образование, опыт, подход к подбору камней.

**Связи:** Stone → одна StoneVariety, один Cut, один Origin, один Treatment, ноль-или-один Certificate. StoneVariety → один EncyclopediaEntry. Inquiry содержит много Stones. BlogPost ссылается на одну-или-много StoneVariety. Gemologist — автор многих BlogPost.

## Design System

**Colors** (строго белый canvas + 4 кастомных hex-акцента, тема — только светлая):
- Primary (coral): `#FF7444` — Tailwind-приближение `orange-500`
- Secondary / brand (steel): `#576A8F` — `slate-500`
- Accent (periwinkle): `#B7BDF7` — `indigo-200`
- Accent (cream): `#FFF8DE` — `amber-50`
- Neutral: `stone`

**Typography:**
- Heading: Noto Sans
- Body: Noto Sans
- Mono: Noto Sans Mono

**Layout:** широкий контейнер `max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20`; reading-колонки — `max-w-[72ch]`. Полная стратегия — `design-system/` и в инструкции shell.

## Implementation Sequence

1. **Shell** — design tokens + application shell (editorial top-nav со scroll-shrink, без авторизации/корзины).
2. **Catalog Browse** — главная и листинг камней с табами видов и тонкой строкой фильтров.
3. **Stone Detail** — карточка камня с editorial-галереей, паспортом, сертификатом, sticky-sidebar.
4. **Inquiry** — модалка заявки по одному камню (триггерится из Stone Detail).
5. **Encyclopedia** — index видов + entry-страница со справкой и live-блоком из каталога.
6. **Blog & About** — лента, страница поста, страница о гемологе.

Каждый milestone имеет отдельный документ в `instructions/incremental/`.


---

# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## Goal

Set up the design tokens and application shell — the persistent chrome that wraps all sections.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Ключевое:**
- Строго белый canvas `#FFFFFF`, тема **только светлая** — никаких `dark:` вариантов.
- 4 кастомных hex-акцента: `#FF7444` coral (CTA), `#576A8F` steel (brand/цена), `#B7BDF7` periwinkle, `#FFF8DE` cream.
- Шрифты: **Noto Sans** (заголовки + body), **Noto Sans Mono** (мета/технические подписи).
- Tailwind CSS v4 — без `tailwind.config.js`.
- Установите `lucide-react` (иконки используются в shell и секциях).

### 2. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — главная обёртка-лэйаут (hero header + sticky compact на скролле + main content). Принимает `children`.
- `MainNav.tsx` — горизонтальная навигация с дропдауном «Журнал». Экспортирует тип `NavItem`.
- `HeaderActions.tsx` — правая часть шапки: иконка поиска (`onSearch`).

Компоненты самодостаточны: импортируют только `react` и `lucide-react`.

**Wire Up Navigation:**

Подключите навигацию к роутингу:

- **Каталог** → `/catalog`
- **Журнал** (dropdown):
  - Энциклопедия → `/encyclopedia`
  - Блог → `/blog`
- **О гемологе** → `/about`

**Header Actions:**

- Иконка **🔍 Поиск** (`Search` из lucide-react) → коллбэк `onSearch`, открывает модальное окно поиска по каталогу. Это единственная утилита справа — никакого user menu, корзины или избранного.

**Layout / scroll-shrink:**

- Hero-шапка при загрузке: крупный центрированный wordmark **ДРАГОЦЕННЫЕ** + mono-подзаголовок «коллекция цветных камней» + навигация по центру.
- При `scrollY > 120` поверх контента появляется sticky compact header (`h-16`, `bg-white/90 backdrop-blur-md`, `border-b border-stone-200`), transition 300ms.
- Контейнер: `max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20`.

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens configured (4 hex-акцента, Noto Sans/Mono, светлая тема)
- [ ] Shell renders with hero header and sticky compact on scroll
- [ ] Navigation links to correct routes (`/catalog`, `/encyclopedia`, `/blog`, `/about`)
- [ ] «Журнал» dropdown opens (hover desktop / click mobile) with Энциклопедия + Блог
- [ ] Search icon fires `onSearch`
- [ ] No user menu / cart / wishlist
- [ ] Responsive: hero on desktop/tablet, compact mobile header with `Menu` icon


---

# Milestone 2: Catalog Browse

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

---

## Goal

Implement the **Catalog Browse** feature — главная страница магазина: живой листинг коллекционных
камней с визуальной навигацией по видам и быстрыми фильтрами, без сайдбаров и лишнего скролла.
Одновременно SEO-посадочная для запросов «[цвет] [вид] купить».

## Overview

Пользователь видит сетку всех камней с горизонтальной лентой табов по видам сверху и тонкой строкой
фильтров и сортировки под ними. Выбор вида и фильтров применяется live, меняет URL и SEO-описание,
сетка перерисовывается мгновенно. Карточки — визуальный минимум: фото, название, цена. Клик по
карточке ведёт на Stone Detail.

**Key Functionality:**
- Лента табов видов камней (первый — «Все») с превью и счётчиком позиций; активный — steel, hover — coral.
- Тонкая строка чипов-дропдаунов: Цвет, Огранка, Вес, Цена, Происхождение, Обработка, Сертификат + дропдаун сортировки и счётчик найденных.
- SEO-блок (H1 вида + 1–2 абзаца) появляется при выборе конкретного вида.
- Сетка карточек `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`; hover — подъём + цена в coral.
- Пагинация (12 камней на страницу) с плавным скроллом к началу сетки.
- Empty state при пустой выборке с кнопкой «Сбросить фильтры».

## Components Provided

Copy from `product-plan/sections/catalog-browse/components/`:

- `CatalogBrowse` — корневой компонент секции (собирает всё ниже).
- `VarietyTabs` — лента табов видов камней.
- `FilterBar` — тонкая строка чипов-фильтров + сортировка + счётчик.
- `SeoBlock` — H1 вида и описание (виден при выбранном виде).
- `StoneCard` — карточка камня (фото 4:5, название, цена).
- `Pagination` — постраничная навигация.
- `EmptyState` — состояние пустой выборки.

## Props Reference

Полные определения — `types.ts`. Корневой `CatalogBrowseProps`:

**Data props:** `varieties: StoneVariety[]`, `cuts: Cut[]`, `origins: Origin[]`, `treatments: Treatment[]`, `colors: Color[]`, `certificates: Certificate[]`, `stones: Stone[]`, `filters: CatalogFilters`, `sort: SortOption`, `page: number`, `pageSize: number`.

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onSelectVariety(varietyId \| null)` | Клик по табу вида или «Все» |
| `onFilterChange(filters)` | Изменение любого чипа фильтра |
| `onSortChange(sort)` | Смена сортировки в дропдауне |
| `onPageChange(page)` | Смена страницы в пагинаторе |
| `onStoneClick(stoneId)` | Клик по карточке камня → Stone Detail |
| `onResetFilters()` | Кнопка «Сбросить фильтры» в empty state |

Родитель — источник истины: фильтры/сортировка/страница приходят как props, компонент только
сообщает об изменениях. URL-синхронизация — на стороне реализации (`/catalog/[variety]/[color]`, `?page=N`).

## Expected User Flows

### Flow 1: Фильтрация по виду и цвету
1. Пользователь на `/catalog` видит сетку всех камней (таб «Все» активен).
2. Кликает таб «Сапфир» → `onSelectVariety('sapphire')`; URL → `/catalog/sapfir`, появляется SeoBlock «Сапфиры».
3. Открывает чип «Цвет», выбирает «Зелёный» → `onFilterChange(...)`; URL → `/catalog/sapfir/zelyonyy`.
4. **Outcome:** сетка мгновенно фильтруется, счётчик найденных обновляется, SEO-описание подстраивается.

### Flow 2: Сортировка и пагинация
1. Пользователь меняет сортировку (Новые → Цена ↑) → `onSortChange('price-asc')`, сетка перестраивается.
2. Нажимает «2» в пагинаторе → `onPageChange(2)`.
3. **Outcome:** подгружаются следующие 12 камней, страница плавно скроллится к началу сетки.

### Flow 3: Переход к камню
1. Пользователь кликает карточку камня → `onStoneClick(stoneId)`.
2. **Outcome:** переход на Stone Detail по slug камня.

## Empty States

- **Пустая выборка по фильтрам:** вместо сетки — центрированный блок «Камней по вашему запросу не нашлось» + кнопка «Сбросить фильтры» (coral) → `onResetFilters()`.
- **Первое посещение:** таб «Все» активен, показаны все камни — обычное наполненное состояние.

## Testing

См. `product-plan/sections/catalog-browse/tests.md`.

## Files to Reference

- `product-plan/sections/catalog-browse/README.md`
- `product-plan/sections/catalog-browse/tests.md`
- `product-plan/sections/catalog-browse/components/`
- `product-plan/sections/catalog-browse/types.ts`
- `product-plan/sections/catalog-browse/sample-data.json`
- `product-plan/sections/catalog-browse/screenshot.png`

## Done When

- [ ] Сетка рендерится с реальными данными, табы видов работают
- [ ] Фильтры и сортировка применяются live, счётчик обновляется
- [ ] URL и SEO-блок синхронизированы с выбранным видом/цветом
- [ ] Пагинация листает по 12 камней со скроллом к началу
- [ ] Клик по карточке ведёт на Stone Detail
- [ ] Empty state с «Сбросить фильтры» работает
- [ ] Responsive: 2 колонки mobile, табы горизонтальный scroll, фильтры в bottom-sheet


---

# Milestone 3: Stone Detail

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete; Milestone 2 (Catalog Browse) recommended (общий StoneCard-язык)

---

## Goal

Implement the **Stone Detail** feature — карточка отдельного камня: editorial-галерея крупных фото и
видео, оценка гемолога, полный паспорт характеристик, сертификат и подборка похожих камней. Цель —
дать ценителю всё, чтобы рассмотреть экземпляр и одним кликом оставить заявку.

## Overview

Двухколоночный hybrid-layout (`lg:grid-cols-[1fr_440px]`): слева editorial-контент (галерея стеком,
блок «От гемолога», паспорт, сертификат), справа sticky-sidebar с ценой, CTA «Оставить заявку» и тремя
быстрыми контактами. Под grid — блок похожих камней того же вида. Поддержано sold-состояние.

**Key Functionality:**
- Breadcrumb + крупный H1 + mono-метаподпись с ключевыми параметрами.
- Editorial media stack: 3–5 крупных фото/видео без миниатюр; клик открывает полноэкранный lightbox со стрелками, свайпом и зумом.
- Блок «От гемолога» (1–3 абзаца) и паспорт характеристик (вес, размеры, огранка, цвет, происхождение, обработка, чистота, блеск, твёрдость, показатель преломления).
- Блок сертификата (cream-карточка) с кнопками «Посмотреть скан» и «Проверить на сайте лаборатории»; скрыт если сертификата нет.
- Sticky-sidebar: цена (steel), CTA «Оставить заявку» (coral), три быстрых контакта (Telegram / WhatsApp / телефон).
- Sold state: стемп «Продан» на первом медиа, перечёркнутая цена, CTA → «Смотреть другие [вид]».
- Блок похожих камней (4–5 карточек того же StoneVariety); скрыт если пуст.

## Components Provided

Copy from `product-plan/sections/stone-detail/components/`:

- `StoneDetail` — корневой компонент секции.
- `Breadcrumb` — тонкая mono-строка над grid.
- `StoneMediaStack` — стек фото/видео в левой колонке.
- `Lightbox` — полноэкранный просмотр медиа.
- `SpecSheet` — паспорт характеристик.
- `CertificateCard` — блок сертификата (cream).
- `PriceSidebar` — sticky-sidebar с ценой, CTA и контактами (триггерит Inquiry).
- `SimilarStonesBlock` — подборка похожих камней.

## Props Reference

Полные определения — `types.ts`. Корневой `StoneDetailProps`:

**Data props:** `stone: StoneDetail`, `variety: StoneVariety`, `cut: Cut`, `origin: Origin`, `treatment: Treatment`, `color: Color`, `certificate: StoneCertificate | null`, `similarStones: SimilarStoneCard[]`, `contactChannels: ContactChannel[]`.

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onInquire(stoneId)` | Клик по primary CTA «Оставить заявку» → открыть модалку Inquiry |
| `onSelectSimilar(stoneId)` | Клик по карточке похожего камня |
| `onOpenMedia(mediaId)` | Клик по медиа → открыть lightbox на нём |
| `onBreadcrumbClick(varietyId)` | Клик по сегменту вида в breadcrumb или sold-CTA «Смотреть другие» |
| `onOpenCertificateScan(certificateId)` | Кнопка «Посмотреть скан» |
| `onVerifyCertificate(certificateId)` | Кнопка «Проверить на сайте лаборатории» |

## Expected User Flows

### Flow 1: Осмотр и заявка
1. Пользователь попадает на `/stones/[slug]`, видит breadcrumb, H1, метаподпись.
2. Скроллит галерею, кликает медиа → `onOpenMedia` открывает lightbox (стрелки/свайп/зум, Escape закрывает).
3. Читает «От гемолога», паспорт, раскрывает сертификат.
4. Нажимает «Оставить заявку» → `onInquire(stoneId)`.
5. **Outcome:** открывается модалка Inquiry (Milestone 4) по этому камню.

### Flow 2: Сертификат
1. Пользователь в блоке сертификата нажимает «Посмотреть скан» → `onOpenCertificateScan` (PDF в новой вкладке).
2. Или «Проверить на сайте лаборатории» → `onVerifyCertificate` (внешняя ссылка).
3. **Outcome:** открывается соответствующий ресурс. Если `certificate === null` — блок скрыт.

### Flow 3: Sold-камень
1. Пользователь открывает камень с `isAvailable === false`.
2. **Outcome:** на первом медиа — стемп «Продан», цена перечёркнута, CTA заменён на «Смотреть другие [вид]» → `onBreadcrumbClick(varietyId)`; быстрые контакты остаются активными.

### Flow 4: Похожие камни
1. Пользователь скроллит ниже grid, видит «Похожие [вид]».
2. Кликает карточку → `onSelectSimilar(stoneId)`.
3. **Outcome:** переход на detail выбранного камня. Если `similarStones` пуст — блок скрыт.

## Empty States

- **Нет сертификата** (`certificate === null`): блок сертификата полностью скрыт.
- **Нет похожих камней** (`similarStones` пуст): блок «Похожие» скрыт.
- **Sold** (`isAvailable === false`): стемп + перечёркнутая цена + заменённый CTA.

## Testing

См. `product-plan/sections/stone-detail/tests.md`.

## Files to Reference

- `product-plan/sections/stone-detail/README.md`
- `product-plan/sections/stone-detail/tests.md`
- `product-plan/sections/stone-detail/components/`
- `product-plan/sections/stone-detail/types.ts`
- `product-plan/sections/stone-detail/sample-data.json`
- `product-plan/sections/stone-detail/screenshot.png`

## Done When

- [ ] Двухколоночный layout с sticky-sidebar (одна колонка на mobile в правильном порядке)
- [ ] Media stack + lightbox (стрелки, свайп, зум, Escape) работают
- [ ] Паспорт характеристик и блок «От гемолога» рендерятся
- [ ] Сертификат скрывается при `null`, кнопки скана/верификации работают
- [ ] CTA «Оставить заявку» вызывает `onInquire`
- [ ] Sold state: стемп, перечёркнутая цена, заменённый CTA
- [ ] Блок похожих камней (скрыт если пуст), клик ведёт на detail
- [ ] Responsive на mobile


---

# Milestone 4: Inquiry

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) + Milestone 3 (Stone Detail) — модалка триггерится из `PriceSidebar` Stone Detail

---

## Goal

Implement the **Inquiry** feature — модальное окно одно-камневой заявки: клиент оставляет имя, контакт,
выбирает удобный канал связи и опционально комментарий. Никакой корзины и онлайн-оплаты — цель связать
ценителя с гемологом Дмитрием в один клик, без регистрации.

## Overview

Модалка оверлеится поверх Stone Detail. Содержит mini-карточку камня, поля «Имя / Контакт / Канал связи
/ Комментарий» и обязательный чекбокс согласия 152-ФЗ. Покрывает **четыре состояния**: `idle` (форма),
`loading` (отправка), `sent` (успех), `error` (валидация или сетевой сбой). Родитель — источник истины
для значений и состояния.

**Key Functionality:**
- Backdrop + центрированный диалог (на mobile — bottom sheet), focus-trap, Escape/клик-вне закрывают (кроме `loading`).
- Mini-карточка камня (cream): фото 80×80, название с весом и огранкой, цена (steel).
- Поля: Имя, Контакт (с хинтом), Канал связи (3 radio-чипа Telegram/WhatsApp/Телефон), Комментарий (опционально).
- Чекбокс 152-ФЗ со ссылкой на политику; CTA disabled пока не проставлено согласие.
- `loading`: поля disabled, спиннер + «Отправляем…».
- `sent`: success-блок (галочка, «Спасибо!», текст с выбранным каналом, кнопка «Закрыть»); header и mini-карточка остаются.
- `error`: `fieldErrors` → красные бордеры и подписи; `errorMessage` → баннер над формой; форма остаётся заполненной.

## Components Provided

Copy from `product-plan/sections/inquiry/components/`:

- `InquiryModal` — корневой компонент (управляет состояниями, overlay, focus-trap).
- `InquiryDialog` — диалоговая коробка (header + body + footer).
- `StoneMiniCard` — мини-карточка камня (cream).
- `ChannelChipGroup` — группа из трёх radio-чипов канала связи.
- `ConsentCheckbox` — кастомный чекбокс согласия 152-ФЗ.
- `SentBlock` — success-блок при `state === 'sent'`.

## Props Reference

Полные определения — `types.ts`. Корневой `InquiryModalProps`:

**Data props:** `isOpen: boolean`, `stone: InquiryStoneMini`, `channels: InquiryChannel[]`, `values: InquiryFormValues`, `state: InquiryState`, `fieldErrors?: InquiryFieldErrors`, `errorMessage?: string`, `successMessage: string`, `consent: InquiryConsent`.

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onChange(values)` | Изменение любого поля формы (родитель хранит snapshot) |
| `onSubmit(values)` | Сабмит формы (CTA «Отправить заявку») |
| `onClose()` | Крестик, Escape, клик по backdrop, кнопка «Закрыть» в sent-state |

Родитель: при `onInquire` из Stone Detail разрешает камень в `InquiryStoneMini`, монтирует модалку с
`state: 'idle'`, ведёт значения через `onChange`, на `onSubmit` переключает `state` в `loading` →
`sent` / `error`.

## Expected User Flows

### Flow 1: Успешная заявка
1. Из Stone Detail срабатывает `onInquire(stoneId)` → модалка открывается (`state: 'idle'`, автофокус на «Имя»).
2. Клиент вводит имя, контакт, выбирает radio-чип канала, проставляет согласие → CTA активируется.
3. Жмёт «Отправить заявку» → `onSubmit(values)`, родитель → `state: 'loading'` (поля disabled, «Отправляем…»).
4. Успех → `state: 'sent'`: success-блок «Спасибо!» с текстом про выбранный канал.
5. **Outcome:** клиент жмёт «Закрыть» → `onClose()`, фокус возвращается на CTA в Stone Detail.

### Flow 2: Ошибка валидации
1. Клиент отправляет с пустым обязательным полем.
2. Родитель передаёт `fieldErrors` и `state: 'error'`.
3. **Outcome:** поля с ошибкой — красный бордер и подпись; форма заполнена, CTA активен, клиент правит и шлёт заново.

### Flow 3: Сетевая ошибка
1. Сабмит падает по сети.
2. Родитель передаёт `errorMessage` и `state: 'error'` без `fieldErrors`.
3. **Outcome:** баннер `AlertCircle` над формой, поля заполнены, CTA снова активен.

## Empty / Disabled States

- **Согласие не проставлено:** CTA disabled (`bg-stone-300`, курсор not-allowed).
- **`state === 'loading'`:** все поля и чекбокс disabled, backdrop/Escape не закрывают модалку.
- **`isOpen === false`:** компонент ничего не рендерит.

## Testing

См. `product-plan/sections/inquiry/tests.md`.

## Files to Reference

- `product-plan/sections/inquiry/README.md`
- `product-plan/sections/inquiry/tests.md`
- `product-plan/sections/inquiry/components/`
- `product-plan/sections/inquiry/types.ts`
- `product-plan/sections/inquiry/sample-data.json`
- `product-plan/sections/inquiry/screenshot.png`

## Done When

- [ ] Четыре состояния (idle / loading / sent / error) переключаются корректно
- [ ] Mini-карточка камня, все поля и radio-чипы рендерятся
- [ ] Чекбокс 152-ФЗ блокирует CTA до согласия
- [ ] `loading`: поля disabled, спиннер, backdrop/Escape не закрывают
- [ ] `sent`: success-блок с выбранным каналом; «Закрыть» вызывает `onClose`
- [ ] `error`: fieldErrors (красные бордеры) и errorMessage (баннер) работают
- [ ] Focus-trap, автофокус, возврат фокуса на триггер; Escape/backdrop/крестик закрывают
- [ ] Responsive: bottom sheet на mobile (< 640px)
- [ ] Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, aria для ошибок


---

# Milestone 5: Encyclopedia

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell); Milestones 2–3 recommended (общий StoneCard-язык live-блока)

---

## Goal

Implement the **Encyclopedia** feature — редакторская справка по видам коллекционных камней: editorial-index
со всеми видами и долгое читаемое повествование про каждый вид (свойства, история, огранки, советы) с
live-блоком актуальных позиций из каталога. Одновременно SEO-посадочные и trust-строитель для новичков.

## Overview

Две страницы. **Index** (`/encyclopedia`): hero + editorial-grid из карточек видов. **Entry**
(`/encyclopedia/[slug]`): широкий hero, H1 + mono-подпись, двухколоночный layout (reading column + sticky
TOC), четыре раздела статьи с паспортом свойств, блок постов блога о виде и live-блок «Сейчас в коллекции».

**Key Functionality:**
- Index: hero-интро + grid карточек видов (обложка 4:3, teaser, мета-счётчик «N камней в коллекции», «Читать →»).
- Мета-счётчик в карточке — отдельный кликабельный мост в каталог (`stopPropagation`).
- Entry: breadcrumb, immersive hero, H1 + mono-подпись параметров.
- Reading column: 4 раздела (`intro`, `history`, `colors`, `choose`) + паспорт свойств (6 полей) в разделе intro.
- Sticky TOC (только lg+) с подсветкой активного раздела и плавным скроллом.
- Блок «Дмитрий пишет о [виде]»: 2–3 карточки постов (скрыт если пуст).
- Live-блок «Сейчас в коллекции»: до 5 StoneCard + CTA «Все [вид] в каталоге (N)»; либо cream empty-state с «Написать в Telegram».

## Components Provided

Copy from `product-plan/sections/encyclopedia/components/`:

- `EncyclopediaIndex` — корневой компонент index-страницы.
- `VarietyCard` — карточка вида камня в editorial-grid.

> **Примечание:** в текущем дизайне реализована и экспортируется страница **Index** (`EncyclopediaIndex`)
> с `EncyclopediaIndexProps`. Спецификация и типы (`EncyclopediaEntryProps`) также описывают **Entry**-страницу
> (reading column + TOC + live-блок). Entry-страница задана типами и спекой, но отдельные компоненты под неё
> в этом пакете не сгенерированы — реализуйте её по `types.ts` + README + спеке (раздел View 2).

## Props Reference

Полные определения — `types.ts`.

**`EncyclopediaIndexProps`** (Index):
- Data: `varieties: StoneVariety[]`

| Callback | Triggered When |
|----------|---------------|
| `onSelectVariety(varietyId)` | Клик по карточке вида → `/encyclopedia/[slug]` |
| `onBrowseInCatalog(varietyId)` | Клик по счётчику «N камней в коллекции» → `/catalog/[slug]` |

**`EncyclopediaEntryProps`** (Entry — реализовать по типам):
- Data: `variety: StoneVariety`, `entry: EncyclopediaEntry`, `stonesInStock: LiveStoneCard[]`, `relatedPosts: BlogPostCard[]`

| Callback | Triggered When |
|----------|---------------|
| `onBackToIndex()` | Клик по breadcrumb «Энциклопедия» |
| `onScrollToSection(sectionId)` | Клик по пункту TOC → плавный скролл к H2 |
| `onViewStone(stoneId)` | Клик по карточке камня в live-блоке |
| `onBrowseInCatalog(varietyId)` | CTA «Все [plural] в каталоге» |
| `onViewPost(postId)` | Клик по карточке поста блога |
| `onContactForCustom(varietyId)` | «Написать в Telegram» в empty-state live-блока |

## Expected User Flows

### Flow 1: Index → статья
1. Пользователь на `/encyclopedia` видит hero и grid видов.
2. Кликает карточку «Сапфир» → `onSelectVariety` → `/encyclopedia/sapfir`.
3. **Outcome:** открывается entry-страница вида.

### Flow 2: Мост в каталог из справочника
1. На карточке вида пользователь кликает «52 камня в коллекции» → `onBrowseInCatalog(varietyId)` (с `stopPropagation`, не триггерит переход на статью).
2. **Outcome:** переход в `/catalog/[slug]`.

### Flow 3: Чтение статьи и live-блок
1. На entry пользователь читает разделы; TOC справа подсвечивает активный, клик по пункту → `onScrollToSection`.
2. Внизу live-блок «Сейчас в коллекции» — кликает StoneCard → `onViewStone`, или CTA → `onBrowseInCatalog`.
3. **Outcome:** переход на Stone Detail или в каталог.

## Empty States

- **Нет камней вида** (`stonesInStock.length === 0`): вместо сетки и CTA — cream empty-state «Сейчас этого камня нет в коллекции…» + кнопка «Написать в Telegram» → `onContactForCustom(varietyId)`.
- **Нет связанных постов** (`relatedPosts` пуст): блок «Дмитрий пишет о…» скрыт.

## Testing

См. `product-plan/sections/encyclopedia/tests.md`.

## Files to Reference

- `product-plan/sections/encyclopedia/README.md`
- `product-plan/sections/encyclopedia/tests.md`
- `product-plan/sections/encyclopedia/components/`
- `product-plan/sections/encyclopedia/types.ts`
- `product-plan/sections/encyclopedia/sample-data.json`
- `product-plan/sections/encyclopedia/screenshot.png`

## Done When

- [ ] Index: hero + grid карточек видов рендерятся
- [ ] Клик по карточке → `onSelectVariety`; клик по счётчику → `onBrowseInCatalog` (без перехода на статью)
- [ ] Entry реализована по типам: breadcrumb, hero, H1 + mono-подпись, 4 раздела, паспорт свойств
- [ ] Sticky TOC (lg+) с активным разделом и плавным скроллом
- [ ] Блок постов блога (скрыт если пуст)
- [ ] Live-блок: до 5 StoneCard + CTA, либо empty-state с «Написать в Telegram»
- [ ] Responsive: 1/2/3 колонки grid; на mobile TOC не рендерится


---

# Milestone 6: Blog & About

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell); Milestones 2–3 recommended (общий StoneCard-язык live-блока)

---

## Goal

Implement the **Blog & About** feature — редакторско-доверительный блок: лента публикаций Дмитрия
(`/blog`), страница отдельного поста (`/blog/[slug]`) с long-read-вёрсткой и live-блоком упомянутых
камней, и страница о гемологе (`/about`). Секция строит доверие и связывает редакторский контент с
актуальным каталогом.

## Overview

Три экрана. **Blog feed:** hero + фильтр-чипы по виду камня + immersive featured-пост + editorial-grid.
**Blog post:** breadcrumb + immersive hero + reading column (блоки paragraph/heading/quote/image) +
author byline + live-блок камней + «Читать дальше». **About:** hero с портретом и стат-чипами +
таймлайн «Образование и опыт» + «Подход к подбору» + «Из журнала» + финальный CTA-блок с контактами.

**Key Functionality:**
- Feed: фильтр по виду (чипы), featured immersive-hero (только при фильтре «Все»), grid карточек, empty-state.
- Post: immersive-hero с метой/H1 поверх обложки, lead-абзац, тело из блоков, цитаты (cream), изображения.
- Author byline со ссылкой «О гемологе →».
- Live-блок «Камни из этой статьи» (до 5 StoneCard + CTA), скрыт если пуст.
- «Читать дальше» (2–3 карточки), скрыт если пуст.
- About: hero (портрет + интро + стат-чипы), таймлайн, проза подхода, «Из журнала», CTA с Telegram/WhatsApp/телефон.

## Components Provided

Copy from `product-plan/sections/blog-and-about/components/`:

- `BlogFeed` — корневой компонент ленты (`/blog`).
- `BlogPost` — корневой компонент поста (`/blog/[slug]`).
- `About` — корневой компонент страницы о гемологе (`/about`).
- `VarietyFilter` — строка фильтр-чипов по виду камня.
- `FeaturedPost` — крупная immersive-карточка featured-поста.
- `PostCard` — editorial-карточка поста (обложка 4:3 + мета + заголовок).
- `PostBody` — рендер тела поста из блоков (paragraph / heading / quote / image).
- `AuthorByline` — подпись автора в конце поста.
- `MentionedStones` — live-блок «Камни из этой статьи».
- `BlogStoneCard` — карточка камня для live-блока.
- `Timeline` — таймлайн «Образование и опыт» на About.
- `format.ts` — общие стили обложек (`coverStyle`, `heroCoverStyle`, `portraitStyle`, `hideBrokenImage`, `monoFont`, `sansFont`, форматтеры). **Не удаляйте** — от него зависят остальные компоненты секции.

## Props Reference

Полные определения — `types.ts`.

**`BlogFeedProps`** (`/blog`):
- Data: `posts: BlogPostCard[]`, `topics: Topic[]`, `activeTopicId: string | null`

| Callback | Triggered When |
|----------|---------------|
| `onFilterByVariety(varietyId \| null)` | Клик по чипу фильтра (null — сброс на «Все») |
| `onViewPost(postId)` | Клик по карточке поста (featured или из сетки) |

**`BlogPostProps`** (`/blog/[slug]`):
- Data: `post: BlogPost`, `author: Author`, `relatedPosts: BlogPostCard[]`

| Callback | Triggered When |
|----------|---------------|
| `onBackToFeed()` | Клик по breadcrumb «Журнал» |
| `onBrowseInCatalog(varietyId)` | Клик по ярлыку вида в мете или CTA live-блока |
| `onViewStone(stoneId)` | Клик по карточке камня в live-блоке |
| `onViewPost(postId)` | Клик по карточке похожего поста |
| `onViewAbout()` | Ссылка «О гемологе →» в author byline |

**`AboutProps`** (`/about`):
- Data: `gemologist: Gemologist`, `recentPosts: BlogPostCard[]`

| Callback | Triggered When |
|----------|---------------|
| `onViewPost(postId)` | Клик по карточке поста в «Из журнала» |
| `onViewFeed()` | Ссылка «Все публикации →» |
| `onContact(channel)` | Контактная кнопка в CTA-блоке (Telegram / WhatsApp / телефон) |

## Expected User Flows

### Flow 1: Лента → пост
1. Пользователь на `/blog` видит hero, фильтр-чипы, featured-пост и grid.
2. Кликает чип «Сапфир» → `onFilterByVariety('sapphire')` (featured скрывается, посты единой сеткой).
3. Кликает карточку поста → `onViewPost(postId)`.
4. **Outcome:** переход на `/blog/[slug]`.

### Flow 2: Чтение поста
1. На посте пользователь читает тело (lead + блоки), доходит до author byline.
2. В live-блоке «Камни из этой статьи» кликает StoneCard → `onViewStone`, или CTA → `onBrowseInCatalog`.
3. Кликает «О гемологе →» → `onViewAbout()`, либо карточку в «Читать дальше» → `onViewPost`.
4. **Outcome:** соответствующий переход. Live-блок и «Читать дальше» скрыты, если данных нет.

### Flow 3: About → контакт
1. Пользователь на `/about` читает интро, статы, таймлайн, подход, «Из журнала».
2. В финальном CTA-блоке нажимает «Telegram» → `onContact('telegram')`.
3. **Outcome:** открывается выбранный канал связи.

## Empty States

- **Пустой фильтр ленты:** cream empty-state «Пока нет публикаций об этом камне» + «Сбросить фильтр» → `onFilterByVariety(null)`.
- **Нет упомянутых камней** (`mentionedStones` пуст): live-блок поста скрыт.
- **Нет похожих постов** (`relatedPosts` пуст): «Читать дальше» скрыт.
- **Обложки-плейсхолдеры:** реальное фото ложится поверх jewel-градиента через `<img onError>`; при 404 остаётся градиент (см. `format.ts`).

## Testing

См. `product-plan/sections/blog-and-about/tests.md`.

## Files to Reference

- `product-plan/sections/blog-and-about/README.md`
- `product-plan/sections/blog-and-about/tests.md`
- `product-plan/sections/blog-and-about/components/`
- `product-plan/sections/blog-and-about/types.ts`
- `product-plan/sections/blog-and-about/sample-data.json`
- `product-plan/sections/blog-and-about/screenshot.png` (+ `screenshot-feed/post/about.png`)

## Done When

- [ ] Feed: hero, фильтр-чипы, featured immersive-hero (при «Все»), grid карточек, empty-state
- [ ] Post: immersive-hero с метой/H1 поверх обложки, lead, тело из блоков, цитаты (cream), изображения
- [ ] Author byline со ссылкой «О гемологе →»
- [ ] Live-блок камней (скрыт если пуст), «Читать дальше» (скрыт если пуст)
- [ ] About: hero с портретом и стат-чипами, таймлайн, подход, «Из журнала», CTA-блок
- [ ] Все коллбэки навигации и `onContact` подключены
- [ ] Responsive на mobile (immersive-hero, reading column, grid)


---

