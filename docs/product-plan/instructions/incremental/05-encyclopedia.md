# Milestone 5: Encyclopedia

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell); Milestones 2–3 recommended (общий StoneCard-язык live-блока)

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
