import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { buttonClass } from "./Links";

// Пауза перед подгрузкой: данные локальные, без неё спиннер мелькал бы незаметно.
const LOAD_DELAY = 600;

/** «Показать ещё» с автоподгрузкой: когда кнопка доезжает до экрана, в ней крутится спиннер и подгружается следующая порция. */
export function LoadMore({ onLoad }: { onLoad: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  // Наблюдатель пересоздаётся после каждой порции: если кнопка всё ещё на экране, грузим дальше.
  useEffect(() => {
    if (loading || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoading(true), { rootMargin: "0px 0px 120px 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => {
      onLoadRef.current();
      setLoading(false);
    }, LOAD_DELAY);
    return () => window.clearTimeout(id);
  }, [loading]);

  return (
    <div className="mt-20 flex justify-center">
      <button
        ref={ref}
        type="button"
        onClick={() => setLoading(true)}
        disabled={loading}
        aria-busy={loading}
        className={`${buttonClass("outline")} min-w-[200px]`}
      >
        {loading ? (
          <>
            <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={1.5} aria-hidden />
            Загружаем
          </>
        ) : (
          "Показать ещё"
        )}
      </button>
    </div>
  );
}

// Число колонок STONE_GRID — совпадает с его брейкпоинтами.
const COLUMN_QUERIES: [string, number][] = [
  ["(min-width: 1440px)", 4],
  ["(min-width: 1024px)", 3],
];

export function useGridColumns() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const lists = COLUMN_QUERIES.map(([q]) => window.matchMedia(q));
    const update = () => setCols(COLUMN_QUERIES.find((_, i) => lists[i].matches)?.[1] ?? 2);
    update();
    lists.forEach((l) => l.addEventListener("change", update));
    return () => lists.forEach((l) => l.removeEventListener("change", update));
  }, []);
  return cols;
}
