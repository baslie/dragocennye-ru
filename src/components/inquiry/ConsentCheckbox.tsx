import { Check } from 'lucide-react'
import type { InquiryConsent } from './types'

interface ConsentCheckboxProps {
  id: string
  consent: InquiryConsent
  checked: boolean
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange?: (checked: boolean) => void
}

export function ConsentCheckbox({
  id,
  consent,
  checked,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
}: ConsentCheckboxProps) {
  const boxBase =
    'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition'
  const boxState = checked
    ? 'border-[#576A8F] bg-[#576A8F] text-white'
    : invalid
      ? 'border-red-400 bg-white'
      : 'border-stone-300 bg-white'

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 pt-2 ${
        disabled ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      <span className="relative mt-0.5 flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.currentTarget.checked)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className="sr-only"
        />
        <span className={`${boxBase} ${boxState}`} aria-hidden="true">
          {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
        </span>
      </span>
      <span
        className="text-sm leading-relaxed text-stone-600"
        style={{ fontFamily: "'Noto Sans', sans-serif" }}
      >
        Я согласен на обработку персональных данных согласно{' '}
        <a
          href={consent.policyHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="text-[#576A8F] underline decoration-stone-300 underline-offset-4 transition hover:decoration-[#576A8F]"
        >
          политике конфиденциальности
        </a>
      </span>
    </label>
  )
}
