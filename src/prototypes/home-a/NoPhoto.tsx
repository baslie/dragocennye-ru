// Заполнитель карточки без фото: свечение цвета камня, паспорт (номер, вес, размер)
// и подпись «Фото готовится». Выбран на /prototypes/placeholders.
import { formatCt } from "../useCatalogState";
import type { Stone } from "../../components/catalog/types";

const SPECTRAL = '"Spectral", Georgia, serif';

export function NoPhoto({ stone, hex }: { stone: Stone; hex: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#f3f1ec]">
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 46%, ${hex}55 0%, ${hex}1f 28%, transparent 62%)` }}
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="text-[12px] uppercase leading-[150%] tracking-[0.18em] text-black/50">
          № {stone.slug.split("-")[0]}
        </span>
        <span className="mt-3 text-[clamp(40px,3vw,64px)] font-light leading-[100%]" style={{ fontFamily: SPECTRAL }}>
          {formatCt(stone.weightCt)}
        </span>
        {stone.dimensionsMm && (
          <span className="mt-3 text-[13px] leading-[150%] text-black/60">{stone.dimensionsMm.replaceAll(".", ",")} мм</span>
        )}
      </div>
      <span className="absolute bottom-5 left-0 right-0 text-center text-[12px] leading-[150%] tracking-[0.04em] text-black/50">
        Фото готовится
      </span>
    </div>
  );
}
