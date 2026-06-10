# Tailwind Color Configuration

> **Tailwind CSS v4** — без `tailwind.config.js`. Кастомные акценты задаются hex-значениями
> прямо в утилитах (`bg-[#FF7444]`) или через `@theme` в CSS. Нейтрали берутся из встроенной
> stone-палитры.

## Палитра

«Драгоценные» используют строго белый canvas и **4 кастомных hex-акцента**. Tailwind-имена ниже —
лишь ближайшие приближения; в реальной реализации применяйте hex.

| Роль | Hex | Tailwind-приближение | Где используется |
|---|---|---|---|
| **Canvas** | `#FFFFFF` | `white` | Фон всего сайта (только светлая тема) |
| **Coral (primary)** | `#FF7444` | `orange-500` | Primary CTA, hover-цена карточек, hover-навигация, NEW-бейджи |
| **Steel (secondary/brand)** | `#576A8F` | `slate-500` | Цена, бренд, активная навигация, активный TOC/breadcrumb, outline вторичных кнопок |
| **Periwinkle** | `#B7BDF7` | `indigo-200` | Мягкий фон активного чипа фильтра, бейджи поверх тёмных обложек |
| **Cream** | `#FFF8DE` | `amber-50` | Фон блока сертификата, stone mini-card, CTA-блоков, empty-state, цитат |
| **Neutral** | stone-палитра | `stone-*` | Текст, бордеры, вторичные поверхности |

## Семантические нейтрали (stone)

- **Основной текст:** `text-stone-900`
- **Вторичный текст:** `text-stone-600` / `text-stone-500`
- **Приглушённый / плейсхолдеры:** `text-stone-400`
- **Бордеры:** `border-stone-200`
- **Мягкие поверхности:** `bg-stone-50`, `bg-stone-100`

## Примеры использования

```html
<!-- Primary CTA (coral) -->
<button class="bg-[#FF7444] hover:bg-[#e6643a] text-white px-6 py-4 rounded-lg font-medium">
  Оставить заявку
</button>

<!-- Цена / brand (steel) -->
<span class="text-4xl font-medium text-[#576A8F]">58 200 ₽</span>

<!-- Активный чип фильтра (periwinkle + steel) -->
<button class="bg-[#B7BDF7]/30 border border-[#576A8F] text-[#576A8F] rounded-full px-4 py-2">
  Сапфир
</button>

<!-- Карточка сертификата / cream -->
<div class="bg-[#FFF8DE] border border-stone-200 rounded-lg p-8">…</div>

<!-- Outline вторичной кнопки (steel) -->
<button class="border border-[#576A8F] text-[#576A8F] hover:bg-[#576A8F] hover:text-white px-8 py-4 rounded-lg">
  Все сапфиры в каталоге
</button>
```

## Immersive-hero overlay

Тёмная вуаль поверх обложек (featured-пост, шапка поста) — приём ради читаемости белого текста,
**не dark-mode**:

```html
<div class="bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent">…</div>
```

## Что НЕ делать

- ❌ Не добавляйте `dark:`-варианты — тёмной темы в продукте нет (сознательное решение).
- ❌ Не определяйте кастомные именованные цвета вне 4 акцентов выше.
- ❌ Не используйте `tailwind.config.js` (Tailwind v4).
