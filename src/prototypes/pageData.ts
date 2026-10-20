// Данные, общие для всех прототипов главной: собираются на сборке и уходят в острова.
import { allCatalogStones, catalogVarieties, colors, contactHref } from "../data";

// «Живые» кадры для слайд-шоу во вступлении: камень в руке, в кольце, на коралле.
// Отобраны вручную из фото каталога: [slug камня, файл].
const HERO_SHOTS: [string, string][] = [
  ["0201-fioletovaya-shpinel", "01.jpg"],
  ["0109-zelyonyy-sapfir", "01.jpg"],
  ["0711-zheltyy-topaz", "04.jpg"],
  ["0221-krupnaya-birmanskaya-grozovaya-shpinel", "01.jpg"],
  ["0808-fioletovyy-ametist", "01.jpg"],
  ["0231-siniy-lazurit", "01.jpg"],
  ["0101-oranzhevo-rozovyy-sapfir-padparadzha", "06.jpg"],
  ["0103-zelyonyy-sapfir", "01.jpg"],
];

export function prototypeData() {
  const stones = allCatalogStones();
  const varieties = catalogVarieties()
    .filter((v) => v.stoneCount > 0)
    .sort((a, b) => b.stoneCount - a.stoneCount);
  const bySlug = new Map(stones.map((s) => [s.slug, s]));
  const heroSlides = HERO_SHOTS.flatMap(([slug, file]) => {
    const s = bySlug.get(slug);
    return s ? [{ href: `/stones/${slug}`, src: `/images/stones/${slug}/${file}`, name: s.name, weightCt: s.weightCt }] : [];
  });
  return { stones, varieties, colors, heroSlides, telegramHref: contactHref("telegram") };
}
