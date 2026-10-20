// Статья энциклопедии: вступление 7/5, оглавление со scroll-spy слева, текст справа,
// паспорт вида, материалы журнала и камни вида, которые сейчас есть в коллекции.
import { useEffect, useRef, useState } from "react";
import { capitalize } from "../../lib/format";
import { Breadcrumbs, HAIRLINE, PostCard, STONE_GRID, StoneCard, T, TextLink } from "../ui";
import type { EncyclopediaEntryProps, EntrySectionId } from "./types";

interface SectionDef {
  id: EntrySectionId;
  tocLabel: string;
  heading: string;
  paragraphs: string[];
}

export function EncyclopediaEntry({ variety, entry, stonesInStock, relatedPosts, contactHref }: EncyclopediaEntryProps) {
  const sections: SectionDef[] = [
    { id: "intro", tocLabel: "Что это", heading: `Что такое ${variety.name.toLowerCase()}`, paragraphs: entry.intro },
    { id: "history", tocLabel: "История", heading: "История и происхождение", paragraphs: entry.historyAndOrigins },
    { id: "colors", tocLabel: "Цвета и огранки", heading: "Цвета и огранки", paragraphs: entry.colorsAndCuts },
    { id: "choose", tocLabel: "Как выбирать", heading: "Как выбирать", paragraphs: entry.howToChoose },
  ];

  const properties: { label: string; value: string }[] = [
    { label: "Минеральный класс", value: variety.mineralClass },
    { label: "Формула", value: variety.formula },
    { label: "Твёрдость по Моосу", value: variety.hardness },
    { label: "Плотность", value: variety.density },
    { label: "Показатель преломления", value: variety.refractiveIndex },
    { label: "Сингония", value: variety.crystalSystem },
  ];

  // --- Scroll-spy для оглавления -------------------------------------------
  const [activeSection, setActiveSection] = useState<EntrySectionId>("intro");
  const sectionRefs = useRef<Map<EntrySectionId, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id as EntrySectionId);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = (id: EntrySectionId) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  const catalogHref = `/catalog/${variety.slug}`;
  const plural = variety.pluralName;

  return (
    <div className="px-[var(--gutter)] pb-24">
      <header className="grid gap-8 pb-10 pt-6 md:grid-cols-12 md:pb-[clamp(48px,3.5vw,80px)] md:pt-8">
        <div className="flex flex-col md:col-span-6">
          <Breadcrumbs items={[{ label: "Энциклопедия", href: "/encyclopedia" }, { label: variety.name }]} />
          <div className="mt-8 md:mt-auto md:pt-12">
            <p className={T.eyebrow}>{variety.classLabel}</p>
            <h1 className={`mt-3 ${T.display}`}>{variety.name}</h1>
            <p className={`mt-5 max-w-[46ch] ${T.lead}`}>{entry.heroSubtitle}</p>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="aspect-[3/2] overflow-hidden bg-paper">
            <img src={entry.heroPhotoUrl} alt={variety.name} className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <div className={`grid gap-10 border-t ${HAIRLINE} pt-12 md:pt-16 lg:grid-cols-12`}>
        <nav aria-label="Содержание" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-8">
            <p className={T.eyebrow}>Содержание</p>
            <ol className="mt-4 space-y-2.5">
              {sections.map((s) => {
                const active = s.id === activeSection;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={active ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        sectionRefs.current.get(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`font-serif text-[clamp(18px,1.1vw,22px)] leading-[120%] transition-colors ${
                        active ? "text-emerald" : "text-black/55 hover:text-black"
                      }`}
                    >
                      {s.tocLabel}
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        <article className="lg:col-span-8 lg:col-start-5">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              ref={registerSection(section.id)}
              className={`max-w-[68ch] scroll-mt-8 ${index ? "mt-16" : ""}`}
            >
              <h2 className={T.h2}>{section.heading}</h2>
              <div className="mt-6 space-y-5">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className={`${T.body} text-black/80`}>
                    {p}
                  </p>
                ))}
              </div>

              {index === 0 && (
                <div className="mt-10 bg-paper px-[clamp(20px,2vw,40px)] py-6">
                  <p className={T.eyebrow}>Паспорт вида</p>
                  <dl className="mt-2 grid gap-x-10 sm:grid-cols-2">
                    {properties.map((prop) => (
                      <div key={prop.label} className="border-b border-black/[0.08] py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                        <dt className={T.label}>{prop.label}</dt>
                        <dd className={`mt-0.5 ${T.ui}`}>{prop.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>
          ))}
        </article>
      </div>

      {relatedPosts.length > 0 && (
        <section aria-labelledby="posts" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="posts" className={T.h2}>
              Дмитрий пишет о {variety.pluralPrepositional}
            </h2>
            <TextLink href="/blog" className={T.ui}>
              Весь журнал
            </TextLink>
          </div>
          <ul className="mt-10 grid gap-x-[clamp(32px,2.2vw,56px)] gap-y-12 md:grid-cols-2 min-[1024px]:grid-cols-3">
            {relatedPosts.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="in-stock" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="in-stock" className={T.h2}>
            Сейчас в коллекции
          </h2>
          {stonesInStock.length > 0 && (
            <TextLink href={catalogHref} className={T.ui}>
              {capitalize(plural)} в каталоге
            </TextLink>
          )}
        </div>
        {stonesInStock.length > 0 ? (
          <ul className={`mt-10 ${STONE_GRID}`}>
            {stonesInStock.map((s, i) => (
              <li key={s.id} className={i === 3 ? "min-[1024px]:max-[1439px]:hidden" : undefined}>
                <StoneCard stone={s} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 bg-paper px-[clamp(20px,2vw,40px)] py-8">
            <p className={`max-w-[52ch] ${T.lead}`}>
              Сейчас {plural} нет в наличии. Напишите Дмитрию — он подберёт экземпляр под ваш запрос из частных каналов и
              предстоящих поступлений.
            </p>
            <TextLink href={contactHref} target="_blank" rel="noopener" className={`mt-5 inline-block ${T.ui}`}>
              Написать в Telegram
            </TextLink>
          </div>
        )}
      </section>
    </div>
  );
}
