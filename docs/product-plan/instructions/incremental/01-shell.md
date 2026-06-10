# Milestone 1: Shell

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
