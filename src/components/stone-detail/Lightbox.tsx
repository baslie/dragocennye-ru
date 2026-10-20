// Лайтбокс: кадр целиком на тёмном фоне. Esc закрывает, стрелки и свайп листают.
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { StoneMedia } from "./types";

interface LightboxProps {
  media: StoneMedia[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

const SWIPE_PX = 48;
const pad = (n: number) => String(n).padStart(2, "0");

export function Lightbox({ media, index, onClose, onNavigate }: LightboxProps) {
  const touchX = useRef<number | null>(null);
  const prev = () => index > 0 && onNavigate(index - 1);
  const next = () => index < media.length - 1 && onNavigate(index + 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const current = media[index];
  if (!current) return null;

  const arrow = "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/60 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-20 md:flex";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр кадров"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (dx > SWIPE_PX) prev();
        else if (dx < -SWIPE_PX) next();
      }}
    >
      <div className="flex items-center justify-between px-[var(--gutter)] py-5 text-white/60">
        <span className="text-[13px] leading-[150%] tracking-[0.08em]">
          {pad(index + 1)} / {pad(media.length)}
        </span>
        <button type="button" onClick={onClose} aria-label="Закрыть" className="transition-colors hover:text-white">
          <X className="h-6 w-6" strokeWidth={1.25} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)]">
        <img
          src={current.url}
          alt={current.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full object-contain"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          disabled={index === 0}
          className={`${arrow} left-4`}
          aria-label="Предыдущий кадр"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={1} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          disabled={index === media.length - 1}
          className={`${arrow} right-4`}
          aria-label="Следующий кадр"
        >
          <ChevronRight className="h-8 w-8" strokeWidth={1} />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 px-[var(--gutter)] pb-6 pt-5" onClick={(e) => e.stopPropagation()}>
        {media.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onNavigate(i)}
            aria-label={`Кадр ${i + 1}`}
            aria-current={i === index}
            className="group/dot flex h-4 w-10 items-center"
          >
            <span className={`h-px w-full transition-colors ${i === index ? "bg-white" : "bg-white/30 group-hover/dot:bg-white/70"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
