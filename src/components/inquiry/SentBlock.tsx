import { Check } from "lucide-react";
import { T, buttonClass } from "../ui";

interface SentBlockProps {
  successMessage: string;
  onClose?: () => void;
}

export function SentBlock({ successMessage, onClose }: SentBlockProps) {
  return (
    <div aria-live="polite" className="px-6 pb-9 pt-8 sm:px-10">
      <p className={`flex items-center gap-2.5 text-emerald ${T.ui}`}>
        <Check className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        Заявка отправлена
      </p>
      <p className={`mt-3 max-w-[44ch] ${T.lead}`}>{successMessage}</p>
      <button type="button" onClick={onClose} className={`mt-8 w-full ${buttonClass("outline")}`}>
        Закрыть
      </button>
    </div>
  );
}
