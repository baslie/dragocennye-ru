import type {
  ContactChannel,
  StoneDetail,
  StoneVariety,
} from './types'

interface PriceSidebarProps {
  stone: StoneDetail
  variety: StoneVariety
  contactChannels: ContactChannel[]
  onInquire?: (stoneId: string) => void
  onBrowseVariety?: (varietyId: string) => void
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('ru-RU').format(value) + ' ₽'

const channelLabel: Record<ContactChannel['type'], string> = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  phone: 'Позвонить',
}

function ChannelIcon({ type }: { type: ContactChannel['type'] }) {
  const common = 'h-5 w-5'
  if (type === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m22 3-10 10M22 3l-7 18-3-8-8-3 18-7Z" />
      </svg>
    )
  }
  if (type === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 12a8 8 0 0 1 13.8-5.5 8 8 0 0 1-.3 11.6L20 20l-2-2.2A8 8 0 0 1 4 12Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 10c0 3 2 5 5 5l1-1.5-2-1-1 1c-1 0-2-1-2-2l1-1-1-2L9 10Z"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16v2a2 2 0 0 1-2.2 2 19 19 0 0 1-8.4-3 19 19 0 0 1-6-6A19 19 0 0 1 2.4 2.8 2 2 0 0 1 4.3 1h3A2 2 0 0 1 9.3 3l.7 2.4a2 2 0 0 1-.5 2L8 9a16 16 0 0 0 7 7l1.6-1.5a2 2 0 0 1 2-.5l2.4.7a2 2 0 0 1 1 1.3Z"
      />
    </svg>
  )
}

export function PriceSidebar({
  stone,
  variety,
  contactChannels,
  onInquire,
  onBrowseVariety,
}: PriceSidebarProps) {
  const sold = !stone.isAvailable

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="relative overflow-hidden border border-stone-200 bg-white p-7 shadow-[0_20px_60px_-28px_rgba(87,106,143,0.35)] md:p-9">
        {/* tick marks in corner for aesthetic */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-14 w-14 border-b border-l border-stone-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-14 w-14 border-t border-r border-stone-100"
        />

        <p
          className="text-[10px] uppercase tracking-[0.22em] text-stone-400"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          {stone.name}
        </p>

        <div
          className={`mt-3 text-4xl md:text-[44px] ${
            sold
              ? 'text-stone-400 line-through decoration-stone-300'
              : 'text-[#576A8F]'
          }`}
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 500,
            letterSpacing: '-0.015em',
          }}
        >
          {formatPrice(stone.price)}
        </div>

        <p
          className="mt-2 text-[10px] uppercase tracking-[0.22em] text-stone-500 md:text-[11px]"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          единственный экземпляр
        </p>

        {sold ? (
          <button
            type="button"
            onClick={() => onBrowseVariety?.(variety.id)}
            className="group mt-6 flex w-full items-center justify-center gap-2 border border-[#576A8F] px-6 py-4 text-sm text-[#576A8F] transition-all hover:bg-[#576A8F] hover:text-white"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
          >
            <span>Смотреть другие {variety.pluralName}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onInquire?.(stone.id)}
            className="group mt-6 flex w-full items-center justify-center gap-2 bg-[#FF7444] px-6 py-4 text-base text-white transition-all hover:bg-[#e6643a] hover:shadow-[0_12px_30px_-10px_rgba(255,116,68,0.6)]"
            style={{ fontFamily: "'Noto Sans', sans-serif", fontWeight: 500 }}
          >
            <span>Оставить заявку</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        )}

        <div className="my-7 border-t border-stone-100" />

        <p
          className="mb-3 text-[10px] uppercase tracking-[0.22em] text-stone-400"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          Написать гемологу
        </p>
        <div className="grid grid-cols-3 gap-2">
          {contactChannels.map((c) => (
            <a
              key={c.type}
              href={c.href}
              target={c.type === 'phone' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 border border-stone-200 bg-white px-2 py-3 text-center text-stone-700 transition-all hover:border-[#FF7444] hover:text-[#FF7444]"
              title={c.label}
            >
              <ChannelIcon type={c.type} />
              <span
                className="text-[9px] uppercase tracking-[0.18em]"
                style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
              >
                {channelLabel[c.type]}
              </span>
            </a>
          ))}
        </div>

        <p
          className="mt-7 text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-stone-400"
          style={{ fontFamily: "'Noto Sans Mono', ui-monospace, monospace" }}
        >
          Оплата по договорённости
          <br />
          Доставка Почтой России или курьером
        </p>
      </div>
    </aside>
  )
}
