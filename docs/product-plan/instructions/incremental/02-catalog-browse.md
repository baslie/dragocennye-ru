# Milestone 2: Catalog Browse

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete

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
