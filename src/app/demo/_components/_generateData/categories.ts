import type { Category } from "~/types";

export const categories: Category[] = [
  {
    name: "Mat",
    match: [
      { name: "city gross" },
      { name: "coop" },
      { name: "hemköp" },
      { name: "ica" },
      { name: "lidl" },
      { name: "willys" },
    ],
  },
  {
    name: "Apotek",
    match: [{ name: "apohem" }, { name: "apotea" }, { name: "apotek" }],
  },
  { name: "Alkohol", match: [{ name: "systembolaget" }] },
  {
    name: "Räkningar",
    match: [
      { name: "avgift bankkort" },
      { name: "ellevio" },
      { name: "hyra" },
      { name: "vattenfall" },
    ],
  },
  {
    name: "Transport",
    match: [
      { name: "apcoa" },
      { name: "easypark" },
      { name: "mobilpark" },
      { name: "okq8" },
      { name: "sj" },
      { name: "sl" },
      { name: "st1" },
      { name: "storstockholms lokaltrafik" },
      { name: "t-bana" },
    ],
  },
] as const;
