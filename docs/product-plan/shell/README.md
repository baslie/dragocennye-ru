# Application Shell

## Overview

Shell «Драгоценных» — строгая белая поверхность с двумя состояниями шапки: церемониальное
«редакторское» при загрузке и компактное sticky при скролле. Никакой авторизации/профиля, корзины и
избранного — магазин работает без аккаунтов, каждая заявка оформляется по одному конкретному камню.
Единственная утилита справа — поиск. Тема — только светлая, без вариантов.

## Navigation Structure

Три пункта в основной навигации:

- **Каталог** → `/catalog` — главная страница с листингом камней
- **Журнал** (dropdown) → раскрывает:
  - Энциклопедия → `/encyclopedia`
  - Блог → `/blog`
- **О гемологе** → `/about`

«Журнал» объединяет справочный (энциклопедия) и новостной (блог) контент — шапка остаётся воздушной
из трёх верхних пунктов. Дропдаун открывается на hover (desktop) и на click (mobile/touch).

## User Menu

**Нет.** В MVP магазин работает без аккаунтов. Корзины и избранного нет.

## Header Actions

- **🔍 Поиск** (`Search` из lucide-react) — коллбэк `onSearch`, открывает модальное окно поиска по каталогу.

Это единственная иконка справа.

## Layout Pattern — Editorial Top Navigation with Scroll Shrink

**Initial state (hero header)** — виден при загрузке:
- Иконка поиска в правом верхнем углу
- Крупный центрированный wordmark **ДРАГОЦЕННЫЕ** (Noto Sans, `tracking-[0.12em]`, `text-5xl md:text-7xl`, `font-medium`)
- Тонкий подзаголовок **«коллекция цветных камней»** (Noto Sans Mono, uppercase, steel `#576A8F`)
- Горизонтальная навигация по центру под логотипом
- Paddings: `pt-10 md:pt-14 pb-8 md:pb-12`

**Sticky compact state** — появляется при `scrollY > 120`:
- `position: fixed`, высота 64px (`h-16`)
- Слева wordmark (меньше, `text-sm md:text-base`, `tracking-[0.15em]`), по центру три пункта нав, справа иконка поиска
- Фон `bg-white/90 backdrop-blur-md` + `border-b border-stone-200`
- Transition 300ms (`opacity` + `-translate-y-full → translate-y-0`)

Hero-шапка не удаляется — естественно уходит вверх; sticky compact оверлеится поверх контента.

## Container Width

Широкий контейнер `max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20` (прогрессивный padding
24 → 40 → 56 → 80px). Применяется к hero header, sticky compact header и main content. Секции
наследуют те же значения; reading-контент внутри секций оборачивается в `max-w-[72ch] mx-auto`.

## Theme

**Исключительно светлая.** Никаких `dark:` вариантов, theme switcher-ов, CSS-переменных для dark mode.

## Components Provided

- `AppShell` — главная обёртка-лэйаут: hero-шапка + sticky compact + main. Принимает `children` и навигацию.
- `MainNav` — горизонтальная навигация с дропдауном «Журнал». Экспортирует тип `NavItem`.
- `HeaderActions` — правая часть шапки: иконка поиска (`onSearch`).

## Visual Reference

Скриншот shell не приложен — состояние шапки видно в скриншотах секций (`sections/*/screenshot.png`),
которые отрисованы внутри shell.

## Responsive Behavior

- **Desktop (≥1024px):** полная editorial hero-шапка; sticky compact на скролле.
- **Tablet (≥768px):** editorial hero с меньшими отступами.
- **Mobile (<768px):** hero сохраняется, логотип `text-4xl`, подзаголовок скрыт; в sticky compact — логотип слева, `Menu`-иконка открывает меню с пунктами нав и подпунктами «Журнала».
