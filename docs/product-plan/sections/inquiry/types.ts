export type InquiryChannelType = 'telegram' | 'whatsapp' | 'phone';

export type InquiryChannelIcon = 'Send' | 'MessageCircle' | 'Phone';

export type InquiryState = 'idle' | 'loading' | 'sent' | 'error';

export interface InquiryStoneMini {
  id: string;
  name: string;
  weightCt: number;
  cutName: string;
  photoUrl: string;
  price: number;
}

export interface InquiryChannel {
  type: InquiryChannelType;
  label: string;
  icon: InquiryChannelIcon;
}

export interface InquiryFormValues {
  name: string;
  contact: string;
  channel: InquiryChannelType | null;
  comment: string;
  consent: boolean;
}

export interface InquiryFieldErrors {
  name?: string;
  contact?: string;
  channel?: string;
  comment?: string;
  consent?: string;
}

export interface InquiryConsent {
  label: string;
  policyHref: string;
}

export interface InquiryModalProps {
  /** Открыта ли модалка. Если false — компонент ничего не рендерит. */
  isOpen: boolean;
  /** Камень, по которому оформляется заявка. */
  stone: InquiryStoneMini;
  /** Список доступных каналов связи для радио-группы. */
  channels: InquiryChannel[];
  /** Текущие значения формы. Родитель — источник истины. */
  values: InquiryFormValues;
  /** Текущее состояние модалки. */
  state: InquiryState;
  /** Ошибки по конкретным полям — подсвечиваются при state='error' с валидацией. */
  fieldErrors?: InquiryFieldErrors;
  /** Общее сообщение об ошибке (сетевой сбой) — баннер над формой. */
  errorMessage?: string;
  /** Текст параграфа в success-блоке при state='sent'. Уже содержит название выбранного канала. */
  successMessage: string;
  /** Данные блока согласия 152-ФЗ (текст и href политики). */
  consent: InquiryConsent;
  /** Триггерится при изменении любого поля формы — родитель получает новый snapshot values. */
  onChange?: (values: InquiryFormValues) => void;
  /** Триггерится при сабмите формы (CTA «Отправить заявку»). */
  onSubmit?: (values: InquiryFormValues) => void;
  /** Триггерится при закрытии модалки — крестик, Escape, клик по backdrop, кнопка «Закрыть» в sent-state. */
  onClose?: () => void;
}
