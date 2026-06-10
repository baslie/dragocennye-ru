# Blog & About

## Overview

Редакторско-доверительный блок «Драгоценных». Три экрана: лента публикаций Дмитрия Салятова (`/blog`)
с featured-постом и фильтром по виду камня, страница отдельного поста (`/blog/[slug]`) с long-read-вёрсткой,
live-блоком упомянутых камней и подписью автора, и страница о гемологе (`/about`) с портретом,
образованием, подходом к подбору, статами и CTA в Telegram.

## User Flows

### Blog feed (`/blog`)
- Hero «Журнал» + вводный абзац; строка фильтр-чипов по виду камня.
- При фильтре «Все» — featured-пост (immersive-hero) первым, ниже editorial-grid остальных. При конкретном фильтре featured скрыт.
- Клик по карточке → `onViewPost`. Пустой фильтр → empty-state «Пока нет публикаций…» + «Сбросить фильтр».

### Blog post (`/blog/[slug]`)
- Breadcrumb «Журнал / [Заголовок]»; immersive-hero (мета + H1 поверх обложки); reading column (lead + блоки paragraph/heading/quote/image).
- Author byline со ссылкой «О гемологе →». Live-блок «Камни из этой статьи» (до 5 StoneCard + CTA). Блок «Читать дальше».

### About (`/about`)
- Hero: портрет + интро + стат-чипы. Таймлайн «Образование и опыт». «Подход к подбору» (проза). «Из журнала» (3 поста). CTA-блок с Telegram/WhatsApp/телефон.

## Design Decisions

- **Immersive-hero overlay:** заголовок и мета поверх обложки на тёмной градиентной вуали (`OVERLAY_VEIL`) — приём ради читаемости белого текста, **не** dark-mode (политика «только светлая тема» сохраняется).
- **Обложки-плейсхолдеры:** реальных фото нет — рисуется насыщенный jewel-градиент (`coverStyle`/`heroCoverStyle`/`portraitStyle` в `format.ts`), реальное фото ложится поверх через `<img onError>` (при 404 остаётся градиент).
- **Стат-чипы вместо отдельной «ленты статов»** на About — статы один раз, компактной строкой под интро, наполняют правую колонку до высоты портрета.
- **Тело поста — дискриминированный union блоков** (`PostBlock`): paragraph / heading / quote / image — рендерится по порядку в reading column.
- Cream `#FFF8DE` для цитат, CTA-блока и empty-state. Periwinkle для активного чипа и бейджей поверх обложек.

## Data Shapes

**Entities:** `BlogPost`, `BlogPostCard`, `PostBlock` (union: Paragraph/Heading/Quote/Image), `Gemologist`, `GemologistStat`, `TimelineItem`, `GemologistContact`, `Author`, `Topic`, `StoneCard` (+ типы `ContactChannel`, `PostBlockType`).

**From global entities:** BlogPost (ссылается на StoneVariety), Gemologist (автор постов), Stone (проекция `StoneCard` для live-блока).

## Visual Reference

См. `screenshot.png` (лента), а также `screenshot-feed.png`, `screenshot-post.png`, `screenshot-about.png`.

## Components Provided

- `BlogFeed` — корневой компонент ленты (`/blog`).
- `BlogPost` — корневой компонент поста (`/blog/[slug]`).
- `About` — корневой компонент страницы о гемологе (`/about`).
- `VarietyFilter` — строка фильтр-чипов.
- `FeaturedPost` — immersive-карточка featured-поста.
- `PostCard` — editorial-карточка поста.
- `PostBody` — рендер тела поста из блоков.
- `AuthorByline` — подпись автора.
- `MentionedStones` — live-блок «Камни из этой статьи».
- `BlogStoneCard` — карточка камня для live-блока.
- `Timeline` — таймлайн «Образование и опыт».
- `format.ts` — общие стили обложек и форматтеры (зависимость остальных компонентов, не удалять).

## Callback Props

**Feed (`BlogFeedProps`):** `onFilterByVariety(varietyId \| null)`, `onViewPost(postId)`.

**Post (`BlogPostProps`):** `onBackToFeed()`, `onBrowseInCatalog(varietyId)`, `onViewStone(stoneId)`, `onViewPost(postId)`, `onViewAbout()`.

**About (`AboutProps`):** `onViewPost(postId)`, `onViewFeed()`, `onContact(channel)`.
