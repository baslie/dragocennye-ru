import { useId, type FormEvent, type ReactNode } from "react";
import { LoaderCircle, X } from "lucide-react";
import type { InquiryModalProps, InquiryFormValues, InquiryChannelType } from "./types";
import { StoneMiniCard } from "./StoneMiniCard";
import { ChannelChipGroup } from "./ChannelChipGroup";
import { ConsentCheckbox } from "./ConsentCheckbox";
import { SentBlock } from "./SentBlock";
import { HAIRLINE, T, buttonClass } from "../ui";

export type InquiryDialogProps = Omit<InquiryModalProps, "isOpen">;

// Поле с одной нижней линией, как select в строке фильтров.
const FIELD =
  "w-full border-b bg-transparent py-2 text-[clamp(15px,0.88vw,18px)] leading-[150%] outline-none transition-colors placeholder:text-black/30 focus:border-ink disabled:cursor-not-allowed disabled:text-black/40";

const fieldBorder = (hasError: boolean) => (hasError ? "border-danger" : "border-black/20");

function FieldLabel({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className={`flex items-baseline justify-between ${T.label}`}>
      <span>{children}</span>
      {optional ? <span className="text-black/35">не обязательно</span> : null}
    </label>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-[13px] leading-[150%] text-danger">
      {children}
    </p>
  );
}

function HintText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-[13px] leading-[150%] text-black/48">
      {children}
    </p>
  );
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
  const uid = useId();
  const titleId = `${uid}-title`;
  const nameId = `${uid}-name`;
  const nameErrorId = `${nameId}-error`;
  const contactId = `${uid}-contact`;
  const contactErrorId = `${contactId}-error`;
  const contactHintId = `${contactId}-hint`;
  const channelErrorId = `${uid}-channel-error`;
  const commentId = `${uid}-comment`;
  const commentErrorId = `${commentId}-error`;
  const consentId = `${uid}-consent`;
  const consentErrorId = `${consentId}-error`;

  const isLoading = state === "loading";
  const isSent = state === "sent";
  const isErrorBanner = state === "error" && !!errorMessage;

  const canSubmit =
    !isLoading && values.consent && values.name.trim().length > 0 && values.contact.trim().length > 0 && values.channel !== null;

  const patch = (partial: Partial<InquiryFormValues>) => {
    onChange?.({ ...values, ...partial });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit?.(values);
  };

  const handleChannelChange = (channel: InquiryChannelType) => patch({ channel });

  const nameError = fieldErrors?.name;
  const contactError = fieldErrors?.contact;
  const channelError = fieldErrors?.channel;
  const commentError = fieldErrors?.comment;
  const consentError = fieldErrors?.consent;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="max-h-[100dvh] w-full max-w-[560px] overflow-y-auto bg-white sm:max-h-[calc(100dvh-4rem)]"
    >
      <header className={`flex items-start justify-between gap-6 px-6 pb-5 pt-6 sm:px-10 sm:pt-9`}>
        <div className="min-w-0">
          <p className={T.eyebrow}>Заявка на камень</p>
          <h2 id={titleId} className="mt-2 font-serif text-[30px] font-light leading-[105%] md:text-[36px]">
            {isSent ? "Спасибо" : "Оставьте контакты"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center text-black/48 transition-colors hover:text-black"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      <StoneMiniCard stone={stone} />

      {isErrorBanner ? (
        <div role="alert" aria-live="polite" className={`mx-6 mt-5 border-l-2 border-danger pl-4 text-danger sm:mx-10 ${T.ui}`}>
          {errorMessage}
        </div>
      ) : null}

      {isSent ? (
        <SentBlock successMessage={successMessage} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6 px-6 py-7 sm:px-10">
            <div>
              <FieldLabel htmlFor={nameId}>Имя</FieldLabel>
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                value={values.name}
                disabled={isLoading}
                placeholder="Как к вам обращаться"
                onChange={(event) => patch({ name: event.currentTarget.value })}
                aria-invalid={nameError ? true : undefined}
                aria-describedby={nameError ? nameErrorId : undefined}
                className={`${FIELD} ${fieldBorder(!!nameError)}`}
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
                onChange={(event) => patch({ contact: event.currentTarget.value })}
                aria-invalid={contactError ? true : undefined}
                aria-describedby={contactError ? contactErrorId : contactHintId}
                className={`${FIELD} ${fieldBorder(!!contactError)}`}
              />
              {contactError ? (
                <ErrorText id={contactErrorId}>{contactError}</ErrorText>
              ) : (
                <HintText id={contactHintId}>Один удобный способ: телефон, ник в Telegram или email</HintText>
              )}
            </div>

            <div>
              <p className={`mb-2.5 ${T.label}`}>Как удобнее связаться</p>
              <ChannelChipGroup
                name={`${uid}-channel`}
                channels={channels}
                value={values.channel}
                disabled={isLoading}
                invalid={!!channelError}
                describedBy={channelError ? channelErrorId : undefined}
                onChange={handleChannelChange}
              />
              {channelError ? <ErrorText id={channelErrorId}>{channelError}</ErrorText> : null}
            </div>

            <div>
              <FieldLabel htmlFor={commentId} optional>
                Комментарий
              </FieldLabel>
              <textarea
                id={commentId}
                rows={2}
                value={values.comment}
                disabled={isLoading}
                placeholder="Вопрос по камню, удобное время звонка"
                onChange={(event) => patch({ comment: event.currentTarget.value })}
                aria-invalid={commentError ? true : undefined}
                aria-describedby={commentError ? commentErrorId : undefined}
                className={`${FIELD} resize-none ${fieldBorder(!!commentError)}`}
              />
              {commentError ? <ErrorText id={commentErrorId}>{commentError}</ErrorText> : null}
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
              {consentError ? <ErrorText id={consentErrorId}>{consentError}</ErrorText> : null}
            </div>
          </div>

          <footer className={`border-t ${HAIRLINE} px-6 pb-7 pt-6 sm:px-10 sm:pb-9`}>
            <button type="submit" disabled={!canSubmit} aria-busy={isLoading} className={`w-full ${buttonClass("solid")}`}>
              {isLoading ? (
                <>
                  <LoaderCircle className="h-[18px] w-[18px] animate-spin" strokeWidth={1.5} aria-hidden />
                  Отправляем
                </>
              ) : (
                "Отправить заявку"
              )}
            </button>
            <p className={`mt-3 text-center ${T.label}`}>Без онлайн-оплаты. Дмитрий свяжется с вами напрямую.</p>
          </footer>
        </form>
      )}
    </div>
  );
}
