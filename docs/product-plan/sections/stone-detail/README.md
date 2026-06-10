# Stone Detail

## Overview

Карточка отдельного камня «Драгоценных»: editorial-галерея крупных фото и видео, короткое описание от
гемолога, полный паспорт характеристик, сертификат и подборка других камней того же вида. Цель — дать
ценителю всё, чтобы рассмотреть экземпляр и одним кликом оставить заявку без длинной переписки.

## User Flows

- Заход на `/stones/[slug]` из каталога/энциклопедии/поиска → breadcrumb, крупный H1, mono-метаподпись.
- Скролл editorial media stack (3–5 фото/видео без миниатюр); клик по медиа → полноэкранный lightbox (стрелки, свайп, зум, Escape).
- Чтение блока «От гемолога» и паспорта характеристик.
- Раскрытие сертификата → «Посмотреть скан» (PDF) и «Проверить на сайте лаборатории».
- Sticky CTA «Оставить заявку» → открывает модалку Inquiry; три быстрых контакта (Telegram / WhatsApp / телефон).
- Блок «Похожие [вид]» под grid; клик по карточке → detail.
- Sold-камень: стемп «Продан», перечёркнутая цена, CTA → «Смотреть другие [вид]», контакты активны.

## Design Decisions

- **Hybrid grid** `lg:grid-cols-[1fr_440px]`: слева editorial, справа sticky-sidebar — паттерн E из layout-стратегии.
- **Media stack без миниатюр** — крупные блоки один под другим читаются как разворот журнала; lightbox для детального осмотра.
- **Reading column `max-w-[72ch]`** для блока «От гемолога» — единственный длинный текст на странице.
- **Cream-карточка сертификата** `#FFF8DE` — выделяет trust-блок; скрыта при отсутствии сертификата.
- **Steel для цены и стемпа, coral для CTA** — консистентно с палитрой. Только светлая тема.

## Data Shapes

**Entities:** `StoneDetail`, `StoneMedia`, `StoneVariety`, `Cut`, `Origin`, `Treatment`, `Color`, `StoneCertificate`, `StoneCharacteristics`, `SimilarStoneCard`, `ContactChannel` (+ типы `CutSlug`, `TreatmentSlug`, `MediaKind`, `ContactChannelType`).

**From global entities:** Stone (полная форма с media/editorial/characteristics), StoneVariety, Cut, Origin, Treatment, Certificate.

## Visual Reference

См. `screenshot.png`.

## Components Provided

- `StoneDetail` — корневой компонент.
- `Breadcrumb` — mono-строка над grid.
- `StoneMediaStack` — стек фото/видео.
- `Lightbox` — полноэкранный просмотр медиа.
- `SpecSheet` — паспорт характеристик.
- `CertificateCard` — блок сертификата (cream).
- `PriceSidebar` — sticky-sidebar (цена, CTA, контакты).
- `SimilarStonesBlock` — подборка похожих камней.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onInquire(stoneId)` | CTA «Оставить заявку» → модалка Inquiry |
| `onSelectSimilar(stoneId)` | Клик по похожему камню |
| `onOpenMedia(mediaId)` | Клик по медиа → lightbox |
| `onBreadcrumbClick(varietyId)` | Сегмент вида в breadcrumb / sold-CTA |
| `onOpenCertificateScan(certificateId)` | «Посмотреть скан» |
| `onVerifyCertificate(certificateId)` | «Проверить на сайте лаборатории» |
