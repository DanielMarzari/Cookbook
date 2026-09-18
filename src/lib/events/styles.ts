/**
 * Twelve menu identities and six papers, as data.
 *
 * The card is ONE component (components/events/MenuCard.tsx); a style is a set
 * of custom properties it reads. Nothing here is per-style markup, so a
 * thirteenth identity is one entry in this array and the two axes stay
 * independent — any style prints on any stock without anyone writing the pair.
 *
 * Faces are system stacks on purpose. A webfont would be a network dependency
 * on the one page whose job is to come out of a printer.
 */

export interface MenuStyle {
  id: string;
  name: string;
  /** What kind of night it suits, shown next to the swatch. */
  note: string;
  vars: Record<string, string>;
}

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export const MENU_STYLES: MenuStyle[] = [
  {
    id: 's-engraved', name: 'Engraved', note: 'formal, hairline',
    vars: {
      '--face-d': 'Didot, "Bodoni MT", Georgia, serif',
      '--face-b': 'Didot, "Bodoni MT", Georgia, serif',
      '--hd-size': '13px', '--hd-track': '0.34em', '--hd-case': 'uppercase',
      '--dish': '16px', '--cn-track': '0.26em',
    },
  },
  {
    id: 's-copper', name: 'Copperplate', note: 'stamped, official',
    vars: {
      '--face-d': 'Copperplate, "Copperplate Gothic Light", Georgia, serif',
      '--face-b': 'Baskerville, Georgia, serif',
      '--hd-size': '15px', '--hd-track': '0.2em', '--hd-case': 'uppercase',
      '--dish': '15px', '--cn-track': '0.24em',
    },
  },
  {
    id: 's-oldstyle', name: 'Old style', note: 'bookish, warm',
    vars: {
      '--face-d': '"Iowan Old Style", "Hoefler Text", Georgia, serif',
      '--face-b': '"Iowan Old Style", "Hoefler Text", Georgia, serif',
      '--hd-size': '25px', '--dish': '16px', '--cn-track': '0.17em', '--gap': '21px',
    },
  },
  {
    id: 's-trattoria', name: 'Trattoria', note: 'italian, familiar',
    vars: {
      '--face-d': 'Palatino, "Palatino Linotype", Georgia, serif',
      '--face-b': 'Palatino, "Palatino Linotype", Georgia, serif',
      '--hd-size': '23px', '--hd-style': 'italic', '--dish': '15.5px',
    },
  },
  {
    id: 's-bistro', name: 'Bistro', note: 'french, humanist',
    vars: {
      '--face-d': 'Optima, "Gill Sans", "Gill Sans MT", sans-serif',
      '--face-b': 'Optima, "Gill Sans", "Gill Sans MT", sans-serif',
      '--hd-size': '24px', '--dish': '15px', '--sub-style': 'normal', '--cn-track': '0.22em',
    },
  },
  {
    id: 's-typed', name: 'Typewriter', note: 'casual, zine',
    vars: {
      '--face-d': '"Courier New", Courier, monospace',
      '--face-b': '"Courier New", Courier, monospace',
      '--align': 'left', '--hd-size': '13px', '--hd-track': '0.12em', '--hd-case': 'uppercase',
      '--dish': '12.5px', '--sub': '11px', '--sub-style': 'normal',
      '--cn-track': '0.04em', '--cn-case': 'lowercase', '--or-style': 'normal', '--gap': '16px',
    },
  },
  {
    id: 's-modern', name: 'Modern', note: 'the house voice',
    vars: {
      '--face-d': SANS, '--face-b': SANS, '--align': 'left',
      '--hd-size': '13px', '--hd-track': '0.16em', '--hd-case': 'uppercase',
      '--dish': '14.5px', '--sub-style': 'normal', '--cn-track': '0.14em',
      '--or-case': 'uppercase', '--or-style': 'normal', '--or-track': '0.14em',
    },
  },
  {
    id: 's-geometric', name: 'Geometric', note: 'bauhaus, wide',
    vars: {
      '--face-d': 'Futura, "Avenir Next", Avenir, sans-serif',
      '--face-b': 'Futura, "Avenir Next", Avenir, sans-serif',
      '--hd-size': '17px', '--hd-track': '0.3em', '--hd-case': 'uppercase',
      '--dish': '14px', '--sub-style': 'normal', '--cn-track': '0.26em', '--gap': '22px',
    },
  },
  {
    id: 's-script', name: 'Script', note: 'celebration',
    vars: {
      '--face-d': '"Snell Roundhand", "Apple Chancery", cursive',
      '--face-b': 'Baskerville, Georgia, serif',
      '--hd-size': '33px', '--dish': '15.5px', '--cn-track': '0.2em', '--gap': '20px',
    },
  },
  {
    id: 's-slab', name: 'Slab', note: 'american, sturdy',
    vars: {
      '--face-d': '"American Typewriter", Rockwell, Georgia, serif',
      '--face-b': '"American Typewriter", Rockwell, Georgia, serif',
      '--hd-size': '20px', '--hd-track': '0.06em', '--hd-case': 'uppercase',
      '--dish': '14px', '--sub-style': 'normal',
    },
  },
  {
    id: 's-quiet', name: 'Quiet', note: 'sparse, all air',
    vars: {
      '--face-d': SANS, '--face-b': SANS,
      '--hd-size': '10.5px', '--hd-track': '0.42em', '--hd-case': 'uppercase',
      '--dish': '12.5px', '--sub': '10.5px', '--sub-style': 'normal',
      '--cn-size': '8.5px', '--cn-track': '0.3em', '--gap': '27px', '--pad': '50px 34px',
    },
  },
  {
    id: 's-hand', name: 'Hand', note: 'supper club',
    vars: {
      '--face-d': '"Bradley Hand", "Marker Felt", cursive',
      '--face-b': '"Bradley Hand", "Marker Felt", cursive',
      '--hd-size': '27px', '--dish': '15.5px', '--sub-style': 'normal',
      '--cn-track': '0.1em', '--or-style': 'normal',
    },
  },
];

export interface MenuStock {
  id: string;
  name: string;
  /** Paper, so it carries its own ink — see MenuCard for why that matters. */
  paper: string;
  ink: string;
  faint: string;
  edge: string;
}

export const MENU_STOCKS: MenuStock[] = [
  { id: 'plain',  name: 'Plain',  paper: '#ffffff', ink: '#111111', faint: '#767676', edge: '#d8d8d8' },
  { id: 'cream',  name: 'Cream',  paper: '#fbf7ef', ink: '#1a1712', faint: '#7b7466', edge: '#e6ddcb' },
  { id: 'grey',   name: 'Grey',   paper: '#f1f0ed', ink: '#1a1a18', faint: '#75736c', edge: '#dedcd6' },
  { id: 'laid',   name: 'Laid',   paper: '#fdfbf6', ink: '#191712', faint: '#7b7466', edge: '#e7e0d2' },
  { id: 'framed', name: 'Framed', paper: '#fffdf9', ink: '#15130f', faint: '#7a7365', edge: '#cfc6b4' },
  { id: 'ivory',  name: 'Ivory',  paper: '#fffcf2', ink: '#181509', faint: '#7d7561', edge: '#e8dfc4' },
];

export const DEFAULT_STYLE = 's-oldstyle';
export const DEFAULT_STOCK = 'plain';

export function styleById(id: string): MenuStyle {
  return MENU_STYLES.find((s) => s.id === id) ?? MENU_STYLES.find((s) => s.id === DEFAULT_STYLE)!;
}
export function stockById(id: string): MenuStock {
  return MENU_STOCKS.find((s) => s.id === id) ?? MENU_STOCKS[0];
}
