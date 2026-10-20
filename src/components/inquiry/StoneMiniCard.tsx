import type { InquiryStoneMini } from "./types";
import { formatCt, formatPrice, hasPhoto } from "../../lib/format";
import { NoPhoto, T } from "../ui";

export function StoneMiniCard({ stone }: { stone: InquiryStoneMini }) {
  const meta = [formatCt(stone.weightCt), stone.cutName].filter(Boolean).join(" · ");

  return (
    <div className="mx-6 flex items-center gap-4 bg-paper p-3 sm:mx-10">
      <div className="h-[72px] w-[58px] shrink-0 overflow-hidden bg-neutral-100">
        {hasPhoto(stone.photoUrl) ? (
          <img src={stone.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <NoPhoto size="thumb" code="" weightCt={stone.weightCt} hex={stone.accentHex ?? "#8a8a8a"} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-serif text-[clamp(18px,1.1vw,21px)] leading-[120%]">{stone.name}</p>
        <p className={`mt-1 ${T.label}`}>{meta}</p>
      </div>
      <p className={`shrink-0 pr-1 font-medium ${T.ui}`}>{formatPrice(stone.price)}</p>
    </div>
  );
}
