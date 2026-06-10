# Milestone 4: Inquiry

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Shell) + Milestone 3 (Stone Detail) — модалка триггерится из `PriceSidebar` Stone Detail

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

Implement the **Inquiry** feature — модальное окно одно-камневой заявки: клиент оставляет имя, контакт,
выбирает удобный канал связи и опционально комментарий. Никакой корзины и онлайн-оплаты — цель связать
ценителя с гемологом Дмитрием в один клик, без регистрации.

## Overview

Модалка оверлеится поверх Stone Detail. Содержит mini-карточку камня, поля «Имя / Контакт / Канал связи
/ Комментарий» и обязательный чекбокс согласия 152-ФЗ. Покрывает **четыре состояния**: `idle` (форма),
`loading` (отправка), `sent` (успех), `error` (валидация или сетевой сбой). Родитель — источник истины
для значений и состояния.

**Key Functionality:**
- Backdrop + центрированный диалог (на mobile — bottom sheet), focus-trap, Escape/клик-вне закрывают (кроме `loading`).
- Mini-карточка камня (cream): фото 80×80, название с весом и огранкой, цена (steel).
- Поля: Имя, Контакт (с хинтом), Канал связи (3 radio-чипа Telegram/WhatsApp/Телефон), Комментарий (опционально).
- Чекбокс 152-ФЗ со ссылкой на политику; CTA disabled пока не проставлено согласие.
- `loading`: поля disabled, спиннер + «Отправляем…».
- `sent`: success-блок (галочка, «Спасибо!», текст с выбранным каналом, кнопка «Закрыть»); header и mini-карточка остаются.
- `error`: `fieldErrors` → красные бордеры и подписи; `errorMessage` → баннер над формой; форма остаётся заполненной.

## Components Provided

Copy from `product-plan/sections/inquiry/components/`:

- `InquiryModal` — корневой компонент (управляет состояниями, overlay, focus-trap).
- `InquiryDialog` — диалоговая коробка (header + body + footer).
- `StoneMiniCard` — мини-карточка камня (cream).
- `ChannelChipGroup` — группа из трёх radio-чипов канала связи.
- `ConsentCheckbox` — кастомный чекбокс согласия 152-ФЗ.
- `SentBlock` — success-блок при `state === 'sent'`.

## Props Reference

Полные определения — `types.ts`. Корневой `InquiryModalProps`:

**Data props:** `isOpen: boolean`, `stone: InquiryStoneMini`, `channels: InquiryChannel[]`, `values: InquiryFormValues`, `state: InquiryState`, `fieldErrors?: InquiryFieldErrors`, `errorMessage?: string`, `successMessage: string`, `consent: InquiryConsent`.

**Callback props:**

| Callback | Triggered When |
|----------|---------------|
| `onChange(values)` | Изменение любого поля формы (родитель хранит snapshot) |
| `onSubmit(values)` | Сабмит формы (CTA «Отправить заявку») |
| `onClose()` | Крестик, Escape, клик по backdrop, кнопка «Закрыть» в sent-state |

Родитель: при `onInquire` из Stone Detail разрешает камень в `InquiryStoneMini`, монтирует модалку с
`state: 'idle'`, ведёт значения через `onChange`, на `onSubmit` переключает `state` в `loading` →
`sent` / `error`.

## Expected User Flows

### Flow 1: Успешная заявка
1. Из Stone Detail срабатывает `onInquire(stoneId)` → модалка открывается (`state: 'idle'`, автофокус на «Имя»).
2. Клиент вводит имя, контакт, выбирает radio-чип канала, проставляет согласие → CTA активируется.
3. Жмёт «Отправить заявку» → `onSubmit(values)`, родитель → `state: 'loading'` (поля disabled, «Отправляем…»).
4. Успех → `state: 'sent'`: success-блок «Спасибо!» с текстом про выбранный канал.
5. **Outcome:** клиент жмёт «Закрыть» → `onClose()`, фокус возвращается на CTA в Stone Detail.

### Flow 2: Ошибка валидации
1. Клиент отправляет с пустым обязательным полем.
2. Родитель передаёт `fieldErrors` и `state: 'error'`.
3. **Outcome:** поля с ошибкой — красный бордер и подпись; форма заполнена, CTA активен, клиент правит и шлёт заново.

### Flow 3: Сетевая ошибка
1. Сабмит падает по сети.
2. Родитель передаёт `errorMessage` и `state: 'error'` без `fieldErrors`.
3. **Outcome:** баннер `AlertCircle` над формой, поля заполнены, CTA снова активен.

## Empty / Disabled States

- **Согласие не проставлено:** CTA disabled (`bg-stone-300`, курсор not-allowed).
- **`state === 'loading'`:** все поля и чекбокс disabled, backdrop/Escape не закрывают модалку.
- **`isOpen === false`:** компонент ничего не рендерит.

## Testing

См. `product-plan/sections/inquiry/tests.md`.

## Files to Reference

- `product-plan/sections/inquiry/README.md`
- `product-plan/sections/inquiry/tests.md`
- `product-plan/sections/inquiry/components/`
- `product-plan/sections/inquiry/types.ts`
- `product-plan/sections/inquiry/sample-data.json`
- `product-plan/sections/inquiry/screenshot.png`

## Done When

- [ ] Четыре состояния (idle / loading / sent / error) переключаются корректно
- [ ] Mini-карточка камня, все поля и radio-чипы рендерятся
- [ ] Чекбокс 152-ФЗ блокирует CTA до согласия
- [ ] `loading`: поля disabled, спиннер, backdrop/Escape не закрывают
- [ ] `sent`: success-блок с выбранным каналом; «Закрыть» вызывает `onClose`
- [ ] `error`: fieldErrors (красные бордеры) и errorMessage (баннер) работают
- [ ] Focus-trap, автофокус, возврат фокуса на триггер; Escape/backdrop/крестик закрывают
- [ ] Responsive: bottom sheet на mobile (< 640px)
- [ ] Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, aria для ошибок
