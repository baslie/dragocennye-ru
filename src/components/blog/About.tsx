import { MessageCircle, Phone, Send } from 'lucide-react'
import type { ComponentType } from 'react'
import type {
  AboutProps,
  ContactChannel,
  GemologistContact,
} from './types'
import { PostCard } from './PostCard'
import { Timeline } from './Timeline'
import {
  hideBrokenImage,
  monoFont,
  portraitStyle,
  sansFont,
} from './format'

const CHANNEL_ICON: Record<ContactChannel, ComponentType<{ className?: string }>> = {
  telegram: Send,
  whatsapp: MessageCircle,
  phone: Phone,
}

/**
 * View 3 — страница о гемологе (/about). Hero + статы + таймлайн + подход +
 * последние посты + CTA-блок с контактами.
 */
export function About({
  gemologist,
  recentPosts,
  onViewPost,
  onViewFeed,
  onContact,
}: AboutProps) {
  return (
    <div className="pt-10 pb-24 md:pt-14">
      {/* Hero */}
      <header className="mb-16 grid grid-cols-1 items-start gap-10 lg:mb-24 lg:grid-cols-[420px_1fr] lg:gap-16">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200"
          style={portraitStyle}
        >
          <img
            src={gemologist.portraitUrl}
            alt={gemologist.name}
            onError={hideBrokenImage}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          <p
            className="text-xs uppercase tracking-wider text-[#576A8F]"
            style={monoFont}
          >
            Гемолог
          </p>
          <h1
            className="mt-3 text-4xl font-medium text-stone-900 md:text-5xl xl:text-6xl"
            style={sansFont}
          >
            {gemologist.name}
          </h1>
          <p className="mt-2 text-lg text-stone-600" style={sansFont}>
            {gemologist.role}
          </p>
          <div
            className="mt-6 space-y-4 text-lg leading-relaxed text-stone-700"
            style={sansFont}
          >
            {gemologist.intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Стат-чипы — мгновенный сигнал доверия, заполняют низ колонки */}
          {gemologist.stats.length > 0 && (
            <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-stone-200 pt-6">
              {gemologist.stats.map((stat, index) => (
                <div key={index}>
                  <span
                    className="text-2xl font-medium text-stone-900 md:text-3xl"
                    style={sansFont}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="ml-2 text-xs uppercase tracking-wider text-stone-500"
                    style={monoFont}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Образование и опыт */}
      <section className="mb-16 max-w-[760px] md:mb-24">
        <p
          className="text-xs uppercase tracking-wider text-[#576A8F]"
          style={monoFont}
        >
          Путь
        </p>
        <h2
          className="mt-2 mb-10 text-2xl font-medium text-stone-900 md:text-3xl"
          style={sansFont}
        >
          Образование и опыт
        </h2>
        <Timeline items={gemologist.timeline} />
      </section>

      {/* Подход к подбору */}
      <section className="mb-16 max-w-[72ch] md:mb-24">
        <p
          className="text-xs uppercase tracking-wider text-[#576A8F]"
          style={monoFont}
        >
          Принципы
        </p>
        <h2
          className="mt-2 mb-6 text-2xl font-medium text-stone-900 md:text-3xl"
          style={sansFont}
        >
          Подход к подбору
        </h2>
        <div
          className="space-y-5 text-lg leading-relaxed text-stone-800"
          style={sansFont}
        >
          {gemologist.approach.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Из журнала */}
      {recentPosts.length > 0 && (
        <section className="mb-16 md:mb-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2
              className="text-2xl font-medium text-stone-900 md:text-3xl"
              style={sansFont}
            >
              Из журнала
            </h2>
            <button
              type="button"
              onClick={onViewFeed}
              className="text-xs uppercase tracking-wider text-[#576A8F] transition-colors hover:text-[#FF7444] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={monoFont}
            >
              Все публикации →
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => onViewPost?.(post.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-[#FFF8DE] px-8 py-14 text-center">
        <h3
          className="text-2xl font-medium text-stone-900 md:text-3xl"
          style={sansFont}
        >
          Напишите Дмитрию
        </h3>
        <p
          className="mx-auto mt-3 max-w-[52ch] text-base text-stone-700"
          style={sansFont}
        >
          Подберём камень под задачу — из коллекции или под заказ с
          международных аукционов.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {gemologist.contacts.map((contact) => (
            <ContactButton
              key={contact.channel}
              contact={contact}
              onContact={onContact}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function ContactButton({
  contact,
  onContact,
}: {
  contact: GemologistContact
  onContact?: (channel: ContactChannel) => void
}) {
  const Icon = CHANNEL_ICON[contact.channel]
  const isPrimary = contact.channel === 'telegram'

  const className = isPrimary
    ? 'inline-flex items-center gap-2 rounded-lg bg-[#FF7444] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#e6643a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8DE]'
    : 'inline-flex items-center gap-2 rounded-lg border border-stone-300 px-6 py-3 text-sm text-stone-700 transition-colors hover:border-[#576A8F] hover:text-[#576A8F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8DE]'

  return (
    <button
      type="button"
      onClick={() => onContact?.(contact.channel)}
      className={className}
      style={sansFont}
    >
      <Icon className="h-4 w-4" />
      {contact.label}
    </button>
  )
}
