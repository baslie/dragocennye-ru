# Inquiry

## Overview

Модальное окно одно-камневой заявки «Драгоценных»: клиент оставляет имя, контакт, выбирает удобный
канал связи и при желании комментарий по конкретному камню. Никакой корзины и онлайн-оплаты — цель
связать ценителя с гемологом Дмитрием в один клик, сохранив анонимность и обойдясь без регистрации.
Триггерится из `PriceSidebar` карточки камня в Stone Detail; покрывает четыре состояния.

## User Flows

- Из Stone Detail срабатывает `onInquire(stoneId)` → модалка открывается (`idle`, автофокус на «Имя»).
- Клиент видит mini-карточку камня, вводит имя/контакт, выбирает radio-чип канала, опционально комментарий, проставляет согласие 152-ФЗ → CTA активируется.
- Сабмит → `loading` (поля disabled, спиннер «Отправляем…») → `sent` (success-блок «Спасибо!») или `error`.
- `error` валидации: `fieldErrors` подсвечивают поля; `error` сети: баннер над формой. Форма остаётся заполненной.
- Закрытие: крестик / Escape / клик по backdrop / «Закрыть» в sent → `onClose()`, фокус возвращается на триггер.

## Design Decisions

- **Родитель — источник истины:** `values` и `state` приходят props; модалка только сообщает об изменениях (`onChange`, `onSubmit`, `onClose`). Бэкенд-логика, валидация и переключение состояний — на стороне реализации.
- **Четыре явных состояния** вместо внутренних флагов — прозрачный контракт.
- **Bottom sheet на mobile** (`items-end`, `rounded-t-2xl`) — нативный мобильный паттерн.
- **Обязательное согласие 152-ФЗ** блокирует CTA — юридическое требование РФ.
- **Cream mini-карточка** `#FFF8DE` держит контекст камня во всех состояниях, включая success.
- Focus-trap, `role="dialog"`, `aria-modal`, aria для ошибок. Только светлая тема.

## Data Shapes

**Entities:** `InquiryStoneMini`, `InquiryChannel`, `InquiryFormValues`, `InquiryFieldErrors`, `InquiryConsent` (+ типы `InquiryChannelType`, `InquiryChannelIcon`, `InquiryState`).

**From global entities:** Inquiry (форма заявки), Stone (проекция в `InquiryStoneMini`).

## Visual Reference

См. `screenshot.png`.

## Components Provided

- `InquiryModal` — корневой компонент (состояния, overlay, focus-trap).
- `InquiryDialog` — диалоговая коробка.
- `StoneMiniCard` — мини-карточка камня (cream).
- `ChannelChipGroup` — три radio-чипа канала связи.
- `ConsentCheckbox` — чекбокс согласия 152-ФЗ.
- `SentBlock` — success-блок.

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onChange(values)` | Изменение любого поля формы |
| `onSubmit(values)` | Сабмит формы (CTA «Отправить заявку») |
| `onClose()` | Крестик / Escape / backdrop / «Закрыть» в sent |
