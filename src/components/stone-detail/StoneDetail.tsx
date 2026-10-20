// Страница камня: слева кадры, справа липкая колонка с ценой, заявкой и паспортом.
// Ниже — слово гемолога, сертификат и похожие камни.
import { useState, type ReactNode } from "react";
import { capitalize, formatCt, formatDate, formatMm, formatPrice, hasPhoto, stoneCode } from "../../lib/format";
import { Breadcrumbs, ButtonLink, HAIRLINE, STONE_GRID, StoneCard, T, TextLink, buttonClass } from "../ui";
import { Lightbox } from "./Lightbox";
import { StoneGallery } from "./StoneGallery";
import type { StoneDetailProps } from "./types";

const CHANNEL_NAMES = { telegram: "Telegram", whatsapp: "WhatsApp", phone: "Позвонить" } as const;

interface PassportRow {
  label: string;
  value: ReactNode;
}

// Пункты «не указано» в паспорте не показываем.
const known = (id: string) => !id.endsWith("-unknown");

export function StoneDetail({
  stone,
  variety,
  cut,
  origin,
  treatment,
  color,
  certificate,
  similarStones,
  contactChannels,
  onInquire,
}: StoneDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = stone.media.filter((m) => hasPhoto(m.url));
  const varietyHref = `/catalog/${variety.slug}`;
  const pluralHeading = capitalize(variety.pluralName);

  const meta = [formatCt(stone.weightCt), known(cut.id) && cut.name, known(origin.id) && origin.country].filter(Boolean).join(" · ");

  const rows: (PassportRow | null)[] = [
    { label: "Вес", value: formatCt(stone.weightCt) },
    stone.dimensionsMm ? { label: "Размеры", value: formatMm(stone.dimensionsMm) } : null,
    known(cut.id) ? { label: "Огранка", value: cut.name } : null,
    {
      label: "Цвет",
      value: (
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="inline-block h-3 w-3 rounded-full border border-black/15" style={{ backgroundColor: color.hex }} />
          {color.name}
        </span>
      ),
    },
    known(origin.id) ? { label: "Происхождение", value: origin.country } : null,
    { label: "Обработка", value: treatment.name },
    stone.characteristics.clarity !== "—" ? { label: "Чистота", value: stone.characteristics.clarity } : null,
    { label: "Блеск", value: stone.characteristics.luster },
    { label: "Твёрдость", value: stone.characteristics.hardness },
    { label: "Преломление", value: stone.characteristics.refractiveIndex },
  ];
  const passport = rows.filter((r): r is PassportRow => Boolean(r?.value));

  return (
    <div className="px-[var(--gutter)] pb-24">
      <div className="pb-6 pt-6 md:pb-8 md:pt-8">
        <Breadcrumbs
          items={[
            { label: "Каталог", href: "/" },
            { label: pluralHeading, href: varietyHref },
            { label: `№ ${stoneCode(stone.slug)}` },
          ]}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-[clamp(32px,3vw,72px)]">
        <div className="lg:col-span-7">
          <StoneGallery stone={stone} media={photos} hex={color.hex} onOpen={setLightboxIndex} />
        </div>

        <aside className="lg:col-span-5">
          {/* Прилипает только там, где колонка помещается в экран целиком, иначе низ паспорта не увидеть. */}
          <div className="lg:top-8 lg:[@media(min-height:880px)]:sticky">
            <p className={T.eyebrow}>{variety.name}</p>
            <h1 className="mt-2 text-balance font-serif text-[36px] font-light leading-[100%] tracking-[-0.01em] md:text-[clamp(44px,3.2vw,68px)] md:leading-[96%]">
              {stone.name}
            </h1>
            <p className={`mt-4 ${T.ui} text-black/60`}>{meta}</p>

            <div className={`mt-8 border-t ${HAIRLINE} pt-6`}>
              <p
                className={`font-serif text-[34px] font-light leading-[100%] md:text-[clamp(36px,2.4vw,52px)] ${
                  stone.isAvailable ? "" : "text-black/40 line-through decoration-1"
                }`}
              >
                {formatPrice(stone.price)}
              </p>
              <p className={`mt-2 ${T.label}`}>{stone.isAvailable ? "Единственный экземпляр" : "Камень продан"}</p>

              {stone.isAvailable ? (
                <button type="button" onClick={() => onInquire?.(stone.id)} className={`mt-6 w-full ${buttonClass("solid")}`}>
                  Оставить заявку
                </button>
              ) : (
                <ButtonLink href={varietyHref} variant="outline" className="mt-6 w-full">
                  Смотреть другие {variety.pluralName}
                </ButtonLink>
              )}

              <div className={`mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 ${T.ui}`}>
                <span className="text-black/48">Написать гемологу:</span>
                {contactChannels.map((ch) => (
                  <TextLink key={ch.type} href={ch.href} target={ch.type === "phone" ? undefined : "_blank"} rel="noopener">
                    {CHANNEL_NAMES[ch.type]}
                  </TextLink>
                ))}
              </div>
            </div>

            <section aria-labelledby="passport" className="mt-10">
              <h2 id="passport" className={T.eyebrow}>
                Паспорт камня
              </h2>
              <dl className="mt-1 grid grid-cols-2 gap-x-8">
                {passport.map((r) => (
                  <div key={r.label} className={`border-b ${HAIRLINE} py-3`}>
                    <dt className={T.label}>{r.label}</dt>
                    <dd className={`mt-0.5 ${T.ui}`}>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <p className={`mt-6 ${T.label}`}>Оплата по договорённости. Доставка Почтой России или курьером.</p>
          </div>
        </aside>
      </div>

      {stone.editorial.length > 0 && (
        <section aria-labelledby="from-gemologist" className={`mt-20 grid gap-6 border-t ${HAIRLINE} pt-12 md:mt-28 md:grid-cols-12 md:pt-16`}>
          <h2 id="from-gemologist" className={`md:col-span-4 ${T.h2}`}>
            От гемолога
          </h2>
          <div className="md:col-span-7 md:col-start-6">
            {stone.editorial.map((p, i) => (
              <p
                key={i}
                className={`font-serif font-light text-[20px] leading-[150%] md:text-[clamp(21px,1.35vw,28px)] md:leading-[145%] ${i ? "mt-5" : ""}`}
              >
                {p}
              </p>
            ))}
            <p className={`mt-6 ${T.label}`}>Дмитрий Салятов, гемолог</p>
          </div>
        </section>
      )}

      {certificate && (
        <section aria-labelledby="certificate" className="mt-16 bg-paper p-[clamp(24px,3vw,56px)] md:mt-20">
          <p id="certificate" className={T.eyebrow}>
            Сертификат
          </p>
          <p className="mt-3 font-serif text-[clamp(32px,2.6vw,52px)] font-light leading-[100%]">{certificate.lab}</p>
          <p className={`mt-3 ${T.ui} text-black/60`}>
            № {certificate.number} · {formatDate(certificate.issuedAt)}
          </p>
          <div className={`mt-6 flex flex-wrap gap-x-8 gap-y-3 ${T.ui}`}>
            <TextLink href={certificate.scanUrl} target="_blank" rel="noopener">
              Посмотреть скан
            </TextLink>
            <TextLink href={certificate.verificationUrl} target="_blank" rel="noopener">
              Проверить на сайте лаборатории ↗
            </TextLink>
          </div>
        </section>
      )}

      {similarStones.length > 0 && (
        <section aria-labelledby="similar" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="similar" className={T.h2}>
              Ещё {variety.pluralName}
            </h2>
            <TextLink href={varietyHref} className={T.ui}>
              Все {variety.pluralName}
            </TextLink>
          </div>
          <ul className={`mt-10 ${STONE_GRID}`}>
            {similarStones.map((s, i) => (
              // При трёх колонках четвёртый камень повис бы один в ряду.
              <li key={s.id} className={i === 3 ? "min-[1024px]:max-[1439px]:hidden" : undefined}>
                <StoneCard stone={s} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {lightboxIndex !== null && (
        <Lightbox media={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </div>
  );
}
