// Данные, общие для всех прототипов главной: собираются на сборке и уходят в острова.
import { allCatalogStones, catalogVarieties, colors, contactHref } from "../data";

export function prototypeData() {
  const stones = allCatalogStones();
  const varieties = catalogVarieties()
    .filter((v) => v.stoneCount > 0)
    .sort((a, b) => b.stoneCount - a.stoneCount);
  // Витринный камень для вступления — самый дорогой из доступных.
  const featured = [...stones].filter((s) => s.isAvailable).sort((a, b) => b.price - a.price)[0] ?? stones[0];
  return { stones, varieties, colors, featured, telegramHref: contactHref("telegram") };
}
