import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { formatCt, formatPrice, hasPhoto } from "../../lib/format";
import { HAIRLINE, NoPhoto, T } from "../ui";

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
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 px-[var(--gutter)] pt-16 md:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Поиск по каталогу"
    >
      <div className="w-full max-w-[720px] bg-white">
        <div className={`flex items-center gap-4 border-b ${HAIRLINE} px-6 py-5`}>
          <Search className="h-5 w-5 shrink-0 text-black/40" strokeWidth={1.5} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Сапфир, зелёный, падпараджа…"
            aria-label="Что ищем"
            className="w-full bg-transparent font-serif text-[clamp(22px,1.6vw,30px)] font-light leading-[120%] outline-none placeholder:text-black/30"
          />
          <button type="button" onClick={onClose} aria-label="Закрыть" className="shrink-0 text-black/40 transition-colors hover:text-black">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <p className={`px-6 py-10 text-center ${T.ui} text-black/48`}>Начните вводить название, вид или цвет камня</p>
          ) : results.length === 0 ? (
            <p className={`px-6 py-10 text-center ${T.ui} text-black/60`}>По запросу «{query}» ничего не нашлось</p>
          ) : (
            <ul>
              {results.map((it) => (
                <li key={it.slug} className={`border-b ${HAIRLINE} last:border-b-0`}>
                  <a href={`/stones/${it.slug}`} className="flex items-center gap-5 px-6 py-3 transition-colors hover:bg-paper">
                    <div className="h-16 w-[52px] shrink-0 overflow-hidden bg-neutral-100">
                      {hasPhoto(it.photoUrl) ? (
                        <img src={it.photoUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <NoPhoto size="thumb" code="" weightCt={it.weightCt} hex={it.colorHex} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-serif text-[clamp(17px,1vw,20px)] leading-[120%]">{it.name}</p>
                      <p className={`mt-1 ${T.label}`}>
                        {it.varietyName} · {formatCt(it.weightCt)}
                      </p>
                    </div>
                    <span className={`shrink-0 font-medium ${T.ui}`}>{formatPrice(it.price)}</span>
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
