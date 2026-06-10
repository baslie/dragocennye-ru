# Milestone 3: Stone Detail

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) complete; Milestone 2 (Catalog Browse) recommended (общий StoneCard-язык)

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

Implement the **Stone Detail** feature — карточка отдельного камня: editorial-галерея крупных фото и
видео, оценка гемолога, полный паспорт характеристик, сертификат и подборка похожих камней. Цель —
дать ценителю всё, чтобы рассмотреть экземпляр и одним кликом оставить заявку.

## Overview

Двухколоночный hybrid-layout (`lg:grid-cols-[1fr_440px]`): слева editorial-контент (галерея стеком,
блок «От гемолога», паспорт, сертификат), справа sticky-sidebar с ценой, CTA «Оставить заявку» и тремя
быстрыми контактами. Под grid — блок похожих камней того же вида. Поддержано sold-состояние.

**Key Functionality:**
- Breadcrumb + крупный H1 + mono-метаподпись с ключевыми параметрами.
- Editorial media stack: 3–5 крупных фото/видео без миниатюр; клик открывает полноэкранный lightbox со стрелками, свайпом и зумом.
- Блок «От гемолога» (1–3 абзаца) и паспорт характеристик (вес, размеры, огранка, цвет, происхождение, обработка, чистота, блеск, твёрдость, показатель преломления).
- Блок сертификата (cream-карточка) с кнопками «Посмотреть скан» и «Проверить на сайте лаборатории»; скрыт если сертификата нет.
- Sticky-sidebar: цена (steel), CTA «Оставить заявку» (coral), три быстрых контакта (Telegram / WhatsApp / телефон).
- Sold state: стемп «Продан» на первом медиа, перечёркнутая цена, CTA → «Смотреть другие [вид]».
- Блок похожих камней (4–5 карточек того же StoneVariety); скрыт если пуст.

## Components Provided

Copy from `product-plan/sections/stone-detail/components/`:

- `StoneDetail` — корневой компонент секции.
- `Breadcrumb` — тонкая mono-строка над grid.
- `StoneMediaStack` — стек фото/видео в левой колонке.
- `Lightbox` — полноэкранный просмотр медиа.
- `SpecSheet` — паспорт характеристик.
- `CertificateCard` — блок сертификата (cream).
- `PriceSidebar` — sticky-sidebar с ценой, CTA и контактами (триггерит Inquiry).
- `SimilarStonesBlock` — подборка похожих камней.

## Props Reference

Полные определения — `types.ts`. Корневой `StoneDetailProps`:

**Data props:** `stone: StoneDetail`, `variety: StoneVariety`, `cut: Cut`, `origin: Origin`, `treatment: Treatment`, `color: Color`, `certificate: StoneCertificate | null`, `similarStones: SimilarStoneCard[]`, `contactChannels: ContactChannel[]`.

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onInquire(stoneId)` | Клик по primary CTA «Оставить заявку» → открыть модалку Inquiry |
| `onSelectSimilar(stoneId)` | Клик по карточке похожего камня |
| `onOpenMedia(mediaId)` | Клик по медиа → открыть lightbox на нём |
| `onBreadcrumbClick(varietyId)` | Клик по сегменту вида в breadcrumb или sold-CTA «Смотреть другие» |
| `onOpenCertificateScan(certificateId)` | Кнопка «Посмотреть скан» |
| `onVerifyCertificate(certificateId)` | Кнопка «Проверить на сайте лаборатории» |

## Expected User Flows

### Flow 1: Осмотр и заявка
1. Пользователь попадает на `/stones/[slug]`, видит breadcrumb, H1, метаподпись.
2. Скроллит галерею, кликает медиа → `onOpenMedia` открывает lightbox (стрелки/свайп/зум, Escape закрывает).
3. Читает «От гемолога», паспорт, раскрывает сертификат.
4. Нажимает «Оставить заявку» → `onInquire(stoneId)`.
5. **Outcome:** открывается модалка Inquiry (Milestone 4) по этому камню.

### Flow 2: Сертификат
1. Пользователь в блоке сертификата нажимает «Посмотреть скан» → `onOpenCertificateScan` (PDF в новой вкладке).
2. Или «Проверить на сайте лаборатории» → `onVerifyCertificate` (внешняя ссылка).
3. **Outcome:** открывается соответствующий ресурс. Если `certificate === null` — блок скрыт.

### Flow 3: Sold-камень
1. Пользователь открывает камень с `isAvailable === false`.
2. **Outcome:** на первом медиа — стемп «Продан», цена перечёркнута, CTA заменён на «Смотреть другие [вид]» → `onBreadcrumbClick(varietyId)`; быстрые контакты остаются активными.

### Flow 4: Похожие камни
1. Пользователь скроллит ниже grid, видит «Похожие [вид]».
2. Кликает карточку → `onSelectSimilar(stoneId)`.
3. **Outcome:** переход на detail выбранного камня. Если `similarStones` пуст — блок скрыт.

## Empty States

- **Нет сертификата** (`certificate === null`): блок сертификата полностью скрыт.
- **Нет похожих камней** (`similarStones` пуст): блок «Похожие» скрыт.
- **Sold** (`isAvailable === false`): стемп + перечёркнутая цена + заменённый CTA.

## Testing

См. `product-plan/sections/stone-detail/tests.md`.

## Files to Reference

- `product-plan/sections/stone-detail/README.md`
- `product-plan/sections/stone-detail/tests.md`
- `product-plan/sections/stone-detail/components/`
- `product-plan/sections/stone-detail/types.ts`
- `product-plan/sections/stone-detail/sample-data.json`
- `product-plan/sections/stone-detail/screenshot.png`

## Done When

- [ ] Двухколоночный layout с sticky-sidebar (одна колонка на mobile в правильном порядке)
- [ ] Media stack + lightbox (стрелки, свайп, зум, Escape) работают
- [ ] Паспорт характеристик и блок «От гемолога» рендерятся
- [ ] Сертификат скрывается при `null`, кнопки скана/верификации работают
- [ ] CTA «Оставить заявку» вызывает `onInquire`
- [ ] Sold state: стемп, перечёркнутая цена, заменённый CTA
- [ ] Блок похожих камней (скрыт если пуст), клик ведёт на detail
- [ ] Responsive на mobile
