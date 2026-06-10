import { useId, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, Loader2, X } from 'lucide-react'
import type {
  InquiryModalProps,
  InquiryFormValues,
  InquiryChannelType,
} from './types'
import { StoneMiniCard } from './StoneMiniCard'
import { ChannelChipGroup } from './ChannelChipGroup'
import { ConsentCheckbox } from './ConsentCheckbox'
import { SentBlock } from './SentBlock'

export type InquiryDialogProps = Omit<InquiryModalProps, 'isOpen'>

const MONO = "'Noto Sans Mono', ui-monospace, monospace"
const SANS = "'Noto Sans', sans-serif"

const FIELD_INPUT_BASE =
  'w-full rounded-lg border px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-[#576A8F] focus:ring-2 focus:ring-[#576A8F]/20 disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed'

function fieldBorderClass(hasError: boolean) {
  return hasError ? 'border-red-400' : 'border-stone-200'
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: ReactNode
  optional?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-baseline justify-between text-xs uppercase tracking-wider text-stone-500"
      style={{ fontFamily: MONO }}
    >
      <span>{children}</span>
      {optional ? (
        <span className="text-[11px] tracking-normal text-stone-400 lowercase">
          не обязательно
        </span>
      ) : null}
    </label>
  )
}

function ErrorText({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  return (
    <p
      id={id}
      className="mt-1.5 text-xs text-red-500"
      style={{ fontFamily: SANS }}
    >
      {children}
    </p>
  )
}

function HintText({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  return (
    <p
      id={id}
      className="mt-1.5 text-xs text-stone-500"
      style={{ fontFamily: MONO }}
    >
      {children}
    </p>
  )
}

export function InquiryDialog({
  stone,
  channels,
  values,
  state,
  fieldErrors,
  errorMessage,
  successMessage,
  consent,
  onChange,
  onSubmit,
  onClose,
}: InquiryDialogProps) {
  const uid = useId()
  const titleId = `${uid}-title`
  const nameId = `${uid}-name`
  const nameErrorId = `${nameId}-error`
  const contactId = `${uid}-contact`
  const contactErrorId = `${contactId}-error`
  const contactHintId = `${contactId}-hint`
  const channelErrorId = `${uid}-channel-error`
  const commentId = `${uid}-comment`
  const commentErrorId = `${commentId}-error`
  const consentId = `${uid}-consent`
  const consentErrorId = `${consentId}-error`

  const isLoading = state === 'loading'
  const isSent = state === 'sent'
  const isErrorBanner = state === 'error' && !!errorMessage

  const canSubmit =
    !isLoading &&
    values.consent &&
    values.name.trim().length > 0 &&
    values.contact.trim().length > 0 &&
    values.channel !== null

  const patch = (partial: Partial<InquiryFormValues>) => {
    onChange?.({ ...values, ...partial })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit?.(values)
  }

  const handleChannelChange = (channel: InquiryChannelType) =>
    patch({ channel })

  const nameError = fieldErrors?.name
  const contactError = fieldErrors?.contact
  const channelError = fieldErrors?.channel
  const commentError = fieldErrors?.comment
  const consentError = fieldErrors?.consent

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl max-sm:rounded-b-none"
      style={{ fontFamily: SANS }}
    >
      <header className="flex items-start justify-between gap-6 border-b border-stone-200 px-6 py-5 sm:px-8 sm:py-6">
        <div className="min-w-0">
          <p
            className="text-xs uppercase tracking-wider text-[#576A8F]"
            style={{ fontFamily: MONO }}
          >
            Заявка на камень
          </p>
          <h2
            id={titleId}
            className="mt-2 text-2xl text-stone-900"
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              letterSpacing: '-0.015em',
            }}
          >
            Оставьте контакты
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </header>

      <StoneMiniCard stone={stone} />

      {isErrorBanner ? (
        <div
          role="alert"
          aria-live="polite"
          className="mx-6 mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-8 sm:mt-6"
          style={{ fontFamily: SANS }}
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
            strokeWidth={2}
          />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isSent ? (
        <SentBlock successMessage={successMessage} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            <div>
              <FieldLabel htmlFor={nameId}>Имя</FieldLabel>
              <input
                id={nameId}
                type="text"
                value={values.name}
                disabled={isLoading}
                placeholder="Как к вам обращаться"
                onChange={(event) => patch({ name: event.currentTarget.value })}
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? nameErrorId : undefined}
                className={`${FIELD_INPUT_BASE} ${fieldBorderClass(!!nameError)}`}
                style={{ fontFamily: SANS }}
              />
              {nameError ? <ErrorText id={nameErrorId}>{nameError}</ErrorText> : null}
            </div>

            <div>
              <FieldLabel htmlFor={contactId}>Контакт</FieldLabel>
              <input
                id={contactId}
                type="text"
                value={values.contact}
                disabled={isLoading}
                placeholder="Телефон, @username или email"
                onChange={(event) =>
                  patch({ contact: event.currentTarget.value })
                }
                aria-invalid={contactError ? true : undefined}
                aria-describedby={
                  contactError ? contactErrorId : contactHintId
                }
                className={`${FIELD_INPUT_BASE} ${fieldBorderClass(!!contactError)}`}
                style={{ fontFamily: SANS }}
              />
              {contactError ? (
                <ErrorText id={contactErrorId}>{contactError}</ErrorText>
              ) : (
                <HintText id={contactHintId}>
                  Оставьте один удобный способ — телефон, ник в Telegram или
                  email
                </HintText>
              )}
            </div>

            <div>
              <p
                className="mb-2 text-xs uppercase tracking-wider text-stone-500"
                style={{ fontFamily: MONO }}
              >
                Канал связи
              </p>
              <ChannelChipGroup
                name={`${uid}-channel`}
                channels={channels}
                value={values.channel}
                disabled={isLoading}
                invalid={!!channelError}
                describedBy={channelError ? channelErrorId : undefined}
                onChange={handleChannelChange}
              />
              {channelError ? (
                <ErrorText id={channelErrorId}>{channelError}</ErrorText>
              ) : null}
            </div>

            <div>
              <FieldLabel htmlFor={commentId} optional>
                Комментарий
              </FieldLabel>
              <textarea
                id={commentId}
                rows={3}
                value={values.comment}
                disabled={isLoading}
                placeholder="Вопрос, уточнение по камню, удобное время звонка"
                onChange={(event) =>
                  patch({ comment: event.currentTarget.value })
                }
                aria-invalid={commentError ? true : undefined}
                aria-describedby={commentError ? commentErrorId : undefined}
                className={`${FIELD_INPUT_BASE} resize-none ${fieldBorderClass(!!commentError)}`}
                style={{ fontFamily: SANS }}
              />
              {commentError ? (
                <ErrorText id={commentErrorId}>{commentError}</ErrorText>
              ) : null}
            </div>

            <div>
              <ConsentCheckbox
                id={consentId}
                consent={consent}
                checked={values.consent}
                disabled={isLoading}
                invalid={!!consentError}
                describedBy={consentError ? consentErrorId : undefined}
                onChange={(checked) => patch({ consent: checked })}
              />
              {consentError ? (
                <ErrorText id={consentErrorId}>{consentError}</ErrorText>
              ) : null}
            </div>
          </div>

          <footer className="border-t border-stone-200 bg-stone-50 px-6 py-6 sm:px-8">
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF7444] px-6 py-4 text-base text-white transition hover:bg-[#e6643a] disabled:cursor-not-allowed disabled:bg-stone-300"
              style={{
                fontFamily: SANS,
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
                  <span>Отправляем…</span>
                </>
              ) : (
                <span>Отправить заявку</span>
              )}
            </button>
            <p
              className="mt-3 text-center text-xs uppercase tracking-wider text-stone-500"
              style={{ fontFamily: MONO }}
            >
              Без онлайн-оплаты. Дмитрий свяжется с вами напрямую
            </p>
          </footer>
        </form>
      )}
    </div>
  )
}
