// Тихие элементы управления: чип-пилюля, группа чипов, select с нижней линией.
import type { ReactNode } from "react";
import { T } from "./type";

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`h-[clamp(30px,1.7vw,40px)] shrink-0 rounded-full border px-[clamp(12px,0.8vw,18px)] text-[clamp(13px,0.72vw,18px)] leading-[150%] transition-colors ${
        on ? "border-ink bg-ink text-white" : "border-black/15 text-black/75 hover:border-black/40 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

/** Группа чипов с одним выбором. */
export function Chips({
  label,
  value,
  onChange,
  options,
  className = "flex",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`items-center gap-3 ${className}`}>
      <span className={T.label}>{label}</span>
      <div className="flex gap-1.5">
        {options.map(([v, l]) => (
          <Chip key={v} on={v === value} onClick={() => onChange(v)}>
            {l}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className={`flex items-center gap-3 ${T.ui}`}>
      <span className={T.label}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none border-b border-black/20 bg-transparent pb-0.5 pr-1 focus:border-black focus:outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
