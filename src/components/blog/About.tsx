// Страница гемолога: портрет и вступление с цифрами, путь, подход, свежие материалы и связь.
// Без интерактива — рендерится на сборке.
import { ButtonLink, HAIRLINE, PostCard, T, TextLink } from "../ui";
import { Portrait } from "./Portrait";
import type { AboutProps } from "./types";

export function About({ gemologist, recentPosts, contactHrefs }: AboutProps) {
  return (
    <div className="px-[var(--gutter)] pb-24">
      <header className="grid gap-8 pb-12 pt-8 md:grid-cols-12 md:gap-[clamp(32px,3vw,72px)] md:pb-[clamp(56px,4vw,96px)] md:pt-[clamp(40px,3vw,72px)]">
        <Portrait
          url={gemologist.portraitUrl}
          name={gemologist.name}
          className="aspect-[4/5] md:col-span-5"
          initialsClass="text-[clamp(72px,7vw,140px)] leading-[100%]"
        />
        <div className="flex flex-col md:col-span-7">
          <p className={T.eyebrow}>{gemologist.role}</p>
          <h1 className={`mt-4 ${T.display}`}>{gemologist.name}</h1>
          <div className="mt-8 max-w-[56ch] space-y-4">
            {gemologist.intro.map((p, i) => (
              <p key={i} className={`${T.body} text-black/80`}>
                {p}
              </p>
            ))}
          </div>

          {gemologist.stats.length > 0 && (
            <dl className={`mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t ${HAIRLINE} pt-8 sm:grid-cols-4 md:mt-auto`}>
              {gemologist.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-serif text-[clamp(40px,3.2vw,64px)] font-light leading-[100%]">{s.value}</span>
                    <span className={`mt-2 block ${T.label}`}>{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <section aria-labelledby="path" className={`grid gap-8 border-t ${HAIRLINE} pt-12 md:grid-cols-12 md:pt-16`}>
        <div className="md:col-span-4">
          <p className={T.eyebrow}>Путь</p>
          <h2 id="path" className={`mt-3 ${T.h2}`}>
            Образование и опыт
          </h2>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {gemologist.timeline.map((item) => (
            <li key={item.year} className={`grid gap-2 border-b ${HAIRLINE} py-6 first:pt-0 sm:grid-cols-[140px_1fr] sm:gap-8`}>
              <span className="font-serif text-[22px] font-light leading-[120%] text-emerald">{item.year}</span>
              <div>
                <p className={T.h4}>{item.title}</p>
                <p className={`mt-2 ${T.lead}`}>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="approach" className={`mt-20 grid gap-8 border-t ${HAIRLINE} pt-12 md:mt-28 md:grid-cols-12 md:pt-16`}>
        <div className="md:col-span-4">
          <p className={T.eyebrow}>Принципы</p>
          <h2 id="approach" className={`mt-3 ${T.h2}`}>
            Подход к подбору
          </h2>
        </div>
        <div className="space-y-6 md:col-span-7 md:col-start-6">
          {gemologist.approach.map((p, i) => (
            <p key={i} className="font-serif text-[20px] font-light leading-[150%] md:text-[clamp(21px,1.35vw,28px)] md:leading-[145%]">
              {p}
            </p>
          ))}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section aria-labelledby="journal" className={`mt-20 border-t ${HAIRLINE} pt-12 md:mt-28 md:pt-16`}>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="journal" className={T.h2}>
              Из журнала
            </h2>
            <TextLink href="/blog" className={T.ui}>
              Все публикации
            </TextLink>
          </div>
          <ul className="mt-10 grid gap-x-[clamp(32px,2.2vw,56px)] gap-y-12 md:grid-cols-2 min-[1024px]:grid-cols-3">
            {recentPosts.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="contact" className="mt-20 bg-paper px-[clamp(24px,4vw,96px)] py-[clamp(48px,5vw,112px)] text-center md:mt-28">
        <h2 id="contact" className={T.h2}>
          Напишите Дмитрию
        </h2>
        <p className={`mx-auto mt-4 max-w-[46ch] ${T.lead}`}>
          Подберём камень под задачу — из коллекции или под заказ с международных аукционов.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {gemologist.contacts.map((c, i) => (
            <ButtonLink
              key={c.channel}
              href={contactHrefs[c.channel]}
              variant={i === 0 ? "solid" : "outline"}
              target={c.channel === "phone" ? undefined : "_blank"}
              rel="noopener"
              className="min-w-[200px]"
            >
              {c.channel === "phone" ? "Позвонить" : c.label}
            </ButtonLink>
          ))}
        </div>
      </section>
    </div>
  );
}
