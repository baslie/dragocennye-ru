import { useRef, useState } from "react";
import { StoneDetail } from "./StoneDetail";
import { InquiryModal } from "../inquiry/InquiryModal";
import type {
  InquiryChannel,
  InquiryConsent,
  InquiryFieldErrors,
  InquiryFormValues,
  InquiryState,
  InquiryStoneMini,
} from "../inquiry/types";
import type {
  Color,
  ContactChannel,
  Cut,
  Origin,
  SimilarStoneCard,
  StoneCertificate,
  StoneDetail as StoneDetailData,
  StoneVariety,
  Treatment,
} from "./types";

interface StoneDetailIslandProps {
  stone: StoneDetailData;
  variety: StoneVariety;
  cut: Cut;
  origin: Origin;
  treatment: Treatment;
  color: Color;
  certificate: StoneCertificate | null;
  similarStones: SimilarStoneCard[];
  contactChannels: ContactChannel[];
  inquiryChannels: InquiryChannel[];
}

const CONSENT: InquiryConsent = {
  label:
    "Я согласен на обработку персональных данных согласно политике конфиденциальности",
  policyHref: "/legal/privacy",
};

const EMPTY_FORM: InquiryFormValues = {
  name: "",
  contact: "",
  channel: null,
  comment: "",
  consent: false,
};

const CHANNEL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "телефон",
};

export function StoneDetailIsland({
  stone,
  variety,
  cut,
  origin,
  treatment,
  color,
  certificate,
  similarStones,
  contactChannels,
  inquiryChannels,
}: StoneDetailIslandProps) {
  // --- Заявка (заглушка submit) ---------------------------------------------
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<InquiryFormValues>(EMPTY_FORM);
  const [inquiryState, setInquiryState] = useState<InquiryState>("idle");
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inquiryStone: InquiryStoneMini = {
    id: stone.id,
    name: stone.name,
    weightCt: stone.weightCt,
    cutName: cut.id.endsWith("-unknown") ? "" : cut.name,
    photoUrl: stone.media[0]?.url ?? "",
    price: stone.price,
    accentHex: color.hex,
  };

  const channelLabel = values.channel
    ? CHANNEL_LABELS[values.channel] ?? values.channel
    : "выбранному каналу";
  const successMessage = `Дмитрий свяжется с вами в течение 2 часов по выбранному каналу связи — ${channelLabel}.`;

  const handleInquire = () => {
    setValues(EMPTY_FORM);
    setInquiryState("idle");
    setFieldErrors({});
    setErrorMessage(undefined);
    setOpen(true);
  };

  const handleChange = (next: InquiryFormValues) => {
    setValues(next);
    if (inquiryState === "error") {
      setInquiryState("idle");
      setFieldErrors({});
      setErrorMessage(undefined);
    }
  };

  const validate = (v: InquiryFormValues): InquiryFieldErrors => {
    const errors: InquiryFieldErrors = {};
    if (!v.name.trim()) errors.name = "Укажите, как к вам обращаться";
    if (!v.contact.trim())
      errors.contact = "Укажите телефон, @username или email";
    if (!v.channel) errors.channel = "Выберите удобный канал связи";
    if (!v.consent)
      errors.consent = "Подтвердите согласие на обработку персональных данных";
    return errors;
  };

  const handleSubmit = (v: InquiryFormValues) => {
    const errors = validate(v);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setInquiryState("error");
      return;
    }
    setFieldErrors({});
    setErrorMessage(undefined);
    setInquiryState("loading");
    // Имитация сетевого запроса — реальная отправка появится позже.
    timerRef.current = setTimeout(() => {
      setInquiryState("sent");
    }, 1400);
  };

  const handleClose = () => {
    if (inquiryState === "loading") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  return (
    <>
      <StoneDetail
        stone={stone}
        variety={variety}
        cut={cut}
        origin={origin}
        treatment={treatment}
        color={color}
        certificate={certificate}
        similarStones={similarStones}
        contactChannels={contactChannels}
        onInquire={handleInquire}
      />
      <InquiryModal
        isOpen={open}
        stone={inquiryStone}
        channels={inquiryChannels}
        values={values}
        state={inquiryState}
        fieldErrors={fieldErrors}
        errorMessage={errorMessage}
        successMessage={successMessage}
        consent={CONSENT}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </>
  );
}
