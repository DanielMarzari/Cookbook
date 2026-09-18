/* Posts saved to the "Food" collection on Instagram (@d.james.marzari).
   Instagram has no public API for a private saved collection, so this list is
   harvested from the logged-in page and committed here as static data.

   To re-sync: open the collection while signed in
   https://www.instagram.com/d.james.marzari/saved/food/18096260249294250/
   scroll to the bottom (the grid lazy-loads), then run in the console:

     const seen = new Map();
     for (const a of document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')) {
       const m = a.getAttribute('href').match(/^\/([^/]+)\/(p|reel)\/([\w-]+)/);
       if (m) seen.set(m[3], `  { code: '${m[3]}', kind: '${m[2]}', user: '${m[1]}' },`);
     }
     copy([...seen.values()].join('\n'));

   Collect as you scroll — Instagram unmounts rows that leave the viewport, so a
   single pass at the bottom only sees the last screenful. Last synced 2026-09-17. */

export type InspirationPost = {
  /** Instagram shortcode — the id in instagram.com/p/<code>/ */
  code: string;
  /** 'reel' is video, 'p' is a photo or carousel */
  kind: 'reel' | 'p';
  /** handle of the account that posted it */
  user: string;
};

/** Newest save first, the order the collection itself uses. */
export const INSPIRATION_POSTS: InspirationPost[] = [
  { code: 'C7JL7aqskDr', kind: 'reel', user: 'nicolaitram' },
  { code: 'Dc37SMZBu49', kind: 'reel', user: 'theculinaryrepost' },
  { code: 'DcSBHD7MIW2', kind: 'reel', user: 'scmfitfoodie' },
  { code: 'DZ2MWVHiYGP', kind: 'reel', user: 'nids.lid' },
  { code: 'Dc14av3hlPW', kind: 'reel', user: 'slurpseattle' },
  { code: 'Dcy8EoQIBhh', kind: 'reel', user: 'joexfitness' },
  { code: 'DcosKaNhsHA', kind: 'reel', user: 'thesaltycooker' },
  { code: 'DcBi8rDIZkt', kind: 'reel', user: 'easygayoven' },
  { code: 'DcekAUGSEca', kind: 'reel', user: 'tythelefty' },
  { code: 'DcCA__apdh3', kind: 'reel', user: 'malai_icecream' },
  { code: 'DcRaR_NG4WM', kind: 'p', user: 'jessies.recipes' },
  { code: 'Dcbxg9qCbou', kind: 'p', user: 'malai_icecream' },
  { code: 'DbVE8URpGXv', kind: 'reel', user: 'mynutritioncreative' },
  { code: 'DcKLjmpPKUc', kind: 'reel', user: 'thejamlab' },
  { code: 'DcNdIlUw3f7', kind: 'reel', user: 'triggtube' },
  { code: 'DbbP_-wxfQv', kind: 'reel', user: 'dariompls' },
  { code: 'DaFbhq1zXND', kind: 'reel', user: 'zinikim' },
  { code: 'DcEzMeIv0Ay', kind: 'reel', user: 'ashinthekitchn' },
  { code: 'Db_e7XjhAZ1', kind: 'reel', user: 'patty.plates' },
  { code: 'Db9OYkIRBpE', kind: 'reel', user: 'smarthomecanning' },
  { code: 'DaBFyotvMmI', kind: 'reel', user: 'lennoxglasgow_' },
  { code: 'DbvypA4uVq1', kind: 'reel', user: 'pastasocialclub' },
  { code: 'DaFycOhAKcR', kind: 'reel', user: 'soren_scheel' },
  { code: 'Db8Pri1xF0l', kind: 'reel', user: 'kendrakendrakendra' },
  { code: 'DbvS03aBnF7', kind: 'reel', user: 'john_ikejiri' },
  { code: 'DbWEvO4KbVZ', kind: 'reel', user: 'bichefy' },
  { code: 'DMia0kkMrCh', kind: 'reel', user: 'theboywhobakes' },
  { code: 'DAPEJgQJuWp', kind: 'reel', user: 'kaylaskitchandfix' },
  { code: 'DaXzuoXtWbo', kind: 'reel', user: 'chez_martina_events' },
  { code: 'DbLuCRsoqh2', kind: 'reel', user: 'chefpaulregie' },
  { code: 'DbgKMsygvMz', kind: 'reel', user: 'teds_zaza' },
  { code: 'DY2DlN0ujmv', kind: 'reel', user: 'nico.borbolla' },
  { code: 'Dba2R4HR8dg', kind: 'reel', user: 'frohneats' },
  { code: 'DbWrouxTv9m', kind: 'reel', user: 'rachelmrudy' },
  { code: 'DbVw5bPOSje', kind: 'reel', user: 'rainha_da_cozinha' },
  { code: 'DbT_zy2vmZO', kind: 'reel', user: 'munchingwithmariyah' },
  { code: 'DYzvcd3OFjt', kind: 'reel', user: 'eboake' },
  { code: 'DZLnDvPuBB3', kind: 'reel', user: 'kaylaskitchandfix' },
  { code: 'DbLhbsCAz7q', kind: 'reel', user: 'julescooking' },
  { code: 'DZa70m1yJjr', kind: 'reel', user: 'sidequestkenny' },
  { code: 'DZG1PDdxSKY', kind: 'reel', user: 'isabeleats' },
  { code: 'DX-CFy1P5yC', kind: 'reel', user: 'nico.borbolla' },
  { code: 'Davkhqot8B4', kind: 'reel', user: 'masienda' },
  { code: 'DbHRedtvOdY', kind: 'reel', user: 'chubs.eat.drink' },
  { code: 'DaF9xa6C7aI', kind: 'reel', user: 'carbs.calendar' },
  { code: 'DZ1G6LWhJP6', kind: 'reel', user: 'connor.sseurr' },
  { code: 'DaSbx5iNK38', kind: 'reel', user: 'anna.sebelova' },
  { code: 'DaQVCe3o7NN', kind: 'reel', user: 'rada_nestrelyaeva' },
  { code: 'DZ8U88_hcSo', kind: 'reel', user: 'cherylshealthylife' },
  { code: 'DX4tj_vio2Y', kind: 'reel', user: 'graciaseattle' },
  { code: 'Da6C7Z_i4-p', kind: 'reel', user: 'chefinkosesi' },
  { code: 'Da6dddfiCp5', kind: 'p', user: 'flavonomics' },
  { code: 'DZ1t24kNG6P', kind: 'reel', user: 'mirabellepierrewhite' },
  { code: 'Da4cX71JEeN', kind: 'reel', user: 'hwoo.lee' },
  { code: 'Da5xb2uxg5W', kind: 'reel', user: 'purely__planted' },
  { code: 'DY11caBMPTQ', kind: 'reel', user: 'thehungrypov' },
  { code: 'DYIB0B7Cysi', kind: 'reel', user: 'jessiejanedaye' },
  { code: 'DZIXsXoy-s-', kind: 'reel', user: 'honeyedsundays' },
  { code: 'DYuz-xnpeE2', kind: 'reel', user: 'ryanmichaelcarter' },
  { code: 'DaO6vwgNBoA', kind: 'reel', user: 'laneandgreyfare' },
  { code: 'DaN_6n_uEox', kind: 'reel', user: 'bluebowlrecipes' },
  { code: 'DZ07kQWPCuD', kind: 'reel', user: 'fork_and_salt' },
  { code: 'DZn_BpEPfkB', kind: 'reel', user: 'parzyo' },
  { code: 'DZ5-PooBQNF', kind: 'reel', user: 'rootedwithsyd' },
  { code: 'DXkd3OKiVxq', kind: 'reel', user: 'emmmmyeats' },
  { code: 'DZaitLkh_PH', kind: 'reel', user: 'hevvyhitters' },
  { code: 'DaEmK_3MHN-', kind: 'reel', user: 'halfbakedharvest' },
  { code: 'DZ4n7Ecxctj', kind: 'reel', user: 'rachxomin' },
  { code: 'DY5KpldvbNl', kind: 'reel', user: 'flavorsbyyulia' },
  { code: 'DafzaPuouqc', kind: 'reel', user: 'adip_food' },
  { code: 'DXCiBJ_DTME', kind: 'reel', user: 'nomacph' },
  { code: 'DZcylY7oryo', kind: 'reel', user: 'nomaprojects' },
  { code: 'DaBWgvjqaUS', kind: 'reel', user: 'nomacph' },
  { code: 'DaIrJcMMw6E', kind: 'reel', user: 'finleyrichards' },
  { code: 'DZpvtlFBVre', kind: 'reel', user: 'breadbycj' },
  { code: 'DX8LittuV-4', kind: 'reel', user: 'breadstalker_' },
  { code: 'DZnaHeWICti', kind: 'reel', user: 'the_geordie_chef' },
  { code: 'DZo45muIyzn', kind: 'reel', user: 'trizza_pizza_' },
  { code: 'DY4NJl6C0AK', kind: 'reel', user: 'una_famiglia_in_cucina' },
  { code: 'DZC-MYmC8c1', kind: 'reel', user: 'chefinkosesi' },
  { code: 'DZNmabos0_l', kind: 'reel', user: 'clairesharrynroberto' },
  { code: 'DZK2KFJBOn5', kind: 'reel', user: 'breadbycj' },
  { code: 'DYxap0ntm9A', kind: 'reel', user: 'massicooksitalian' },
  { code: 'DY2ZF-3tk1v', kind: 'reel', user: 'finntonry' },
  { code: 'DZDAs8CCTt8', kind: 'reel', user: 'chefinkosesi' },
  { code: 'DZGVIwaJKEU', kind: 'reel', user: 'halikit25' },
  { code: 'DY5e5s9J6kc', kind: 'reel', user: 'halikit25' },
  { code: 'DYe485Cgifu', kind: 'reel', user: 'gatherednutrition' },
  { code: 'DYziJtkCorH', kind: 'reel', user: 'cucinadilinda' },
  { code: 'DABQFR1sMdI', kind: 'p', user: 'the_nutritionist_edition' },
  { code: 'DYjnG2lIke_', kind: 'reel', user: 'eloisemaroske' },
  { code: 'DXdm4yUkSEm', kind: 'reel', user: 'wholetable' },
  { code: 'DY0ScJby_dc', kind: 'reel', user: 'millabred' },
  { code: 'DXZMemdgvgW', kind: 'reel', user: 'cucinadilinda' },
  { code: 'DX6cMjqsp-l', kind: 'reel', user: 'kiki_ajmo' },
  { code: 'DZDuP3Yp01U', kind: 'reel', user: 'halikit25' },
  { code: 'DYzrA-SBst8', kind: 'reel', user: 'breadbycj' },
  { code: 'DWhmB8gCQ6H', kind: 'reel', user: 'halikit25' },
  { code: 'DY-nhOkp5tu', kind: 'reel', user: 'halikit25' },
  { code: 'DY5gayivdAH', kind: 'reel', user: 'northjerseyeats' },
  { code: 'DZFsXg1Kutf', kind: 'reel', user: 'myclassic.cookbook' },
  { code: 'DVPc6HOEfnH', kind: 'reel', user: 'you_had_me_at_halal' },
  { code: 'DYkGpT4A2v9', kind: 'p', user: '__extendo__' },
  { code: 'DVntP-wsPoi', kind: 'reel', user: 'dinnerbyben' },
  { code: 'DYaG3EBMtjg', kind: 'reel', user: 'stevenmotocooks' },
  { code: 'DYiHV8jA5Hl', kind: 'reel', user: 'julescooking' },
  { code: 'DYPy70AMx91', kind: 'reel', user: 'mattadlard' },
  { code: 'DXMqudKAN_4', kind: 'reel', user: 'thebergerfeed' },
  { code: 'DXPK3qxJS3f', kind: 'reel', user: 'forkthepeople' },
  { code: 'DXmcmOLjbII', kind: 'reel', user: 'atelierjiboia' },
  { code: 'DYTrJYPOFvj', kind: 'reel', user: 'alexawhatsfordinner' },
  { code: 'DXSPrt4CA6j', kind: 'reel', user: 'mo.flvs' },
  { code: 'DWW20pnATg4', kind: 'reel', user: 'shoutoutluka' },
  { code: 'DWTssEqD97S', kind: 'reel', user: 'jujumaoeats' },
  { code: 'DWQiZbjicT_', kind: 'p', user: 'luluandme_cheesecakes' },
  { code: 'DWgN9BCADM8', kind: 'p', user: 'sanjayalamatamang' },
  { code: 'DV4nGbZjCBI', kind: 'p', user: 'sanjayalamatamang' },
  { code: 'DWBUXOBAjZ1', kind: 'reel', user: 'secret.london' },
  { code: 'DWJzvoSCqMA', kind: 'p', user: 'thefuck.tv' },
  { code: 'DV1GkR6DLFe', kind: 'p', user: 'fogaovermelho' },
  { code: 'DWFXoiTDZE_', kind: 'reel', user: 'teds_zaza' },
  { code: 'DV3vZ70gYNI', kind: 'reel', user: 'chefitalianochannel' },
  { code: 'DWA2hJOkXdg', kind: 'reel', user: 'myclassic.cookbook' },
  { code: 'DVchIIRDvxR', kind: 'reel', user: 'matthewsullychef' },
  { code: 'DVuCZTljuQR', kind: 'reel', user: 'matthewsullychef' },
  { code: 'DOq_eLJDcgx', kind: 'reel', user: 'husenfayad' },
  { code: 'DVk0M97CXBu', kind: 'reel', user: 'zeidaner' },
  { code: 'DTbYYiKEsc7', kind: 'reel', user: 'cmbarndominium' },
  { code: 'DTDCiz-ksjU', kind: 'reel', user: 'jujumaoeats' },
  { code: 'DVtNPSijgHh', kind: 'reel', user: 'gianlucaruggierichef' },
  { code: 'DVc7sL3Am4q', kind: 'reel', user: 'zachs.foods' },
  { code: 'DV1F2FWDWng', kind: 'reel', user: 'teds_zaza' },
  { code: 'DG5lVejA4qC', kind: 'reel', user: 'gianlucaruggierichef' },
  { code: 'DHlKDpHAWWI', kind: 'reel', user: 'gianlucaruggierichef' },
  { code: 'DVjNGs0DJIO', kind: 'reel', user: 'arte_mon_amour' },
  { code: 'DUVgIp5kygZ', kind: 'reel', user: 'myclassic.cookbook' },
  { code: 'DU15L1VkRb7', kind: 'reel', user: 'myclassic.cookbook' },
  { code: 'DU3lCX5iK3d', kind: 'reel', user: 'joandbart' },
  { code: 'DViKlhwEVYq', kind: 'reel', user: 'myclassic.cookbook' },
  { code: 'DPRSjJhEZEf', kind: 'reel', user: 'fationatefoodbelly' },
  { code: 'DVZrlIkjXRV', kind: 'reel', user: 'serious_sanji' },
  { code: 'DSsJ3zGCHGX', kind: 'reel', user: 'aripastaclub' },
];

/** The collection this page mirrors. */
export const SAVED_COLLECTION_URL =
  'https://www.instagram.com/d.james.marzari/saved/food/18096260249294250/';

/** Canonical post URL — always the /p/ form, which Instagram redirects. */
export const permalinkFor = (post: InspirationPost) =>
  `https://www.instagram.com/${post.kind}/${post.code}/`;

/** The public embed document. Renders without Meta's embed.js. */
export const embedSrcFor = (post: InspirationPost) =>
  `https://www.instagram.com/${post.kind}/${post.code}/embed/captioned/`;

/** Accounts ordered by how many of their posts are saved, then alphabetically. */
export function accountsByWeight(posts: InspirationPost[]) {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.user, (counts.get(p.user) ?? 0) + 1);
  return [...counts.entries()]
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count || a.user.localeCompare(b.user));
}
