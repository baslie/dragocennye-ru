// Слайд-шоу во вступлении: «живые» кадры камней (в руке, в кольце, на коралле), 16:9.
// Кадры сменяются плавным наплывом каждые 5 секунд; при наведении и при reduced motion стоят.
// Подпись и переключатели лежат внутри кадра, на затемнении снизу.
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
    <div
      className="relative aspect-video overflow-hidden bg-neutral-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a href={current.href} className="absolute inset-0 block" aria-label={current.name}>
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
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-4 px-[clamp(16px,1.4vw,28px)] pb-[clamp(26px,2vw,40px)] text-white">
          <span className="text-[clamp(18px,1.1vw,22px)] leading-[120%]" style={titleStyle}>
            {current.name}
          </span>
          <span className="shrink-0 text-[clamp(13px,0.72vw,18px)] leading-[150%] text-white/80">{formatCt(current.weightCt)}</span>
        </div>
      </a>
      {/* Переключатели — отдельно от ссылки, чтобы клик по полоске не уводил на страницу камня. */}
      <div
        className="absolute inset-x-0 bottom-0 flex gap-1.5 px-[clamp(16px,1.4vw,28px)] pb-[clamp(8px,0.6vw,14px)]"
        role="tablist"
        aria-label="Кадры"
      >
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
            <span className={`h-px w-full transition-colors ${i === index ? "bg-white" : "bg-white/35 group-hover/dot:bg-white/70"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
