export type HairStyle = "wavy" | "receding" | "curly";
export type BeardStyle = "trimmed" | "patriarch" | "bushy";

export type FigureLook = {
  skin: string;
  hair: string;
  beard: string;
  beardW: number;
  beardH: number;
  beardY: number;
  bulk: number;
  hairStyle: HairStyle;
  beardStyle: BeardStyle;
  iris: string;
  nose: number;
  cravat: number;
};

export type Figure = {
  id: string;
  name: string;
  years: string;
  role: string;
  lines: string[];
  portrait: string;
  look: FigureLook;
};

export const FIGURES: Figure[] = [
  {
    id: "leichhardt",
    name: "Ludwig Leichhardt",
    years: "1813–1848",
    role: "Explorer",
    lines: [
      "Prussian naturalist. He landed in Sydney in February 1842 and spent the next years collecting specimens from Newcastle up through Moreton Bay.",
      "In October 1844 he left Jimbour — a Darling Downs squatting run — and walked to Port Essington. The Dawson and the Burdekin took their colonial names on that trip. A second expedition fell apart in the bush.",
      "In April 1848 he left the Downs again, aiming for the west coast. He was not seen after. The colony filed him as an explorer. The country he crossed was already being cut into runs.",
    ],
    portrait: "/portraits/leichhardt.jpg",
    look: {
      skin: "#c4a892",
      hair: "#2a211c",
      beard: "#3a2a22",
      beardW: 0.95,
      beardH: 0.85,
      beardY: -0.08,
      bulk: 0.92,
      hairStyle: "wavy",
      beardStyle: "trimmed",
      iris: "#3a2a18",
      nose: 1.15,
      cravat: 1,
    },
  },
  {
    id: "leslie",
    name: "Patrick Leslie",
    years: "1815–1881",
    role: "Squatter",
    lines: [
      "Scot. He came into Sydney in May 1835. In 1840 he and his brothers Walter and George put sheep on the Darling Downs — Toolburra, then Canning Downs — and the colony called them the first squatters there.",
      "Assigned convicts worked the run. He marked the place that became Warwick. The depression of the early forties broke the venture. He came back with Goomburra.",
      "He sat a few weeks in the New South Wales parliament for the northern seats, then left the colony. He died in Sydney in 1881.",
    ],
    portrait: "/portraits/leslie.jpg",
    look: {
      skin: "#d2bba8",
      hair: "#c8c2b8",
      beard: "#e4e0d8",
      beardW: 1.28,
      beardH: 1.75,
      beardY: -0.15,
      bulk: 1.06,
      hairStyle: "receding",
      beardStyle: "patriarch",
      iris: "#6a7a88",
      nose: 1.05,
      cravat: 0.35,
    },
  },
  {
    id: "petrie",
    name: "Andrew Petrie",
    years: "1798–1872",
    role: "Superintendent of Works",
    lines: [
      "Scot, stonemason and builder. In 1837 Moreton Bay sent for a man who could repair the penal settlement, and Sydney sent him up as Superintendent of Works.",
      "When the district opened to free settlement in 1842, the Petrie family stayed — counted as Brisbane's first free settlers. That year he took a boat north into Wide Bay and the river Governor Gipps named the Mary, on as far as the island.",
      "Sandy blight blinded him not long after. He kept building. His son Tom grew up with Turrbal people and wrote the old names down. The colony put the father first on the plaque.",
    ],
    portrait: "/portraits/petrie.jpg",
    look: {
      skin: "#cbb5a2",
      hair: "#ddd8d0",
      beard: "#f3f0ea",
      beardW: 1.4,
      beardH: 2,
      beardY: -0.17,
      bulk: 1.14,
      hairStyle: "curly",
      beardStyle: "bushy",
      iris: "#4a3828",
      nose: 1.22,
      cravat: 0.4,
    },
  },
];
