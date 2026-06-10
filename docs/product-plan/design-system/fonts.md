# Typography Configuration

## Google Fonts Import

Добавьте в `<head>` (или эквивалент `_document.tsx` / `index.html` / layout):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

## Назначение шрифтов

| Шрифт | Роль | Где |
|---|---|---|
| **Noto Sans** | Заголовки и body | Wordmark, навигация, H1–H4, названия камней, editorial-параграфы, кнопки, тизеры |
| **Noto Sans Mono** | Технические/мета-подписи | Подзаголовок «коллекция цветных камней», breadcrumb, мета-строки (дата · вес · цена), labels паспорта, счётчики, чипы фильтра, TOC-заголовки |

Weights Noto Sans: 300–800 (заголовки часто `font-medium` = 500). Noto Sans Mono: 400–600.

## Типографические паттерны

- **Wordmark:** Noto Sans, `tracking-[0.12em]`, `text-5xl md:text-7xl`, `font-medium`
- **H1 страниц:** `text-4xl md:text-5xl xl:text-6xl font-medium` (Noto Sans), цвет `stone-900`
- **Мета-подпись:** Noto Sans Mono, `text-xs uppercase tracking-wider`, цвет `#576A8F` (steel) или `stone-500`
- **Цена:** Noto Sans Mono для подписи, крупная цифра — `font-medium text-[#576A8F]`. Формат `{amount} ₽` с неразрывными пробелами (` `) как разделителем тысяч
- **Reading column:** `text-lg leading-relaxed text-stone-800`, ограничение ширины `max-w-[72ch]`

## CSS

```css
:root {
  --font-heading: 'Noto Sans', sans-serif;
  --font-body: 'Noto Sans', sans-serif;
  --font-mono: 'Noto Sans Mono', monospace;
}
```
