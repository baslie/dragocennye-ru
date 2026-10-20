import { withBase } from "../lib/format";
import type {
  MasterCut,
  MasterOrigin,
  MasterTreatment,
  MasterColor,
  MasterCertificate,
} from "./model";

export const cuts: MasterCut[] = [
  { id: "c-cushion", slug: "cushion", name: "Кушон" },
  { id: "c-oval", slug: "oval", name: "Овал" },
  { id: "c-pear", slug: "pear", name: "Груша" },
  { id: "c-octagon", slug: "octagon", name: "Октагон" },
  { id: "c-trillion", slug: "trillion", name: "Триллион" },
  { id: "c-princess", slug: "princess", name: "Принцесса" },
  { id: "c-marquise", slug: "marquise", name: "Маркиза" },
  { id: "c-round", slug: "round", name: "Круг" },
  { id: "c-cabochon", slug: "cabochon", name: "Кабошон" },
  { id: "c-baguette", slug: "baguette", name: "Багет" },
  { id: "c-asscher", slug: "asscher", name: "Ашер" },
  { id: "c-square", slug: "square", name: "Квадрат" },
  { id: "c-heart", slug: "heart", name: "Сердце" },
  { id: "c-carving", slug: "carving", name: "Резьба" },
  { id: "c-unknown", slug: "unknown", name: "Не указана" },
];

export const origins: MasterOrigin[] = [
  { id: "o-tanzania", slug: "tanzania", name: "Танзания", country: "Танзания" },
  { id: "o-madagascar", slug: "madagascar", name: "Мадагаскар", country: "Мадагаскар" },
  { id: "o-mozambique", slug: "mozambique", name: "Мозамбик", country: "Мозамбик" },
  { id: "o-sri-lanka", slug: "sri-lanka", name: "Шри-Ланка", country: "Шри-Ланка" },
  { id: "o-brazil", slug: "brazil", name: "Бразилия", country: "Бразилия" },
  { id: "o-myanmar", slug: "myanmar", name: "Мьянма", country: "Мьянма" },
  { id: "o-colombia", slug: "colombia", name: "Колумбия", country: "Колумбия" },
  { id: "o-africa", slug: "africa", name: "Африка", country: "Африка" },
  { id: "o-nigeria", slug: "nigeria", name: "Нигерия", country: "Нигерия" },
  { id: "o-cambodia", slug: "cambodia", name: "Камбоджа", country: "Камбоджа" },
  { id: "o-mexico", slug: "mexico", name: "Мексика", country: "Мексика" },
  { id: "o-ethiopia", slug: "ethiopia", name: "Эфиопия", country: "Эфиопия" },
  { id: "o-bolivia", slug: "bolivia", name: "Боливия", country: "Боливия" },
  { id: "o-australia", slug: "australia", name: "Австралия", country: "Австралия" },
  { id: "o-russia", slug: "russia", name: "Россия", country: "Россия" },
  { id: "o-namibia", slug: "namibia", name: "Намибия", country: "Намибия" },
  { id: "o-afghanistan", slug: "afghanistan", name: "Афганистан", country: "Афганистан" },
  { id: "o-india", slug: "india", name: "Индия", country: "Индия" },
  { id: "o-pakistan", slug: "pakistan", name: "Пакистан", country: "Пакистан" },
  { id: "o-thailand", slug: "thailand", name: "Таиланд", country: "Таиланд" },
  { id: "o-unknown", slug: "unknown", name: "Не указано", country: "Не указано" },
];

export const treatments: MasterTreatment[] = [
  {
    id: "t-unheated",
    slug: "unheated",
    name: "Негретый",
    description:
      "Камень не подвергался термической обработке — природный цвет и чистота. Ценится премией к цене.",
  },
  {
    id: "t-heated",
    slug: "heated",
    name: "Нагретый",
    description:
      "Стандартный нагрев для улучшения цвета и чистоты — принятая мировая практика для корундов.",
  },
  {
    id: "t-oiled",
    slug: "oiled",
    name: "Промасленный",
    description:
      "Трещины заполнены маслом с близким показателем преломления для улучшения видимой чистоты — обычная практика для бериллов и турмалинов.",
  },
];

export const colors: MasterColor[] = [
  { id: "col-green", slug: "green", name: "Зелёный", hex: "#4F8A5C" },
  { id: "col-blue", slug: "blue", name: "Синий", hex: "#2E5E8A" },
  { id: "col-pink", slug: "pink", name: "Розовый", hex: "#D87AA0" },
  { id: "col-yellow", slug: "yellow", name: "Жёлтый", hex: "#E8C547" },
  { id: "col-white", slug: "white", name: "Белый", hex: "#F2F0EA" },
  { id: "col-violet", slug: "violet", name: "Фиолетовый", hex: "#7B4E9E" },
  { id: "col-orange", slug: "orange", name: "Оранжевый", hex: "#E88A47" },
  { id: "col-red", slug: "red", name: "Красный", hex: "#B83A3A" },
  { id: "col-black", slug: "black", name: "Чёрный", hex: "#2B2B30" },
  { id: "col-brown", slug: "brown", name: "Коричневый", hex: "#7A5230" },
  { id: "col-grey", slug: "grey", name: "Серый", hex: "#C9C7C0" },
];

export const certificates: MasterCertificate[] = [
  {
    id: "cert-grs-2401",
    lab: "GRS",
    number: "2401-12847",
    issuedAt: "2026-01-14",
    scanUrl: withBase("/certificates/grs-2401-12847.pdf"),
    verificationUrl: "https://www.gemresearch.ch/check/2401-12847",
  },
  {
    id: "cert-gia-2402",
    lab: "GIA",
    number: "2402-35519",
    issuedAt: "2026-01-20",
    scanUrl: withBase("/certificates/gia-2402-35519.pdf"),
    verificationUrl: "https://www.gia.edu/report-check?reportno=2402-35519",
  },
  {
    id: "cert-ssef-2403",
    lab: "SSEF",
    number: "2403-80217",
    issuedAt: "2026-02-02",
    scanUrl: withBase("/certificates/ssef-2403-80217.pdf"),
    verificationUrl: "https://www.ssef.ch/report-check/2403-80217",
  },
  {
    id: "cert-grs-2404",
    lab: "GRS",
    number: "2404-41002",
    issuedAt: "2026-02-15",
    scanUrl: withBase("/certificates/grs-2404-41002.pdf"),
    verificationUrl: "https://www.gemresearch.ch/check/2404-41002",
  },
  {
    id: "cert-gia-2405",
    lab: "GIA",
    number: "2405-66731",
    issuedAt: "2026-02-28",
    scanUrl: withBase("/certificates/gia-2405-66731.pdf"),
    verificationUrl: "https://www.gia.edu/report-check?reportno=2405-66731",
  },
];
