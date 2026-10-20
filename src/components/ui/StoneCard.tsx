// Карточка камня из сетки «Ювелирного дома»: кадр 4:5, вид мелко, название Spectral, вес и цена.
import { formatCt, formatPrice, hasPhoto, stoneCode, withBase } from "../../lib/format";
import { NoPhoto } from "./NoPhoto";

export interface CardStone {
  slug: string;
  name: string;
  weightCt: number;
  price: number;
  photoUrl: string;
  isAvailable: boolean;
  colorHex: string;
  varietyName?: string;
  dimensionsMm?: string;
}

export function StoneCard({ stone, eager = false }: { stone: CardStone; eager?: boolean }) {
  return (
    <a href={withBase(`/stones/${stone.slug}`)} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {hasPhoto(stone.photoUrl) ? (
          <img
            src={stone.photoUrl}
            alt={stone.name}
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <NoPhoto code={stoneCode(stone.slug)} weightCt={stone.weightCt} dimensionsMm={stone.dimensionsMm} hex={stone.colorHex} />
        )}
        {!stone.isAvailable && (
          <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[11px] uppercase leading-[150%] tracking-[0.14em]">
            Продан
          </span>
        )}
      </div>
      {stone.varietyName && (
        <p className="mt-2 text-[clamp(11px,0.6vw,14px)] uppercase leading-[150%] tracking-[0.14em] text-black/48 md:mt-3">
          {stone.varietyName}
        </p>
      )}
      <h3
        className={`${stone.varietyName ? "mt-1" : "mt-2 md:mt-3"} font-serif text-[19px] leading-[120%] md:text-[clamp(22px,1.5vw,30px)] md:leading-[110%]`}
      >
        {stone.name}
      </h3>
      <p className="mt-2 flex flex-wrap gap-x-4 text-[clamp(13px,0.72vw,18px)] leading-[150%] text-black/60">
        <span>{formatCt(stone.weightCt)}</span>
        <span className={`font-medium text-ink ${stone.isAvailable ? "" : "line-through decoration-black/40"}`}>
          {formatPrice(stone.price)}
        </span>
      </p>
    </a>
  );
}
