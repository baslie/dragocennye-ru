// Кадры камня. На десктопе — кадры 3:2 друг под другом (исходники горизонтальные 1680×1120,
// в 4:5 они обрезались бы и растягивались), на телефоне — горизонтальная лента 4:5 со snap и счётчиком.
// Клик по кадру открывает лайтбокс. Камень без фото — один крупный заполнитель.
import { useRef, useState } from "react";
import { stoneCode } from "../../lib/format";
import { NoPhoto } from "../ui";
import type { StoneDetail, StoneMedia } from "./types";

interface Props {
  stone: StoneDetail;
  /** Только настоящие снимки, без PNG-заглушки. */
  media: StoneMedia[];
  hex: string;
  onOpen: (index: number) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function StoneGallery({ stone, media, hex, onOpen }: Props) {
  const [current, setCurrent] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  if (media.length === 0) {
    return (
      <div className="-mx-[var(--gutter)] aspect-[4/5] md:aspect-[3/2] lg:mx-0 lg:aspect-[4/5]">
        <NoPhoto size="large" code={stoneCode(stone.slug)} weightCt={stone.weightCt} dimensionsMm={stone.dimensionsMm} hex={hex} />
      </div>
    );
  }

  const onScroll = () => {
    const el = railRef.current;
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <>
      {/* Телефон и планшет: горизонтальная лента */}
      <div className="relative -mx-[var(--gutter)] lg:hidden">
        <div
          ref={railRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {media.map((m, i) => (
            <Frame key={m.id} m={m} i={i} onOpen={onOpen} name={stone.name} className="aspect-[4/5] w-full shrink-0 snap-center md:aspect-[3/2]" />
          ))}
        </div>
        {media.length > 1 && (
          <span className="absolute bottom-4 right-[var(--gutter)] bg-white/90 px-2 py-1 text-[12px] leading-[150%] tracking-[0.08em]">
            {pad(current + 1)} / {pad(media.length)}
          </span>
        )}
      </div>

      {/* Десктоп: все кадры друг под другом */}
      <div className="hidden flex-col gap-[clamp(12px,1vw,24px)] lg:flex">
        {media.map((m, i) => (
          <Frame key={m.id} m={m} i={i} onOpen={onOpen} name={stone.name} className="aspect-[3/2]" />
        ))}
      </div>
    </>
  );
}

function Frame({
  m,
  i,
  name,
  onOpen,
  className = "",
}: {
  m: StoneMedia;
  i: number;
  name: string;
  onOpen: (i: number) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(i)}
      aria-label={`Открыть кадр ${i + 1}: ${m.alt || name}`}
      className={`group relative block cursor-zoom-in overflow-hidden bg-neutral-100 ${className}`}
    >
      <img
        src={m.url}
        alt={m.alt || name}
        loading={i === 0 ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
      />
    </button>
  );
}
