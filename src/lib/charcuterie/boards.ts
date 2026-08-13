import {
  blob,
  circle,
  livePlank,
  paddle,
  polar,
  roundedRect,
  spokes,
  tile,
  wedge,
  ribbon,
  type Shape,
} from "./geometry";
import type { Board, Pattern, Role, Zone } from "./types";

/** Default coaching copy per role. Individual zones can override either field —
 *  the hero cheese and the cracker river both say something more specific. */
const ROLE_COPY: Record<Role, { label: string; hint: string }> = {
  cheese: {
    label: "Cheese",
    hint: "Place cheese first — it's the heaviest thing on the board and everything else arranges around it.",
  },
  meat: {
    label: "Cured meat",
    hint: "Folds and ruffles, never flat. Aim for more air than meat.",
  },
  fruit: {
    label: "Fresh fruit",
    hint: "Colour and juice. Cut it so an interior face is showing.",
  },
  dried: {
    label: "Dried fruit",
    hint: "Chewy and sweet, and the right size for the gaps nothing else fits.",
  },
  cracker: {
    label: "Crackers & bread",
    hint: "The vehicle. Cascade them — a neat stack looks like a waiting room.",
  },
  spread: {
    label: "Bowl",
    hint: "Anything wet needs a vessel. Put the bowls down first; they anchor the whole layout.",
  },
  nut: {
    label: "Nuts",
    hint: "Nuts exist to fill geometry — spoon them into the triangles between round things.",
  },
  briny: {
    label: "Briny bite",
    hint: "Salt and acid to reset the palate between rich mouthfuls. Don't forget a bowl for the pits.",
  },
  sweet: {
    label: "Something sweet",
    hint: "The full stop at the end of the board.",
  },
  garnish: {
    label: "Garnish",
    hint: "Goes in last, tucked into the negative space. Never on top of the food.",
  },
  veg: {
    label: "Crudité",
    hint: "Something raw and crunchy. Cut on a steep bias so the pieces stand up rather than lying flat.",
  },
  flex: {
    label: "Free space",
    hint: "Whatever the board is missing. Check the balance readout and fill the gap.",
  },
};

export function roleCopy(role: Role) {
  return ROLE_COPY[role];
}

type ZoneOpts = {
  label?: string;
  hint?: string;
  size?: Zone["size"];
};

function z(id: string, role: Role, shape: Shape, opts: ZoneOpts = {}): Zone {
  const copy = ROLE_COPY[role];
  return {
    id,
    role,
    label: opts.label ?? copy.label,
    hint: opts.hint ?? copy.hint,
    d: shape.d,
    center: shape.center,
    bbox: shape.bbox,
    size: opts.size ?? "major",
  };
}

// ─── The Plank ───────────────────────────────────────────────────────────────

const plankOutline = livePlank(30, 45, 940, 370, "plank-edge", 8);

const plankRiverBanks: Pattern = {
  id: "river-banks",
  name: "River & Banks",
  tagline: "A cracker river down the middle, cheese on one bank, meat on the other.",
  zones: [
    z(
      "pr-river",
      "cracker",
      ribbon(
        [
          [90, 235],
          [250, 200],
          [420, 255],
          [600, 205],
          [780, 245],
          [900, 225],
        ],
        46,
      ),
      {
        label: "The cracker river",
        hint: "A meandering line of crackers splits the board and gives everything else a bank to sit on. Overlap them like fallen dominoes.",
        size: "hero",
      },
    ),
    z("pr-spread", "spread", blob(105, 112, 46, 46, "pr-spread"), { size: "minor" }),
    z("pr-cheese-1", "cheese", blob(265, 108, 88, 55, "pr-cheese-1"), {
      label: "Cheese anchor",
      hint: "The biggest thing on the board. Put it down first, slightly off-centre, and build outward from it.",
      size: "hero",
    }),
    z("pr-cheese-2", "cheese", blob(500, 110, 72, 52, "pr-cheese-2"), { size: "major" }),
    z("pr-meat-1", "meat", blob(700, 108, 68, 52, "pr-meat-1"), {
      label: "Salami rose",
      hint: "The showpiece. Drape slices over a wine glass rim, invert onto the board, lift the glass away.",
      size: "major",
    }),
    z("pr-fruit-1", "fruit", blob(880, 110, 62, 50, "pr-fruit-1"), { size: "minor" }),
    z("pr-fruit-2", "fruit", blob(120, 348, 62, 48, "pr-fruit-2"), { size: "minor" }),
    z("pr-meat-2", "meat", blob(300, 352, 82, 52, "pr-meat-2"), { size: "major" }),
    z("pr-cheese-3", "cheese", blob(510, 350, 70, 50, "pr-cheese-3"), { size: "major" }),
    z("pr-nut", "nut", blob(680, 350, 55, 42, "pr-nut"), { size: "minor" }),
    z("pr-briny", "briny", blob(860, 348, 58, 48, "pr-briny"), { size: "minor" }),
  ],
};

const plankThirds: Pattern = {
  id: "rule-of-thirds",
  name: "Rule of Thirds",
  tagline: "Three big anchors, evenly spaced, with small stuff filling the seams.",
  zones: [
    z("pt-cracker", "cracker", blob(95, 225, 45, 130, "pt-cracker"), {
      hint: "A tall column of crackers along the short edge. Stand them on end so they read as a wall, not a puddle.",
      size: "major",
    }),
    z("pt-cheese", "cheese", blob(275, 190, 118, 105, "pt-cheese"), {
      label: "Cheese anchor",
      hint: "One of three equal heroes. Odd numbers plate better than even ones — that's why there are three.",
      size: "hero",
    }),
    z("pt-nut", "nut", blob(285, 360, 55, 40, "pt-nut"), { size: "accent" }),
    z("pt-meat", "meat", blob(540, 200, 115, 110, "pt-meat"), { size: "hero" }),
    z("pt-spread", "spread", blob(540, 360, 48, 40, "pt-spread"), { size: "accent" }),
    z("pt-sweet", "sweet", blob(692, 360, 45, 38, "pt-sweet"), { size: "accent" }),
    z("pt-fruit", "fruit", blob(800, 195, 112, 105, "pt-fruit"), { size: "hero" }),
    z("pt-briny", "briny", blob(800, 358, 52, 42, "pt-briny"), { size: "accent" }),
  ],
};

const plankLongGraze: Pattern = {
  id: "long-graze",
  name: "The Long Graze",
  tagline: "Alternating bands for a crowd — nobody has to reach across anyone.",
  zones: (() => {
    const rowA: Role[] = ["cheese", "meat", "cracker", "cheese", "fruit", "meat", "spread"];
    const rowB: Role[] = ["fruit", "cracker", "briny", "nut", "cheese", "dried", "garnish"];
    const zones: Zone[] = [];
    for (let i = 0; i < 7; i++) {
      const x = 105 + (i * (895 - 105)) / 6;
      zones.push(
        z(`pl-a${i}`, rowA[i], blob(x, 145, 58, 62, `pl-a${i}`), { size: "minor" }),
      );
      zones.push(
        z(`pl-b${i}`, rowB[i], blob(x, 315, 58, 62, `pl-b${i}`), { size: "minor" }),
      );
    }
    return zones;
  })(),
};

const plank: Board = {
  id: "plank",
  name: "The Plank",
  blurb: "Live-edge walnut, long and narrow. The workhorse.",
  seats: "6–10 guests",
  surface: "walnut",
  viewBox: [1000, 460],
  outline: plankOutline.d,
  patterns: [plankRiverBanks, plankThirds, plankLongGraze],
};

// ─── The Round ───────────────────────────────────────────────────────────────

const RC = 360;
const roundOutline = circle(RC, RC, 320);

const roundSpokeHub: Pattern = {
  id: "spoke-hub",
  name: "Spoke & Hub",
  tagline: "A bowl in the middle, six wedges radiating out. Reads from every seat.",
  zones: (() => {
    const roles: Role[] = ["cheese", "meat", "cracker", "fruit", "briny", "nut"];
    const angles = spokes(6);
    const zones: Zone[] = [
      z("rs-hub", "spread", blob(RC, RC, 62, 62, "rs-hub"), {
        label: "The hub",
        hint: "A bowl dead centre gives the whole board a point to orbit. Honey, jam, or good olive oil.",
        size: "major",
      }),
    ];
    for (let i = 0; i < 6; i++) {
      zones.push(
        z(`rs-w${i}`, roles[i], wedge(RC, RC, 86, 300, angles[i], angles[i + 1]), {
          size: i === 0 ? "hero" : "major",
        }),
      );
    }
    return zones;
  })(),
};

const roundBullseye: Pattern = {
  id: "bullseye",
  name: "Bullseye",
  tagline: "Concentric rings — rich in the middle, snacky at the rim.",
  zones: (() => {
    const inner: Role[] = ["cheese", "meat", "cheese", "fruit", "cracker"];
    const outer: Role[] = [
      "fruit",
      "nut",
      "dried",
      "briny",
      "cracker",
      "garnish",
      "sweet",
      "meat",
    ];
    const zones: Zone[] = [
      z("rb-hub", "spread", blob(RC, RC, 54, 54, "rb-hub"), { size: "minor" }),
    ];
    const a5 = spokes(5);
    for (let i = 0; i < 5; i++) {
      zones.push(
        z(`rb-i${i}`, inner[i], wedge(RC, RC, 76, 175, a5[i], a5[i + 1]), {
          size: "major",
        }),
      );
    }
    const a8 = spokes(8, 22.5);
    for (let i = 0; i < 8; i++) {
      zones.push(
        z(`rb-o${i}`, outer[i], wedge(RC, RC, 190, 300, a8[i], a8[i + 1]), {
          size: "minor",
        }),
      );
    }
    return zones;
  })(),
};

const roundQuarters: Pattern = {
  id: "quarters",
  name: "Quarters",
  tagline: "Four fat corners and a bowl. The easiest round board to actually build.",
  zones: (() => {
    const quad: Role[] = ["cheese", "meat", "fruit", "cracker"];
    const edge: Role[] = ["nut", "briny", "dried", "garnish"];
    const zones: Zone[] = [
      z("rq-hub", "spread", blob(RC, RC, 58, 58, "rq-hub"), { size: "minor" }),
    ];
    for (let i = 0; i < 4; i++) {
      const [x, y] = polar(RC, RC, 165, 45 + i * 90);
      zones.push(
        z(`rq-q${i}`, quad[i], blob(x, y, 118, 112, `rq-q${i}`), {
          size: i === 0 ? "hero" : "major",
        }),
      );
    }
    for (let i = 0; i < 4; i++) {
      const [x, y] = polar(RC, RC, 258, i * 90);
      zones.push(
        z(`rq-e${i}`, edge[i], blob(x, y, 48, 44, `rq-e${i}`), { size: "accent" }),
      );
    }
    return zones;
  })(),
};

const round: Board = {
  id: "round",
  name: "The Round",
  blurb: "A big olivewood circle. No head of the table.",
  seats: "4–8 guests",
  surface: "olivewood",
  viewBox: [720, 720],
  outline: roundOutline.d,
  patterns: [roundSpokeHub, roundBullseye, roundQuarters],
};

// ─── The Paddle ──────────────────────────────────────────────────────────────

const PX = 330;
const PY = 280;
const paddleOutline = paddle(PX, PY, 245, 230, 72);

const paddleTwoAnchors: Pattern = {
  id: "two-anchors",
  name: "Two Anchors",
  tagline: "Two cheeses at opposite poles, a meat sweep between, a bowl on the handle.",
  zones: [
    z("pa-cheese-1", "cheese", blob(255, 175, 100, 80, "pa-cheese-1"), {
      label: "Cheese anchor",
      hint: "Anchor one. Place it off-centre — dead centre on a round board looks like a target.",
      size: "hero",
    }),
    z("pa-meat", "meat", blob(255, 400, 95, 72, "pa-meat"), { size: "major" }),
    z(
      "pa-river",
      "cracker",
      ribbon(
        [
          [430, 150],
          [495, 250],
          [470, 380],
        ],
        50,
      ),
      {
        label: "Cracker run",
        hint: "A curved run of crackers following the board's edge. Let it echo the circle.",
        size: "major",
      },
    ),
    z("pa-fruit", "fruit", blob(380, 100, 58, 44, "pa-fruit"), { size: "minor" }),
    z("pa-nut", "nut", blob(405, 445, 42, 34, "pa-nut"), { size: "minor" }),
    z("pa-spread", "spread", blob(160, 285, 48, 45, "pa-spread"), { size: "minor" }),
    z("pa-handle", "briny", blob(640, 280, 30, 28, "pa-handle"), {
      label: "Handle bowl",
      hint: "A tiny bowl parked on the handle. Olives, cornichons — and a second empty one for the pits.",
      size: "accent",
    }),
  ],
};

const paddleCrescent: Pattern = {
  id: "crescent-sweep",
  name: "Crescent Sweep",
  tagline: "A ring of everything sweeping around one central bowl.",
  zones: (() => {
    const ring: { role: Role; a0: number; a1: number }[] = [
      { role: "cheese", a0: -20, a1: 40 },
      { role: "fruit", a0: 40, a1: 110 },
      { role: "cracker", a0: 110, a1: 170 },
      { role: "meat", a0: 170, a1: 280 },
      { role: "briny", a0: 280, a1: 340 },
    ];
    const zones: Zone[] = [
      z("pc-hub", "spread", blob(PX, PY, 58, 55, "pc-hub"), {
        label: "Centre bowl",
        hint: "Everything sweeps around this. Make it something that drips — honey, or a good oil.",
        size: "major",
      }),
    ];
    for (const r of ring) {
      zones.push(
        z(`pc-${r.role}`, r.role, wedge(PX, PY, 80, 230, r.a0, r.a1), {
          size: r.role === "meat" ? "hero" : "major",
        }),
      );
    }
    zones.push(
      z("pc-handle", "nut", blob(640, 280, 30, 28, "pc-handle"), {
        label: "Handle bowl",
        hint: "Nuts on the handle, where people reach past everything else to get them.",
        size: "accent",
      }),
    );
    return zones;
  })(),
};

const paddleBoard: Board = {
  id: "paddle",
  name: "The Paddle",
  blurb: "Round head, long handle. Built for carrying in full.",
  seats: "3–6 guests",
  surface: "olivewood",
  viewBox: [860, 560],
  outline: paddleOutline.d,
  patterns: [paddleTwoAnchors, paddleCrescent],
};

// ─── The Slate ───────────────────────────────────────────────────────────────

const slateOutline = roundedRect(40, 40, 820, 500, 18);

const slateDiagonal: Pattern = {
  id: "diagonal-drift",
  name: "Diagonal Drift",
  tagline: "A diagonal spine across the rectangle. Motion, on a board that has none.",
  zones: [
    z(
      "sd-river",
      "cracker",
      ribbon(
        [
          [110, 120],
          [330, 250],
          [560, 330],
          [800, 460],
        ],
        58,
      ),
      {
        label: "The diagonal",
        hint: "A rectangle's worst habit is looking like a grid. One strong diagonal fixes it.",
        size: "hero",
      },
    ),
    z("sd-cheese-1", "cheese", blob(330, 110, 95, 60, "sd-cheese-1"), {
      label: "Cheese anchor",
      hint: "Sit it above the diagonal so the eye travels down and across.",
      size: "hero",
    }),
    z("sd-meat-1", "meat", blob(560, 175, 88, 58, "sd-meat-1"), { size: "major" }),
    z("sd-cheese-2", "cheese", blob(760, 235, 75, 52, "sd-cheese-2"), { size: "major" }),
    z("sd-spread", "spread", blob(790, 110, 55, 48, "sd-spread"), { size: "minor" }),
    z("sd-nut", "nut", blob(692, 120, 40, 35, "sd-nut"), { size: "accent" }),
    z("sd-fruit-1", "fruit", blob(150, 320, 80, 62, "sd-fruit-1"), { size: "major" }),
    z("sd-meat-2", "meat", blob(330, 420, 88, 65, "sd-meat-2"), { size: "major" }),
    z("sd-fruit-2", "fruit", blob(560, 470, 78, 55, "sd-fruit-2"), { size: "minor" }),
    z("sd-briny", "briny", blob(110, 470, 55, 45, "sd-briny"), { size: "minor" }),
  ],
};

const slateNine: Pattern = {
  id: "nine-squares",
  name: "Nine Squares",
  tagline: "A strict grid, softened at the corners. Modern, graphic, very tidy.",
  zones: (() => {
    const roles: Role[] = [
      "cheese",
      "meat",
      "fruit",
      "cracker",
      "cheese",
      "briny",
      "nut",
      "spread",
      "dried",
    ];
    const xs = [190, 450, 710];
    const ys = [148, 290, 432];
    const zones: Zone[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const i = r * 3 + c;
        const id = `sn-${r}${c}`;
        zones.push(
          z(id, roles[i], tile(xs[c], ys[r], 150, id), {
            size: i === 4 ? "hero" : "minor",
            hint:
              i === 4
                ? "The centre square carries the whole grid. Put the best thing you bought right here."
                : undefined,
          }),
        );
      }
    }
    return zones;
  })(),
};

const slate: Board = {
  id: "slate",
  name: "The Slate",
  blurb: "Dark stone. Everything pale looks twice as good on it.",
  seats: "4–8 guests",
  surface: "slate",
  viewBox: [900, 580],
  outline: slateOutline.d,
  patterns: [slateDiagonal, slateNine],
};

// ─── The Wreath ──────────────────────────────────────────────────────────────

const wreathOutline = circle(RC, RC, 320);

const wreathRing: Pattern = {
  id: "holiday-wreath",
  name: "Holiday Wreath",
  tagline: "A ring of eight segments around a centre bowl. Garnish the seams and it's a wreath.",
  zones: (() => {
    const roles: Role[] = [
      "cheese",
      "meat",
      "cracker",
      "fruit",
      "nut",
      "briny",
      "dried",
      "garnish",
    ];
    const a = spokes(8);
    const zones: Zone[] = [
      z("wr-hub", "spread", blob(RC, RC, 85, 85, "wr-hub"), {
        label: "Centre bowl",
        hint: "A wide bowl in the middle is what turns a ring into a wreath. Anything but empty.",
        size: "major",
      }),
    ];
    for (let i = 0; i < 8; i++) {
      zones.push(
        z(`wr-${i}`, roles[i], wedge(RC, RC, 150, 290, a[i], a[i + 1], { gap: 3 }), {
          size: "minor",
          hint:
            roles[i] === "garnish"
              ? "Rosemary here, and more of it pushed into every seam between segments. That's the wreath effect."
              : undefined,
        }),
      );
    }
    return zones;
  })(),
};

const wreath: Board = {
  id: "wreath",
  name: "The Wreath",
  blurb: "A ring board for the holidays. Rosemary in every seam.",
  seats: "6–12 guests",
  surface: "marble",
  viewBox: [720, 720],
  outline: wreathOutline.d,
  patterns: [wreathRing],
};

// ─── The Grazing Runner ──────────────────────────────────────────────────────

const runnerOutline = roundedRect(20, 40, 1200, 380, 10);

const runnerEndless: Pattern = {
  id: "endless-table",
  name: "Endless Table",
  tagline: "Sixteen zones down a linen runner. This is the party board.",
  zones: (() => {
    const rowA: Role[] = [
      "cheese",
      "meat",
      "cracker",
      "fruit",
      "cheese",
      "meat",
      "cracker",
      "fruit",
    ];
    const rowB: Role[] = [
      "fruit",
      "cracker",
      "briny",
      "nut",
      "spread",
      "cheese",
      "dried",
      "garnish",
    ];
    const zones: Zone[] = [];
    for (let i = 0; i < 8; i++) {
      const x = 105 + (i * (1135 - 105)) / 7;
      zones.push(z(`ge-a${i}`, rowA[i], blob(x, 150, 62, 66, `ge-a${i}`), { size: "minor" }));
      zones.push(z(`ge-b${i}`, rowB[i], blob(x, 310, 62, 66, `ge-b${i}`), { size: "minor" }));
    }
    return zones;
  })(),
};

const runnerIslands: Pattern = {
  id: "cluster-islands",
  name: "Cluster Islands",
  tagline: "Four self-contained islands so four conversations can happen at once.",
  zones: (() => {
    const islands: { x: number; roles: [Role, Role, Role] }[] = [
      { x: 190, roles: ["cheese", "cracker", "fruit"] },
      { x: 500, roles: ["meat", "briny", "cracker"] },
      { x: 810, roles: ["cheese", "fruit", "nut"] },
      { x: 1090, roles: ["spread", "dried", "garnish"] },
    ];
    const zones: Zone[] = [];
    islands.forEach((isl, i) => {
      zones.push(
        z(`gi-${i}-main`, isl.roles[0], blob(isl.x, 205, 88, 78, `gi-${i}-main`), {
          size: i === 0 ? "hero" : "major",
          hint:
            i === 0
              ? "Each island needs one big thing at its centre and two small things below. Same recipe, four times."
              : undefined,
        }),
      );
      zones.push(
        z(`gi-${i}-s1`, isl.roles[1], blob(isl.x - 78, 330, 48, 40, `gi-${i}-s1`), {
          size: "accent",
        }),
      );
      zones.push(
        z(`gi-${i}-s2`, isl.roles[2], blob(isl.x + 72, 335, 46, 38, `gi-${i}-s2`), {
          size: "accent",
        }),
      );
    });
    return zones;
  })(),
};

const runner: Board = {
  id: "runner",
  name: "The Grazing Runner",
  blurb: "No board at all — food straight onto linen, the length of the table.",
  seats: "12–20 guests",
  surface: "linen",
  viewBox: [1240, 460],
  outline: runnerOutline.d,
  patterns: [runnerEndless, runnerIslands],
};

// ─── Registry ────────────────────────────────────────────────────────────────

export const BOARDS: Board[] = [plank, round, paddleBoard, slate, wreath, runner];

export function getBoard(id: string): Board | undefined {
  return BOARDS.find((b) => b.id === id);
}

export function getPattern(board: Board, patternId: string): Pattern {
  return board.patterns.find((p) => p.id === patternId) ?? board.patterns[0];
}
