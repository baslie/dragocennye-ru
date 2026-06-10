# Test Specs: Stone Detail

Эти спеки **framework-agnostic** — адаптируйте под свой стек.

## Overview

Stone Detail — карточка камня: editorial media stack + lightbox, блок «От гемолога», паспорт,
сертификат, sticky-sidebar с ценой/CTA/контактами, блок похожих камней, sold-состояние. Проверяем
галерею, заявку, сертификат, sold-логику и похожие камни.

---

## User Flow Tests

### Flow 1: Осмотр и заявка

**Scenario:** Пользователь рассматривает камень и оставляет заявку.

#### Success Path

**Setup:**
- `stone` — «Зелёный сапфир», `isAvailable: true`, `price: 40800`, `media` из 3–5 элементов.
- `variety` = Сапфир (`pluralName: "сапфиры"`), `certificate` не null.

**Steps:**
1. Пользователь открывает `/stones/[slug]`.
2. Видит breadcrumb «Каталог / Сапфиры / Зелёный сапфир …», H1, mono-метаподпись.
3. Кликает первое медиа.
4. Нажимает «Оставить заявку» в sidebar.

**Expected Results:**
- [ ] Media stack рендерит 3–5 крупных блоков без миниатюр.
- [ ] Клик по медиа вызывает `onOpenMedia(mediaId)` и открывает lightbox.
- [ ] В lightbox работают стрелки (клавиатура + клик), свайп на тач, зум по клику; Escape закрывает.
- [ ] «Оставить заявку» вызывает `onInquire(stone.id)`.
- [ ] Цена отображается steel `#576A8F`, формат «40 800 ₽».

---

### Flow 2: Сертификат

**Steps:**
1. В блоке сертификата пользователь нажимает «Посмотреть скан».
2. Затем «Проверить на сайте лаборатории».

**Expected Results:**
- [ ] «Посмотреть скан» вызывает `onOpenCertificateScan(certificateId)`.
- [ ] «Проверить…» вызывает `onVerifyCertificate(certificateId)`.
- [ ] Блок сертификата — cream-карточка `#FFF8DE` с mono-строкой «Лаборатория · Номер · Дата».

#### Failure Path: Нет сертификата

**Setup:** `certificate === null`.

**Expected Results:**
- [ ] Блок сертификата полностью скрыт (не рендерится пустая карточка).

---

### Flow 3: Sold-камень

**Setup:** `stone.isAvailable === false`.

**Expected Results:**
- [ ] На первом медиа — overlay со стемпом «Продан» (steel, uppercase).
- [ ] Цена в sidebar — `line-through text-stone-400`.
- [ ] Primary CTA заменён на «Смотреть другие сапфиры» → `onBreadcrumbClick(variety.id)`.
- [ ] Три быстрых контакта остаются активными.

---

### Flow 4: Похожие камни

**Steps:**
1. Пользователь скроллит ниже grid, видит «Похожие сапфиры».
2. Кликает карточку.

**Expected Results:**
- [ ] Рендерится 4–5 карточек того же вида.
- [ ] Клик вызывает `onSelectSimilar(stoneId)`.
- [ ] Если `similarStones` пуст — блок скрыт.

---

## Empty State Tests

- [ ] `certificate === null` → блок сертификата скрыт.
- [ ] `similarStones.length === 0` → блок «Похожие» скрыт.
- [ ] `isAvailable === false` → sold-overlay + перечёркнутая цена + заменённый CTA.

---

## Component Interaction Tests

### PriceSidebar

- [ ] Sticky на lg+ (`lg:sticky lg:top-24`); на mobile — обычный блок под метой.
- [ ] Цена, primary CTA (coral), три контакт-кнопки (Telegram / WhatsApp / Phone) рендерятся.
- [ ] Hover контакт-кнопки: бордер и текст → coral.

### Lightbox

- [ ] Открывается на кликнутом медиа.
- [ ] Стрелки листают между медиа; зум по клику на фото; Escape закрывает.
- [ ] Видео рендерится с controls и `playsInline`.

### SpecSheet

- [ ] Поля: Вес, Размеры, Огранка, Цвет, Происхождение, Обработка, Чистота, Блеск, Твёрдость, Показатель преломления.
- [ ] Каждый `<dt>` — mono uppercase, `<dd>` — Noto Sans.

---

## Edge Cases

- [ ] Камень только с фото (без видео) и наоборот.
- [ ] Минимальный media stack из 3 элементов и максимальный из 5.
- [ ] Очень длинное название камня в H1 и breadcrumb (truncate в breadcrumb).
- [ ] Mobile-порядок блоков: breadcrumb → H1+мета → mobile-sidebar → галерея → «От гемолога» → паспорт → сертификат → похожие.

---

## Accessibility Checks

- [ ] Lightbox управляется клавиатурой (стрелки, Escape); фокус внутри overlay.
- [ ] Кнопки сертификата и CTA доступны с клавиатуры.
- [ ] Медиа имеют alt-текст.

---

## Sample Test Data

См. `sample-data.json`. Ключевые объекты: `stone` (полный StoneDetail), `variety`, `certificate`,
`similarStones[5]`, `contactChannels[3]`. Для sold-теста переопределите `stone.isAvailable = false`;
для теста «нет сертификата» — `certificate = null`.
