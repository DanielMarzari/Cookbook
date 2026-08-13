/** The six mockups. Each is a different answer to the same question — how do
 *  you actually plan a board — sharing one data layer underneath, so swapping
 *  between them shows the idea rather than six different datasets. */
export interface Mockup {
  id: string;
  /** Route segment under /charcuterie. */
  slug: string;
  name: string;
  /** One line on what makes this one different. */
  tagline: string;
  /** The pitch, for the hub cards. */
  blurb: string;
  /** What this direction is good at, and what it costs you. */
  bestFor: string;
  /** Accent colour, so each mockup has its own identity. */
  accent: string;
  /** Short list of the distinguishing features. */
  features: string[];
}

export const MOCKUPS: Mockup[] = [
  {
    id: "studio",
    slug: "studio",
    name: "Studio",
    tagline: "Guided zones on a real board silhouette.",
    blurb:
      "The considered default. Pick a board and an arrangement, hover a section to see its true shape, click to fill it from ranked suggestions. Everything is laid out for you; you're filling in the blanks.",
    bestFor: "Planning a specific board properly. Most structure, least freedom.",
    accent: "#111111",
    features: [
      "6 board silhouettes × 13 arrangements",
      "Dashed outline traces the real section shape",
      "Balance meter, Board Doctor, shopping list",
    ],
  },
  {
    id: "atelier",
    slug: "atelier",
    name: "Atelier",
    tagline: "Drag anything anywhere. No zones, no rules.",
    blurb:
      "A real freeform builder. Drag ingredients out of the tray onto the board, then move, scale, rotate and layer them by hand. The board is a canvas rather than a form.",
    bestFor: "Composing something specific you already have in your head.",
    accent: "#111111",
    features: [
      "Drag, scale, rotate, layer, nudge with arrow keys",
      "Live coverage and colour readout as you place",
      "Snap-free — deliberately, because food isn't on a grid",
    ],
  },
  {
    id: "editorial",
    slug: "editorial",
    name: "Editorial",
    tagline: "The board builds itself as you scroll.",
    blurb:
      "A warm, printed-magazine take. Scroll and the board assembles one stage at a time, in the order you'd actually build it — bowls, then cheese, then meat, then the fill.",
    bestFor: "Reading and following along while you build in the kitchen.",
    accent: "#111111",
    features: [
      "Scroll-driven assembly, stage by stage",
      "Light editorial theme with serif display type",
      "Doubles as the printable build guide",
    ],
  },
  {
    id: "console",
    slug: "console",
    name: "Console",
    tagline: "Keyboard-first. ⌘K everything.",
    blurb:
      "For people who resent the mouse. A command palette drives the whole board, with a dense pairing matrix and a table view of the catalogue. Nothing is more than three keystrokes away.",
    bestFor: "Working fast through a large catalogue.",
    accent: "#111111",
    features: [
      "⌘K palette: add, swap, theme, clear",
      "Pairing-matrix heatmap across the whole catalogue",
      "Full keyboard navigation, no pointer required",
    ],
  },
  {
    id: "pocket",
    slug: "pocket",
    name: "Pocket",
    tagline: "Swipe yes or no. It builds the board.",
    blurb:
      "Phone-shaped and decision-light. Flick through a stack of ingredient cards — right to keep, left to skip — and the board composes itself out of what you kept.",
    bestFor: "Deciding what you want when you don't know yet.",
    accent: "#111111",
    features: [
      "Drag-to-swipe card stack with spring physics",
      "Each card explains why it's being offered",
      "Board assembles live from your keeps",
    ],
  },
  {
    id: "web",
    slug: "web",
    name: "Web",
    tagline: "Walk the flavour graph.",
    blurb:
      "The pairing data as the interface. A live force-directed network of every ingredient and every relationship between them — click through it and the path you walk becomes your board.",
    bestFor: "Exploring why things go together, and finding the unobvious.",
    accent: "#111111",
    features: [
      "Force simulation over the neighbourhood you're exploring",
      "Edges weighted by real pairing strength",
      "Your click path becomes the board",
    ],
  },
];

export function getMockup(slug: string): Mockup | undefined {
  return MOCKUPS.find((m) => m.slug === slug);
}
