# CLAUDE.md — проект dragocennye

## Запуск dev-сервера

Запускать dev-сервер **только на `127.0.0.1`**, а не на дефолтном `localhost` (`::1`):

```bash
npm run dev -- --host 127.0.0.1
```

Причина: на Windows Astro по умолчанию слушает IPv6 (`::1`), из-за чего `curl`,
Playwright и прочие инструменты, обращающиеся к `127.0.0.1`, не достучатся до
сервера. Явный `--host 127.0.0.1` биндит на IPv4.

Сервер будет доступен по адресу: http://127.0.0.1:4321/dragocennye-ru/

## Публикация и base-путь

- Сайт публикуется на GitHub Pages по адресу https://roman-purtow.ru/dragocennye-ru/
  (домен `roman-purtow.ru` закреплён за `baslie.github.io`, а проектный репозиторий отдаётся в подпапке).
  Деплой выполняет `.github/workflows/deploy.yml` при каждом push в `main`.
- В `astro.config.mjs` задан `base: '/dragocennye-ru'`. Поэтому внутренние ссылки и пути к файлам из `public/`
  пишем от корня сайта (`"/catalog/sapfir"`, `"/images/..."`) и **обязательно** оборачиваем в `withBase()`
  из `src/lib/format.ts`. Текущий путь перед сравнением очищаем через `stripBase()`.
  Исключение: проп `path` у `BaseLayout`, там база добавляется сама.

## Дизайн-система «Ювелирный дом»

- Токены — в `src/styles/global.css` (`@theme`): `ink #121314`, `emerald #0d5c4b` (единственный акцент),
  `paper #f3f1ec` (тёплый лист), `danger`. Шрифты: `font-serif` = Spectral (300/400 + курсив),
  `font-sans` = Onest (400/500). Боковой отступ — `px-[var(--gutter)]`.
- Hex-цвета в компонентах не пишем — только токены и `text-black/NN` для оттенков серого.
- Кегль и интерлиньяж — из шкалы `T` в `src/components/ui/type.ts`. Интерлиньяж всегда в процентах
  и на том же элементе, что и кегль.
- Общие кирпичи — `src/components/ui/` (StoneCard, NoPhoto, Chips, Select, LoadMore, кнопки, крошки).
  Форматтеры и `hasPhoto` — `src/lib/format.ts`.
- Скругления — только у чипов-пилюль и цветовых кружков. Тени не используем, разделяем тонкими линиями `HAIRLINE`.
