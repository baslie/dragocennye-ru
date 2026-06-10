# Encyclopedia

## Overview

Редакторская справка по видам коллекционных камней Дмитрия Салятова. Две страницы: editorial-index со
всеми видами (вход через shell-dropdown «Журнал») и долгое читаемое повествование про каждый вид —
свойства, история, огранки, советы по выбору — с live-блоком из актуального каталога. Одновременно
SEO-посадочные по запросам «свойства [камня]» / «что такое [камень]» и trust-строитель для новичков.

## User Flows

### Index (`/encyclopedia`)
- Hero «Энциклопедия камней» + вводный текст; editorial-grid из карточек видов (обложка 4:3, teaser, счётчик «N камней в коллекции», «Читать →»).
- Клик по карточке → `/encyclopedia/[slug]`. Клик по счётчику → `/catalog/[slug]` (мост в каталог, `stopPropagation`).

### Entry (`/encyclopedia/[slug]`)
- Breadcrumb «Энциклопедия / [Вид]», широкий hero, H1 + mono-подпись параметров.
- Двухколоночный layout: reading column (4 раздела + паспорт свойств) + sticky TOC (lg+).
- Блок «Дмитрий пишет о [виде]» (2–3 поста). Live-блок «Сейчас в коллекции» (до 5 StoneCard + CTA) или empty-state.

## Design Decisions

- **Index + Entry — два паттерна в одной секции:** editorial-grid (паттерн A) для index, reading column + TOC (паттерн B) для entry.
- **Мост в каталог из справки:** кликабельный счётчик «N камней» связывает образовательный контент с продажами.
- **Live-блок** в конце статьи показывает актуальные позиции вида — справка не оторвана от ассортимента.
- **Cream empty-state** «под заказ» вместо пустоты, когда камня нет в наличии.
- Sticky TOC только на lg+; на mobile не рендерится. Только светлая тема.

> **Реализация:** в пакете сгенерирован компонент **Index** (`EncyclopediaIndex`). **Entry**-страница
> полностью описана типами (`EncyclopediaEntryProps`) и спекой (View 2), но отдельные компоненты под неё
> не сгенерированы — реализуйте по `types.ts` + этому README + спеке.

## Data Shapes

**Entities:** `StoneVariety` (расширенная — с mineralClass, formula, hardness и т.д.), `EncyclopediaEntry`, `LiveStoneCard`, `BlogPostCard` (+ тип `EntrySectionId`).

**From global entities:** EncyclopediaEntry (связан с StoneVariety один-к-одному), StoneVariety, Stone (проекция `LiveStoneCard`), BlogPost (проекция `BlogPostCard`).

## Visual Reference

См. `screenshot.png` (index-страница).

## Components Provided

- `EncyclopediaIndex` — корневой компонент index-страницы.
- `VarietyCard` — карточка вида в editorial-grid.

## Callback Props

**Index (`EncyclopediaIndexProps`):**

| Callback | Triggered When |
|----------|---------------|
| `onSelectVariety(varietyId)` | Клик по карточке вида → статья |
| `onBrowseInCatalog(varietyId)` | Клик по счётчику «N камней» → каталог |

**Entry (`EncyclopediaEntryProps` — реализовать по типам):**

| Callback | Triggered When |
|----------|---------------|
| `onBackToIndex()` | Breadcrumb «Энциклопедия» |
| `onScrollToSection(sectionId)` | Пункт TOC → скролл к разделу |
| `onViewStone(stoneId)` | Карточка камня в live-блоке |
| `onBrowseInCatalog(varietyId)` | CTA «Все [вид] в каталоге» |
| `onViewPost(postId)` | Карточка поста блога |
| `onContactForCustom(varietyId)` | «Написать в Telegram» в empty-state |
