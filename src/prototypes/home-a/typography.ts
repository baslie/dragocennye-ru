// Варианты типографики для панели макета A: пара шрифтов, толщина, контраст.
// Всё применяется через CSS-переменные на корне макета, вёрстка от выбора не зависит.
import { useEffect, useState } from "react";

type Triple = [number, number, number]; // тонкая / обычная / плотная

interface FontPair {
  name: string;
  display: string;
  text: string;
  /** Есть ли у шрифта заголовков настоящий курсив; без него акцент только цветом. */
  italic: boolean;
  wDisplay: Triple; // H1
  wTitle: Triple; // названия камней, виды, wordmark
  wBody: Triple;
}

const MANROPE = '"Manrope", system-ui, sans-serif';
const ONEST = '"Onest", system-ui, sans-serif';

export const FONT_PAIRS: FontPair[] = [
  {
    name: "Cormorant + Manrope",
    display: '"Cormorant Garamond", Georgia, serif',
    text: MANROPE,
    italic: true,
    wDisplay: [300, 400, 500],
    wTitle: [400, 500, 600],
    wBody: [400, 400, 500],
  },
  {
    name: "Playfair + Manrope",
    display: '"Playfair Display", Georgia, serif',
    text: MANROPE,
    italic: true,
    wDisplay: [400, 450, 550],
    wTitle: [400, 500, 600],
    wBody: [400, 400, 500],
  },
  {
    name: "Spectral + Onest",
    display: '"Spectral", Georgia, serif',
    text: ONEST,
    italic: true,
    wDisplay: [200, 300, 400],
    wTitle: [300, 400, 500],
    wBody: [400, 400, 500],
  },
  {
    name: "Literata + Golos",
    display: '"Literata", Georgia, serif',
    text: '"Golos Text", system-ui, sans-serif',
    italic: true,
    wDisplay: [300, 400, 500],
    wTitle: [400, 500, 600],
    wBody: [400, 400, 500],
  },
  {
    name: "Onest",
    display: ONEST,
    text: ONEST,
    italic: false,
    wDisplay: [300, 400, 500],
    wTitle: [400, 500, 600],
    wBody: [400, 400, 500],
  },
];

export const WEIGHTS = ["Тонкая", "Обычная", "Плотная"];

// Доли чёрного для вторичного текста, меток и неактивных пунктов.
export const CONTRASTS: { name: string; ink: Triple }[] = [
  { name: "Мягкий", ink: [0.6, 0.48, 0.4] },
  { name: "Средний", ink: [0.7, 0.6, 0.52] },
  { name: "Высокий", ink: [0.8, 0.7, 0.62] },
];

/** Все шрифты панели одной ссылкой Google Fonts. */
export const TYPE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700" +
  "&family=Playfair+Display:ital,wght@0,400..700;1,400..700" +
  "&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;1,200;1,300;1,400;1,500" +
  "&family=Literata:ital,opsz,wght@0,7..72,300..600;1,7..72,300..600" +
  "&family=Manrope:wght@400..600&family=Onest:wght@300..600&family=Golos+Text:wght@400..600&display=swap";

export interface TypeState {
  f: number;
  w: number;
  c: number;
}

export const DEFAULT_TYPE: TypeState = { f: 0, w: 0, c: 0 };

const LIMITS: TypeState = { f: FONT_PAIRS.length, w: WEIGHTS.length, c: CONTRASTS.length };
const STORAGE_KEY = "home-a-type";

export function typeLabel({ f, w, c }: TypeState) {
  return `${FONT_PAIRS[f].name} · ${WEIGHTS[w].toLowerCase()} · ${CONTRASTS[c].name.toLowerCase()} контраст`;
}

/** Текст для буфера обмена: его Роман пересылает в чат, чтобы закрепить выбранную комбинацию. */
export function typeSnippet(state: TypeState) {
  const { f, w, c } = state;
  const p = FONT_PAIRS[f];
  const family = (stack: string) => stack.split(",")[0].replaceAll('"', "");
  const ink = CONTRASTS[c].ink.map((a) => `${Math.round(a * 100)}%`).join(" / ");
  return [
    `Макет A, типографика [f=${f + 1} w=${w + 1} c=${c + 1}]: ${typeLabel(state)}`,
    `- Заголовки: ${family(p.display)}, H1 ${p.wDisplay[w]}, названия ${p.wTitle[w]}`,
    `- Текст: ${family(p.text)}, ${p.wBody[w]}`,
    `- Серый текст: ${ink} чёрного (вторичный / метки / неактивный)`,
    `- Ссылка: ${location.origin}${location.pathname}?f=${f + 1}&w=${w + 1}&c=${c + 1}`,
  ].join("\n");
}

export function typographyVars({ f, w, c }: TypeState): Record<string, string | number> {
  const p = FONT_PAIRS[f];
  const ink = CONTRASTS[c].ink;
  return {
    "--font-display": p.display,
    "--font-text": p.text,
    "--em-style": p.italic ? "italic" : "normal",
    "--w-display": p.wDisplay[w],
    "--w-title": p.wTitle[w],
    "--w-body": p.wBody[w],
    "--ink-2": `rgba(0,0,0,${ink[0]})`,
    "--ink-3": `rgba(0,0,0,${ink[1]})`,
    "--ink-4": `rgba(0,0,0,${ink[2]})`,
  };
}

// Параметры в URL записываются с единицы: ?f=3&w=2&c=2.
function parse(source: { get(key: string): string | null }): TypeState | null {
  const out = { ...DEFAULT_TYPE };
  let found = false;
  for (const key of ["f", "w", "c"] as const) {
    const n = Number(source.get(key)) - 1;
    if (Number.isInteger(n) && n >= 0 && n < LIMITS[key]) {
      out[key] = n;
      found = true;
    }
  }
  return found ? out : null;
}

/** Состояние панели: из URL, иначе из localStorage; при изменении пишется в оба места. */
export function useTypography() {
  const [state, setState] = useState(DEFAULT_TYPE);

  useEffect(() => {
    let stored: TypeState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = parse(new URLSearchParams(raw));
    } catch {}
    const initial = parse(new URLSearchParams(location.search)) ?? stored;
    if (initial) setState(initial);
  }, []);

  const update = (next: TypeState) => {
    setState(next);
    const params = new URLSearchParams(location.search);
    (["f", "w", "c"] as const).forEach((k) => params.set(k, String(next[k] + 1)));
    history.replaceState(null, "", `${location.pathname}?${params}`);
    try {
      localStorage.setItem(STORAGE_KEY, params.toString());
    } catch {}
  };

  return [state, update] as const;
}
