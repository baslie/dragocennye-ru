# Test Specs: Inquiry

Эти спеки **framework-agnostic** — адаптируйте под свой стек.

## Overview

Inquiry — модалка одно-камневой заявки с четырьмя состояниями (idle / loading / sent / error),
обязательным согласием 152-ФЗ, focus-trap и bottom-sheet на mobile. Проверяем заполнение, сабмит,
успех, ошибки валидации и сети, закрытие и доступность.

---

## User Flow Tests

### Flow 1: Успешная заявка

**Scenario:** Клиент оставляет заявку на «Зелёный сапфир».

#### Success Path

**Setup:**
- `isOpen: true`, `stone` = `{ id: "st-0102", name: "Зелёный сапфир", weightCt: 3.63, cutName: "Овал", price: 40800 }`.
- `state: 'idle'`, `values` пустые, `channels` = Telegram / WhatsApp / Телефон.

**Steps:**
1. Модалка открывается; автофокус на поле «Имя».
2. Клиент видит mini-карточку камня (фото, «Зелёный сапфир», «3.63 ct · Овал», «40 800 ₽»).
3. Вводит имя «Анна», контакт «@anna_collects», выбирает radio-чип «Telegram», проставляет согласие.
4. Нажимает «Отправить заявку».

**Expected Results:**
- [ ] Каждое изменение поля вызывает `onChange` с новым snapshot `values`.
- [ ] До согласия CTA disabled (`bg-stone-300`, курсор not-allowed); после — активна, текст «Отправить заявку».
- [ ] Клик по CTA вызывает `onSubmit(values)`.
- [ ] При `state: 'loading'` поля и чекбокс disabled, в кнопке спиннер `Loader2` + «Отправляем…».
- [ ] Backdrop-клик и Escape в `loading` НЕ закрывают модалку.
- [ ] При `state: 'sent'` форма и footer заменяются success-блоком: «Заявка отправлена», «Спасибо!», текст «Дмитрий свяжется с вами в течение 2 часов … — Telegram.», кнопка «Закрыть».
- [ ] Header и mini-карточка камня остаются видны в `sent`.

---

### Flow 2: Ошибка валидации

**Setup:** `state: 'error'`, `fieldErrors` = `{ contact: "Укажите телефон, @username или email", channel: "Выберите удобный канал связи", consent: "Подтвердите согласие на обработку персональных данных" }`.

**Expected Results:**
- [ ] Поля с ошибкой получают красный бордер (`border-red-400`) и красную подпись под ними.
- [ ] `aria-invalid="true"` и `aria-describedby` связывают поле с текстом ошибки.
- [ ] Форма остаётся заполненной; CTA активен; клиент может исправить и отправить заново.

---

### Flow 3: Сетевая ошибка

**Setup:** `state: 'error'`, `errorMessage` = «Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.», без `fieldErrors`.

**Expected Results:**
- [ ] Над формой — баннер с иконкой `AlertCircle` и текстом ошибки (`role="alert"`).
- [ ] Поля сохраняют введённые значения; CTA снова активен.

---

## Empty / Disabled State Tests

### Согласие не проставлено

**Setup:** `values.consent === false`, остальные поля заполнены.

**Expected Results:**
- [ ] CTA «Отправить заявку» disabled.

### Модалка закрыта

**Setup:** `isOpen === false`.

**Expected Results:**
- [ ] Компонент ничего не рендерит (нет backdrop/диалога в DOM).

---

## Component Interaction Tests

### ChannelChipGroup

- [ ] Три чипа: Telegram (`Send`), WhatsApp (`MessageCircle`), Телефон (`Phone`).
- [ ] Выбранный чип — `border-[#FF7444] bg-[#FF7444]/5 text-[#FF7444]`.
- [ ] `role="radiogroup"`, выбор обновляет `values.channel` через `onChange`.

### ConsentCheckbox

- [ ] Кастомный квадратик; checked — `bg-[#576A8F]` с белой галочкой `Check`.
- [ ] Текст содержит ссылку на политику конфиденциальности (`target="_blank" rel="noopener"`).
- [ ] При `fieldErrors.consent` — красная подпись под чекбоксом.

### Закрытие

- [ ] Крестик `X` в header вызывает `onClose`.
- [ ] Escape (вне `loading`) вызывает `onClose`.
- [ ] Клик по backdrop (вне `loading`) вызывает `onClose`.
- [ ] «Закрыть» в sent-state вызывает `onClose`.

---

## Edge Cases

- [ ] Очень длинное название камня в mini-карточке — `truncate`.
- [ ] Mobile (< 640px): overlay `items-end`, диалог bottom-sheet `rounded-t-2xl`; mini-карточка вертикальная.
- [ ] Переход `error` → исправление → `loading` → `sent` без потери данных.
- [ ] Комментарий опционален — пустой не блокирует сабмит.

---

## Accessibility Checks

- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby` на H2 заголовке.
- [ ] Focus-trap: Tab/Shift+Tab зациклены внутри диалога.
- [ ] Автофокус: `idle` → «Имя», `sent` → «Закрыть».
- [ ] При закрытии фокус возвращается на триггерный CTA в Stone Detail (ответственность родителя).
- [ ] Body получает `overflow-hidden` пока модалка открыта.

---

## Sample Test Data

См. `sample-data.json`: `stone`, `channels[3]`, `formInitial`, `formPrefilled`, `fieldErrorsExample`,
`successMessage`, `networkErrorMessage`, `consent`.

```typescript
const mockStone = { id: "st-0102", name: "Зелёный сапфир", weightCt: 3.63, cutName: "Овал", photoUrl: "…", price: 40800 };
const mockPrefilled = { name: "Анна", contact: "@anna_collects", channel: "telegram", comment: "…", consent: true };
const mockFieldErrors = { contact: "Укажите телефон, @username или email", channel: "Выберите удобный канал связи", consent: "Подтвердите согласие на обработку персональных данных" };
```
