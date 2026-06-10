import { StoneDetail } from "./StoneDetail";
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
}

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
}: StoneDetailIslandProps) {
  const handleSelectSimilar = (stoneId: string) => {
    const target = similarStones.find((s) => s.id === stoneId);
    if (target) window.location.href = `/stones/${target.slug}`;
  };

  const handleBreadcrumbClick = (varietyId: string) => {
    // В пределах detail varietyId всегда совпадает с видом текущего камня.
    const slug = varietyId === variety.id ? variety.slug : "";
    window.location.href = slug ? `/catalog/${slug}` : "/";
  };

  const handleOpenCertificateScan = () => {
    if (certificate?.scanUrl) window.open(certificate.scanUrl, "_blank", "noopener");
  };

  const handleVerifyCertificate = () => {
    if (certificate?.verificationUrl)
      window.open(certificate.verificationUrl, "_blank", "noopener");
  };

  const handleInquire = () => {
    // Модалка заявки подключается в Milestone 4. До тех пор контакт —
    // через каналы в сайдбаре (Telegram/WhatsApp/телефон).
    // TODO(M4): открыть InquiryModal.
  };

  return (
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
      onSelectSimilar={handleSelectSimilar}
      onBreadcrumbClick={handleBreadcrumbClick}
      onOpenCertificateScan={handleOpenCertificateScan}
      onVerifyCertificate={handleVerifyCertificate}
    />
  );
}
