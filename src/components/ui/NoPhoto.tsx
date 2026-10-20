// Заполнитель кадра без фото: свечение цвета камня, паспорт (номер, вес, размер)
// и подпись «Фото готовится». Вариант thumb — только свечение, для миниатюр.
import { formatCt, formatMm } from "../../lib/format";

interface Props {
  code: string;
  weightCt: number;
  dimensionsMm?: string;
  hex: string;
  size?: "card" | "large" | "thumb";
}

export function NoPhoto({ code, weightCt, dimensionsMm, hex, size = "card" }: Props) {
  const glow = (
    <div
      className="absolute inset-0"
      style={{ background: `radial-gradient(circle at 50% 46%, ${hex}55 0%, ${hex}1f 28%, transparent 62%)` }}
    />
  );
  if (size === "thumb") return <div className="relative h-full w-full bg-paper">{glow}</div>;

  const large = size === "large";
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-paper">
      {glow}
      <div className="relative flex flex-col items-center text-center">
        <span className="text-[12px] uppercase leading-[150%] tracking-[0.18em] text-black/50">№ {code}</span>
        <span
          className={`mt-3 font-serif font-light leading-[100%] ${
            large ? "text-[clamp(56px,5vw,104px)]" : "text-[clamp(40px,3vw,64px)]"
          }`}
        >
          {formatCt(weightCt)}
        </span>
        {dimensionsMm && <span className="mt-3 text-[13px] leading-[150%] text-black/60">{formatMm(dimensionsMm)}</span>}
      </div>
      <span className="absolute bottom-5 left-0 right-0 text-center text-[12px] leading-[150%] tracking-[0.04em] text-black/50">
        Фото готовится
      </span>
    </div>
  );
}
