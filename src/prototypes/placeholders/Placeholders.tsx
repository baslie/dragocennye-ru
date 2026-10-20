// Пять вариантов заполнителя для карточки камня без фото, в стиле макета A.
// В каждом ряду реальные фото чередуются с заполнителями, чтобы видеть их в сетке.
import type { ReactNode } from "react";
import { formatCt, formatPrice } from "../useCatalogState";
import type { Stone } from "../../components/catalog/types";

interface Props {
  photoStones: Stone[];
  noPhotoStones: Stone[];
  varietyNames: Record<string, string>;
  colorHex: Record<string, string>;
}

const INK = "#121314";
const PAPER = "#f3f1ec";
const SPECTRAL = '"Spectral", Georgia, serif';
const ONEST = '"Onest", system-ui, sans-serif';

type Ctx = { stone: Stone; variety: string; hex: string };

const VARIANTS: { name: string; note: string; render: (c: Ctx) => ReactNode }[] = [
  {
    name: "Чертёж огранки",
    note: "Тонкий линейный рисунок огранки сверху, как в паспорте гемолога. Нейтрально и в тему.",
    render: () => (
      <Frame bg={PAPER}>
        <Cut className="w-[38%]" stroke="rgba(0,0,0,0.22)" />
      </Frame>
    ),
  },
  {
    name: "Свечение цвета",
    note: "Мягкое пятно цвета камня на светлом фоне и тихая подпись. Сетка остаётся цветной.",
    render: ({ hex }) => (
      <Frame bg={PAPER}>
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 50% 46%, ${hex}55 0%, ${hex}1f 28%, transparent 62%)` }}
        />
        <Caption>Фото готовится</Caption>
      </Frame>
    ),
  },
  {
    name: "Монограмма",
    note: "Крупная первая буква вида тонким Spectral. Похоже на обложку ювелирного каталога.",
    render: ({ variety }) => (
      <Frame bg={PAPER}>
        <span className="text-[clamp(120px,9vw,200px)] font-light leading-[100%] text-black/[0.13]" style={{ fontFamily: SPECTRAL }}>
          {variety.charAt(0)}
        </span>
      </Frame>
    ),
  },
  {
    name: "Паспорт камня",
    note: "Вместо картинки ключевые цифры: номер, вес, размер. Честно и полезно для покупателя.",
    render: ({ stone }) => (
      <Frame bg={PAPER}>
        <div className="flex flex-col items-center text-center">
          <span className="text-[12px] uppercase leading-[150%] tracking-[0.18em] text-black/45" style={{ fontFamily: ONEST }}>
            № {stone.slug.split("-")[0]}
          </span>
          <span className="mt-3 text-[clamp(40px,3vw,64px)] font-light leading-[100%]" style={{ fontFamily: SPECTRAL }}>
            {formatCt(stone.weightCt)}
          </span>
          {stone.dimensionsMm && (
            <span className="mt-3 text-[13px] leading-[150%] text-black/55" style={{ fontFamily: ONEST }}>
              {stone.dimensionsMm.replaceAll(".", ",")} мм
            </span>
          )}
        </div>
        <Caption>Фото готовится</Caption>
      </Frame>
    ),
  },
  {
    name: "Огранка в цвете камня",
    note: "Чертёж огранки, окрашенный в цвет камня, на лёгком тоне того же цвета. Сочетание вариантов 1 и 2.",
    render: ({ hex }) => (
      <Frame bg={`color-mix(in srgb, ${hex} 9%, #faf9f6)`}>
        <Cut className="w-[42%]" stroke={hex} opacity={0.75} />
      </Frame>
    ),
  },
];

export function Placeholders({ photoStones, noPhotoStones, varietyNames, colorHex }: Props) {
  return (
    <div className="min-h-[100dvh] bg-white px-[clamp(20px,3.5vw,96px)] pb-24 antialiased" style={{ color: INK, fontFamily: ONEST }}>
      <header className="border-b border-black/[0.07] py-10">
        <h1 className="text-[clamp(36px,3vw,64px)] font-light leading-[100%]" style={{ fontFamily: SPECTRAL }}>
          Заполнитель для камней без фото
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-[155%] text-black/60">
          Сейчас у {noPhotoStones.length} камней вместо фото серая иконка фотоаппарата. Ниже пять вариантов замены.
          В каждом ряду заполнители стоят между настоящими фото. Выберите номер.
        </p>
      </header>

      {VARIANTS.map((v, i) => (
        <section key={v.name} className="border-b border-black/[0.07] py-12">
          <div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="text-[clamp(28px,2vw,40px)] font-light leading-[110%]" style={{ fontFamily: SPECTRAL, color: "#0d5c4b" }}>
              {i + 1}
            </span>
            <h2 className="text-[clamp(24px,1.6vw,32px)] leading-[110%]" style={{ fontFamily: SPECTRAL }}>
              {v.name}
            </h2>
            <p className="text-[15px] leading-[155%] text-black/60">{v.note}</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-[clamp(32px,2.2vw,56px)] min-[1024px]:grid-cols-4">
            {[photoStones[i * 2], noPhotoStones[i * 2], photoStones[i * 2 + 1], noPhotoStones[i * 2 + 1]].map((s, k) => (
              <Card
                key={s.id}
                stone={s}
                variety={varietyNames[s.varietyId]}
                media={
                  k % 2 === 0 ? (
                    <img src={s.photoUrl} alt={s.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    v.render({ stone: s, variety: varietyNames[s.varietyId], hex: colorHex[s.colorId] ?? "#8a8a8a" })
                  )
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Card({ stone, variety, media }: { stone: Stone; variety: string; media: ReactNode }) {
  return (
    <li>
      <div className="aspect-[4/5] overflow-hidden bg-neutral-100">{media}</div>
      <p className="mt-3 text-[clamp(11px,0.6vw,14px)] uppercase leading-[150%] tracking-[0.14em] text-black/48">{variety}</p>
      <h3 className="mt-1 text-[clamp(22px,1.5vw,30px)] leading-[110%]" style={{ fontFamily: SPECTRAL }}>
        {stone.name}
      </h3>
      <p className="mt-2 flex gap-x-4 text-[clamp(13px,0.72vw,18px)] leading-[150%] text-black/60">
        <span>{formatCt(stone.weightCt)}</span>
        <span className="font-medium" style={{ color: INK }}>{formatPrice(stone.price)}</span>
      </p>
    </li>
  );
}

function Frame({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ background: bg }}>
      {children}
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <span className="absolute bottom-5 left-0 right-0 text-center text-[12px] leading-[150%] tracking-[0.04em] text-black/45">
      {children}
    </span>
  );
}

/** Огранка «кругляк» сверху: рундист, площадка, звёздные и основные грани. */
function Cut({ className, stroke, opacity = 1 }: { className: string; stroke: string; opacity?: number }) {
  const pt = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [50 + 46 * r * Math.cos(a), 50 + 46 * r * Math.sin(a)].map((n) => n.toFixed(2)).join(",");
  };
  const angles = Array.from({ length: 8 }, (_, i) => 22.5 + i * 45);
  const table = angles.map((a) => pt(0.52, a)).join(" ");
  const lines = angles.flatMap((a) => [
    [pt(0.52, a), pt(0.86, a + 22.5)], // звёздные грани
    [pt(0.52, a), pt(0.86, a - 22.5)],
    [pt(0.86, a + 22.5), pt(1, a)], // основные грани короны
    [pt(0.86, a + 22.5), pt(1, a + 45)],
  ]);
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke={stroke} strokeWidth={0.6} opacity={opacity} aria-hidden>
      <circle cx="50" cy="50" r="46" />
      <polygon points={table} />
      {lines.map(([a, b], i) => (
        <polyline key={i} points={`${a} ${b}`} />
      ))}
    </svg>
  );
}
