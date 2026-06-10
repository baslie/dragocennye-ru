# Test Specs: Encyclopedia

Эти спеки **framework-agnostic** — адаптируйте под свой стек.

## Overview

Encyclopedia — index видов камней (editorial-grid) и entry-страница (reading column + sticky TOC +
live-блок из каталога). Проверяем навигацию index→entry, мост в каталог, TOC, live-блок и empty-state.

---

## User Flow Tests

### Flow 1: Index → статья

**Scenario:** Пользователь открывает справку по сапфиру.

**Setup:**
- `varieties` содержит «Сапфир» (`slug: "sapfir"`, `classLabel: "Корунд"`, `stoneCount: 52`).

**Steps:**
1. Пользователь открывает `/encyclopedia`.
2. Видит hero «Энциклопедия камней» и grid карточек видов.
3. Кликает карточку «Сапфир».

**Expected Results:**
- [ ] Карточка показывает обложку 4:3, mono-класс «Корунд», название «Сапфир», teaser, мета «52 камня в коллекции», «Читать →».
- [ ] Клик по карточке вызывает `onSelectVariety` с id вида.
- [ ] (Реализация) переход на `/encyclopedia/sapfir`.

---

### Flow 2: Мост в каталог из справочника

**Steps:**
1. На карточке вида пользователь кликает по сегменту «52 камня в коллекции».

**Expected Results:**
- [ ] Вызывается `onBrowseInCatalog(varietyId)`.
- [ ] Переход на статью НЕ происходит (обработчик вызывает `stopPropagation`).

---

### Flow 3: Entry — чтение, TOC, live-блок

**Scenario:** Пользователь читает статью и переходит к камню из live-блока.

**Setup:**
- `variety`, `entry` (разделы intro/history/colors/choose), `stonesInStock` наполнен, `relatedPosts` есть.

**Expected Results:**
- [ ] Breadcrumb «Энциклопедия / Сапфир»; клик по «Энциклопедия» → `onBackToIndex()`.
- [ ] Hero + H1 + mono-подпись параметров рендерятся.
- [ ] Четыре раздела с H2; в разделе intro — паспорт свойств (6 полей: Класс минерала, Формула, Твёрдость, Плотность, Показатель преломления, Кристаллическая система).
- [ ] TOC (lg+) подсвечивает активный раздел; клик по пункту → `onScrollToSection(sectionId)`.
- [ ] Блок «Дмитрий пишет о сапфирах» — 2–3 карточки постов; клик → `onViewPost(postId)`.
- [ ] Live-блок «Сейчас в коллекции»: до 5 StoneCard; клик → `onViewStone(stoneId)`.
- [ ] CTA «Все сапфиры в каталоге (52)» → `onBrowseInCatalog(varietyId)`.

---

## Empty State Tests

### Live-блок без камней

**Setup:** `stonesInStock.length === 0`.

**Expected Results:**
- [ ] Вместо сетки и CTA — cream empty-state «Сейчас этого камня нет в коллекции».
- [ ] Параграф «Напишите Дмитрию — подберём под заказ …».
- [ ] Кнопка «Написать в Telegram» (с иконкой `Send`) → `onContactForCustom(varietyId)`.

### Нет связанных постов

**Setup:** `relatedPosts.length === 0`.

**Expected Results:**
- [ ] Блок «Дмитрий пишет о …» полностью скрыт.

---

## Component Interaction Tests

### VarietyCard (index)

- [ ] Hover: карточка `-translate-y-1`, обложка `scale-[1.02]`, «Читать →» → coral.
- [ ] Мета-счётчик — steel `#576A8F`, hover → coral.

### TOC (entry)

- [ ] Активный пункт — `text-[#576A8F]` с левым бордером; неактивные без бордера.
- [ ] На mobile/tablet (< lg) TOC не рендерится.

---

## Edge Cases

- [ ] Index с 1 видом и с 10+ видами (сетка 1/2/3 колонки).
- [ ] Entry с минимальным числом камней (1) и с переполнением (показываются первые 5).
- [ ] Длинный teaser обрезается `line-clamp-3`.
- [ ] Mobile entry: TOC отсутствует, reading column на full width, live-блок 2 колонки.

---

## Accessibility Checks

- [ ] Карточки видов и пункты TOC доступны с клавиатуры.
- [ ] Обложки имеют alt-текст.
- [ ] Кнопка «Написать в Telegram» доступна с клавиатуры.

---

## Sample Test Data

См. `sample-data.json`: `varieties[10]`, `entries[10]`, `stonesInStock[18]`, `blogPosts[6]`.

```typescript
const mockVariety = { id: "v-sapfir", slug: "sapfir", name: "Сапфир", classLabel: "Корунд", stoneCount: 52, /* … */ };
const mockEmptyStock = [];   // для empty-state live-блока
const mockNoRelatedPosts = []; // блок постов скрыт
```
