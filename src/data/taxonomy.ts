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
];

export const origins: MasterOrigin[] = [
  { id: "o-tanzania", slug: "tanzania", name: "Танзания", country: "Танзания" },
  { id: "o-madagascar", slug: "madagascar", name: "Мадагаскар", country: "Мадагаскар" },
  { id: "o-mozambique", slug: "mozambique", name: "Мозамбик", country: "Мозамбик" },
  { id: "o-sri-lanka", slug: "sri-lanka", name: "Шри-Ланка", country: "Шри-Ланка" },
  { id: "o-brazil", slug: "brazil", name: "Бразилия", country: "Бразилия" },
  { id: "o-myanmar", slug: "myanmar", name: "Мьянма", country: "Мьянма" },
  { id: "o-colombia", slug: "colombia", name: "Колумбия", country: "Колумбия" },
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
];

export const certificates: MasterCertificate[] = [
  {
    id: "cert-grs-2401",
    lab: "GRS",
    number: "2401-12847",
    issuedAt: "2026-01-14",
    scanUrl: "/certificates/grs-2401-12847.pdf",
    verificationUrl: "https://www.gemresearch.ch/check/2401-12847",
  },
  {
    id: "cert-gia-2402",
    lab: "GIA",
    number: "2402-35519",
    issuedAt: "2026-01-20",
    scanUrl: "/certificates/gia-2402-35519.pdf",
    verificationUrl: "https://www.gia.edu/report-check?reportno=2402-35519",
  },
  {
    id: "cert-ssef-2403",
    lab: "SSEF",
    number: "2403-80217",
    issuedAt: "2026-02-02",
    scanUrl: "/certificates/ssef-2403-80217.pdf",
    verificationUrl: "https://www.ssef.ch/report-check/2403-80217",
  },
  {
    id: "cert-grs-2404",
    lab: "GRS",
    number: "2404-41002",
    issuedAt: "2026-02-15",
    scanUrl: "/certificates/grs-2404-41002.pdf",
    verificationUrl: "https://www.gemresearch.ch/check/2404-41002",
  },
  {
    id: "cert-gia-2405",
    lab: "GIA",
    number: "2405-66731",
    issuedAt: "2026-02-28",
    scanUrl: "/certificates/gia-2405-66731.pdf",
    verificationUrl: "https://www.gia.edu/report-check?reportno=2405-66731",
  },
];
