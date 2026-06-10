# Test Specs: Blog & About

Эти спеки **framework-agnostic** — адаптируйте под свой стек.

## Overview

Blog & About — три экрана: лента (`/blog`) с фильтром и featured-постом, пост (`/blog/[slug]`) с
long-read-вёрсткой и live-блоком камней, и страница о гемологе (`/about`). Проверяем фильтрацию,
навигацию, рендер тела поста, live-блок, контакты и empty-states.

---

## User Flow Tests

### Flow 1: Лента → пост

**Scenario:** Пользователь фильтрует ленту и открывает пост.

**Setup:**
- `topics` = [«Сапфир», «Изумруд», «Шпинель», «Турмалин», «Аквамарин»], `activeTopicId: null`.
- `posts` наполнен; один помечен `isFeatured: true` (например «Как отличить негретый сапфир …»).

**Steps:**
1. Пользователь открывает `/blog`, видит hero «Журнал» и строку фильтр-чипов.
2. При фильтре «Все» первым идёт featured-пост (immersive-hero), ниже — editorial-grid.
3. Кликает чип «Сапфир».
4. Кликает карточку поста.

**Expected Results:**
- [ ] Чип «Все» активен по умолчанию; featured-пост виден только при «Все».
- [ ] Клик по «Сапфир» вызывает `onFilterByVariety('<id сапфира>')`; featured скрывается, совпавшие посты идут единой сеткой.
- [ ] Клик по карточке (featured или из сетки) вызывает `onViewPost(postId)`.

#### Failure Path: Пустой фильтр

**Setup:** выбран вид без постов.

**Expected Results:**
- [ ] Рендерится cream empty-state «Пока нет публикаций об этом камне».
- [ ] Кнопка «Сбросить фильтр» → `onFilterByVariety(null)`.

---

### Flow 2: Чтение поста

**Scenario:** Пользователь читает пост и переходит к камню/гемологу.

**Setup:**
- `post` с `lead`, `body` (блоки paragraph/heading/quote/image), `mentionedStones` наполнен, `relatedPosts` есть.
- `author` = `{ name: "Дмитрий Салятов", role: "Гемолог, основатель «Драгоценных»", … }`.

**Expected Results:**
- [ ] Breadcrumb «Журнал / [Заголовок]»; клик по «Журнал» → `onBackToFeed()`.
- [ ] Immersive-hero: мета (дата · время чтения · ярлык вида) и H1 поверх обложки на тёмной вуали.
- [ ] Ярлык вида в мете кликабелен → `onBrowseInCatalog(varietyId)`.
- [ ] Reading column: lead крупным абзацем, затем блоки `body` по типам (paragraph, heading H2, quote — cream blockquote, image — figure с caption).
- [ ] Author byline: портрет, имя, подпись, ссылка «О гемологе →» → `onViewAbout()`.
- [ ] Live-блок «Камни из этой статьи»: до 5 StoneCard, клик → `onViewStone`; CTA «Смотреть в каталоге» → `onBrowseInCatalog`.
- [ ] «Читать дальше»: 2–3 карточки, клик → `onViewPost`.

---

### Flow 3: About → контакт

**Setup:** `gemologist` (intro, stats, timeline, approach, contacts), `recentPosts` (3 поста).

**Expected Results:**
- [ ] Hero: портрет слева, mono «Гемолог», H1 «Дмитрий Салятов», должность, интро-абзацы.
- [ ] Стат-чипы под интро (значение + mono-подпись) — единственное место статов.
- [ ] Таймлайн «Образование и опыт»: год (steel mono), заголовок, описание, маркер-точка.
- [ ] «Подход к подбору» — проза reading column.
- [ ] «Из журнала»: 3 карточки, клик → `onViewPost`; ссылка «Все публикации →» → `onViewFeed()`.
- [ ] CTA-блок: «Telegram» (coral) → `onContact('telegram')`, «WhatsApp» и телефон (outline) → `onContact(...)`.

---

## Empty State Tests

- [ ] **Пустой фильтр ленты** → cream empty-state + «Сбросить фильтр».
- [ ] **`mentionedStones.length === 0`** → live-блок поста скрыт.
- [ ] **`relatedPosts.length === 0`** → «Читать дальше» скрыт.
- [ ] **Обложка 404:** реальное фото через `<img onError>` падает обратно на jewel-градиент (`coverStyle`/`heroCoverStyle`/`portraitStyle`), плейсхолдер не «белая дыра».

---

## Component Interaction Tests

### VarietyFilter

- [ ] Активный чип — `bg-[#B7BDF7]/30 border-[#576A8F] text-[#576A8F]`; неактивный — outline, hover → steel.
- [ ] Первый чип «Все» вызывает `onFilterByVariety(null)`.

### PostBody

- [ ] `paragraph` → абзац; `heading` → H2; `quote` → cream blockquote с левым coral-бордером; `image` → figure с опциональной mono-figcaption.
- [ ] Блоки рендерятся в порядке массива `body`.

### PostCard / FeaturedPost

- [ ] PostCard: обложка 4:3, мета (дата · мин · вид), заголовок (hover → coral), teaser `line-clamp-3`, hover `-translate-y-1`.
- [ ] FeaturedPost: immersive-hero с overlay-контентом (бейдж «Свежее» periwinkle, мета, H2 белым, «Читать →»).

---

## Edge Cases

- [ ] Лента без featured-поста (ни один не `isFeatured`) при фильтре «Все».
- [ ] Пост без `lead` и пост без изображений в `body`.
- [ ] About с разным числом статов (3–4) и пунктов таймлайна.
- [ ] Mobile: immersive-hero `aspect-[16/9]`, reading column full width, live-блок 2 колонки, «Из журнала» 1 колонка, hero About вертикально.

---

## Accessibility Checks

- [ ] Чипы фильтра, карточки постов и контакт-кнопки доступны с клавиатуры.
- [ ] Белый текст поверх обложки сохраняет контраст за счёт тёмной вуали.
- [ ] Обложки и портрет имеют alt-текст.

---

## Sample Test Data

См. `sample-data.json`: `gemologist`, `topics[5]`, `posts[9]`, `currentPost`.

```typescript
const mockTopics = [
  { id: "…", slug: "sapfir", name: "Сапфир", postCount: 4 },
  // …
];
const mockFeaturedPost = { id: "…", title: "Как отличить негретый сапфир от нагретого …", varietyLabel: "Сапфир", isFeatured: true, /* … */ };
const mockEmptyFilter = []; // посты после фильтра — empty-state
const mockNoMentionedStones = []; // live-блок скрыт
```
