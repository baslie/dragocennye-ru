import { Check } from "lucide-react";
import type { InquiryConsent } from "./types";

interface ConsentCheckboxProps {
  id: string;
  consent: InquiryConsent;
  checked: boolean;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  onChange?: (checked: boolean) => void;
}

export function ConsentCheckbox({ id, consent, checked, disabled = false, invalid = false, describedBy, onChange }: ConsentCheckboxProps) {
  const box = checked ? "border-ink bg-ink text-white" : invalid ? "border-danger bg-white" : "border-black/30 bg-white";

  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <span className="relative mt-[3px] shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.currentTarget.checked)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`flex h-[18px] w-[18px] items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${box}`}
        >
          {checked ? <Check className="h-3 w-3" strokeWidth={2.5} /> : null}
        </span>
      </span>
      <span className="text-[13px] leading-[150%] text-black/60">
        Я согласен на обработку персональных данных согласно{" "}
        <a
          href={consent.policyHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="text-ink underline decoration-black/25 underline-offset-[0.2em] transition-colors hover:decoration-ink"
        >
          политике конфиденциальности
        </a>
      </span>
    </label>
  );
}
