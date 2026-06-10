import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { formatPrice, formatWeight } from "../../lib/format";
import { StonePhoto } from "../common/StonePhoto";

export interface SearchItem {
  slug: string;
  name: string;
  varietyName: string;
  colorName: string;
  colorHex: string;
  price: number;
  weightCt: number;
  photoUrl: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function SearchModal({ isOpen, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.varietyName.toLowerCase().includes(q) ||
          it.colorName.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [query, items]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-stone-950/50 px-4 pt-20 backdrop-blur-sm md:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label="Поиск по каталогу"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10">
        <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
          <Search size={20} strokeWidth={1.75} className="shrink-0 text-stone-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Сапфир, зелёный, падпараджа…"
            className="w-full bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
            style={{ fontFamily: "'Noto Sans', sans-serif" }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="shrink-0 text-stone-400 transition-colors hover:text-[#FF7444]"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <p className="px-5 py-8 text-center text-sm text-stone-400" style={{ fontFamily: "'Noto Sans Mono', monospace" }}>
              Начните вводить название, вид или цвет камня
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-stone-500">
              По запросу «{query}» ничего не нашлось
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {results.map((it) => (
                <li key={it.slug}>
                  <a
                    href={`/stones/${it.slug}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[#FFF8DE]/60"
                  >
                    <div className="h-14 w-12 shrink-0 overflow-hidden rounded-md">
                      <StonePhoto src={it.photoUrl} alt={it.name} accentHex={it.colorHex} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-900">{it.name}</p>
                      <p className="mt-0.5 text-xs text-stone-500" style={{ fontFamily: "'Noto Sans Mono', monospace" }}>
                        {it.varietyName} · {formatWeight(it.weightCt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-[#576A8F]" style={{ fontFamily: "'Noto Sans Mono', monospace" }}>
                      {formatPrice(it.price)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
