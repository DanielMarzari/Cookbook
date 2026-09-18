/* What the wall keeps for itself.

   An Instagram embed is a frame around someone else's product: it costs a
   third-party load, it shows their chrome, and it goes blank the day a post is
   deleted or an account turns private. Once the cover frame and the caption
   live here, a card is a dish and a recipe — Instagram becomes the place you go
   to watch, not the thing you look at.

   Videos are only sometimes available. A reel carrying a licensed track is
   served without its media entirely — no <video>, no video_url, not even the
   JSON blob that would carry them — so roughly half of them can only ever be a
   cover frame and a link out. Reels on original audio hand over a real file.

   Filled by scripts/sync-inspiration-media.mjs. Files are served from /media,
   which is public/media locally and a Caddy-served directory in production —
   deliberately outside the deploy's rsync, which would otherwise delete it. */

export type InspirationMedia = {
  /** Natural size of the cover frame, so the wall can hold its shape before it loads. */
  w: number;
  h: number;
  /** True when a playable file was available and has been stored. */
  video?: boolean;
  /** The caption as written, hashtag walls trimmed. */
  caption?: string;
};

/** Keyed by post shortcode. An entry means the cover frame is stored. */
export const INSPIRATION_MEDIA: Record<string, InspirationMedia> = {
  "DZDuP3Yp01U": {"w":1320,"h":2347,"video":true,"caption":"Big Baguette\n\nIngredients\n280g lukewarm water (about 1 1/6 cups)\n350g flour (about 2 3/4 cups)\n1 tsp yeast\n1 tsp salt\n\nInstructions\n\n1. In a bowl, mix water and yeast, then add flour and salt. Mix until combined, then coil fold multiple times.\n2. Cover and place in the fridge overnight.\n3. The next day, let your dough come to room temperature for about 45 minutes.\n4. Flour your work surface well, then place the dough on it. Fold and turn the dough, then shape it like a baguette by sealing it very well and rolling it gently.\n5. Place it on baking paper, dust flour on top, cover, and rest for 15 minutes.\n6. Score the dough and bake at maximum temperature with steam for 8 minutes, then reduce to 380F and bake for about 15 more minutes."},
};

const BASE = '/media/inspiration';

export const posterPath = (code: string) => `${BASE}/${code}.jpg`;
export const videoPath = (code: string) => `${BASE}/${code}.mp4`;

export const mediaFor = (code: string): InspirationMedia | undefined =>
  INSPIRATION_MEDIA[code];
