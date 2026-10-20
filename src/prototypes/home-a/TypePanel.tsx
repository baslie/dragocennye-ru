// Плавающая панель для сравнения типографики макета. Набрана системным шрифтом,
// чтобы не смешиваться с проверяемыми вариантами.
import { useEffect, useState } from "react";
import { CONTRASTS, DEFAULT_TYPE, FONT_PAIRS, WEIGHTS, typeLabel, typeSnippet, type TypeState } from "./typography";

export function TypePanel({ state, onChange }: { state: TypeState; onChange: (s: TypeState) => void }) {
  const [open, setOpen] = useState(false);
  // На десктопе панель сразу открыта, на телефоне свёрнута в кнопку «Aa», чтобы не закрывать макет.
  useEffect(() => setOpen(window.matchMedia("(min-width: 768px)").matches), []);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeSnippet(state));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const set = (key: keyof TypeState, value: number) => onChange({ ...state, [key]: value });

  return (
    <div
      className="fixed bottom-4 right-4 z-50 text-[13px] leading-[140%] text-neutral-900"
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", fontWeight: 400 }}
    >
      {open ? (
        <div className="w-[min(340px,calc(100vw-32px))] rounded-xl border border-black/10 bg-white/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.14)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">Типографика</span>
            <div className="flex gap-3 text-neutral-500">
              <button type="button" onClick={() => onChange(DEFAULT_TYPE)} className="hover:text-neutral-900">
                Сбросить
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Свернуть панель" className="hover:text-neutral-900">
                ✕
              </button>
            </div>
          </div>

          <Group label="Шрифты">
            <div className="flex flex-col gap-1">
              {FONT_PAIRS.map((p, i) => (
                <Option key={p.name} active={state.f === i} onClick={() => set("f", i)} className="text-left">
                  <span className="text-neutral-400">{i + 1}.</span> {p.name}
                </Option>
              ))}
            </div>
          </Group>

          <Group label="Толщина">
            <Segments items={WEIGHTS} value={state.w} onSelect={(i) => set("w", i)} />
          </Group>

          <Group label="Контраст">
            <Segments items={CONTRASTS.map((c) => c.name)} value={state.c} onSelect={(i) => set("c", i)} />
          </Group>

          <div className="mt-3 border-t border-black/10 pt-3">
            <p className="text-[12px] text-neutral-500">{typeLabel(state)}</p>
            <button
              type="button"
              onClick={copy}
              className="mt-2 w-full rounded-md bg-neutral-900 px-3 py-2 font-medium text-white transition-colors hover:bg-neutral-700"
            >
              {copied ? "Скопировано — вставьте в чат" : "Скопировать вариант"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Открыть панель типографики"
          className="h-11 w-11 rounded-full border border-black/10 bg-white text-[16px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        >
          Aa
        </button>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">{label}</p>
      {children}
    </div>
  );
}

function Segments({ items, value, onSelect }: { items: string[]; value: number; onSelect: (i: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((item, i) => (
        <Option key={item} active={value === i} onClick={() => onSelect(i)}>
          {item}
        </Option>
      ))}
    </div>
  );
}

function Option({
  active,
  onClick,
  className = "",
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 transition-colors ${
        active ? "bg-neutral-900 text-white" : "bg-neutral-100 hover:bg-neutral-200"
      } ${className}`}
    >
      {children}
    </button>
  );
}
