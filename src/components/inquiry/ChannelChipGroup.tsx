// Канал связи — чипы-пилюли, как в строке фильтров каталога. Под капотом радиокнопки.
import type { InquiryChannel, InquiryChannelType } from "./types";

interface ChannelChipGroupProps {
  name: string;
  channels: InquiryChannel[];
  value: InquiryChannelType | null;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  onChange?: (value: InquiryChannelType) => void;
}

export function ChannelChipGroup({ name, channels, value, disabled = false, invalid = false, describedBy, onChange }: ChannelChipGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Канал связи"
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className={`flex flex-wrap gap-1.5 ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {channels.map((channel) => {
        const selected = value === channel.type;
        return (
          <label
            key={channel.type}
            className={`flex h-[clamp(34px,1.9vw,42px)] cursor-pointer items-center rounded-full border px-[clamp(14px,0.9vw,20px)] text-[clamp(13px,0.72vw,18px)] leading-[150%] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
              selected
                ? "border-ink bg-ink text-white"
                : invalid
                  ? "border-danger text-black/75 hover:text-black"
                  : "border-black/15 text-black/75 hover:border-black/40 hover:text-black"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={channel.type}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange?.(channel.type)}
              className="sr-only"
            />
            {channel.label}
          </label>
        );
      })}
    </div>
  );
}
