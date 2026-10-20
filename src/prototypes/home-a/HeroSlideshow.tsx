// Слайд-шоу во вступлении: «живые» кадры камней (в руке, в кольце, на коралле), 16:9.
// Кадры сменяются плавным наплывом каждые 5 секунд; при наведении и при reduced motion стоят.
import { useEffect, useState, type CSSProperties } from "react";
import { formatCt } from "../useCatalogState";

export interface HeroSlide {
  href: string;
  src: string;
  name: string;
  weightCt: number;
}

const INTERVAL = 5000;

export function HeroSlideshow({ slides, titleStyle }: { slides: HeroSlide[]; titleStyle: CSSProperties }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused, slides.length]);

  const current = slides[index];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <a href={current.href} className="relative block aspect-video overflow-hidden bg-neutral-100" aria-label={current.name}>
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={i === index ? s.name : ""}
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </a>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <a href={current.href} className="text-[clamp(18px,1.1vw,22px)] leading-[120%]" style={titleStyle}>
          {current.name}
        </a>
        <span className="shrink-0 text-[clamp(13px,0.72vw,18px)] text-black/60 leading-[150%]">{formatCt(current.weightCt)}</span>
      </div>
      <div className="mt-3 flex gap-1.5" role="tablist" aria-label="Кадры">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1}: ${s.name}`}
            onClick={() => setIndex(i)}
            className="group/dot flex h-4 flex-1 items-center"
          >
            <span
              className={`h-px w-full transition-colors ${i === index ? "bg-[#121314]" : "bg-black/15 group-hover/dot:bg-black/40"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
