import { MessageCircle, Phone, Send } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import type {
  InquiryChannel,
  InquiryChannelIcon,
  InquiryChannelType,
} from './types'

interface ChannelChipGroupProps {
  name: string
  channels: InquiryChannel[]
  value: InquiryChannelType | null
  disabled?: boolean
  invalid?: boolean
  describedBy?: string
  onChange?: (value: InquiryChannelType) => void
}

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const ICONS: Record<InquiryChannelIcon, IconComponent> = {
  Send,
  MessageCircle,
  Phone,
}

export function ChannelChipGroup({
  name,
  channels,
  value,
  disabled = false,
  invalid = false,
  describedBy,
  onChange,
}: ChannelChipGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Канал связи"
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className="grid grid-cols-3 gap-2"
    >
      {channels.map((channel) => {
        const Icon = ICONS[channel.icon]
        const selected = value === channel.type
        const base =
          'group flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition'
        const stateClass = selected
          ? 'border-[#FF7444] bg-[#FF7444]/5 text-[#FF7444]'
          : invalid
            ? 'border-red-400 text-stone-700 hover:border-[#FF7444] hover:text-[#FF7444]'
            : 'border-stone-200 text-stone-700 hover:border-[#FF7444] hover:text-[#FF7444]'
        const disabledClass = disabled
          ? 'pointer-events-none opacity-60'
          : ''

        return (
          <label key={channel.type} className={`${base} ${stateClass} ${disabledClass}`}>
            <input
              type="radio"
              name={name}
              value={channel.type}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange?.(channel.type)}
              className="sr-only"
            />
            <Icon
              className="h-4 w-4"
              aria-hidden="true"
              strokeWidth={1.75}
            />
            <span
              style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
            >
              {channel.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
