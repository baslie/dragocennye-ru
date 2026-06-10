# Milestone 6: Blog & About

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
