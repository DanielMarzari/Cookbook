import { rngFor } from "./geometry";
import { ITEMS, getItem } from "./items";
import { pairScore } from "./pairings";
import type { Item } from "./types";

/** The pairing data as an actual graph: ingredients are nodes, and any pair
 *  that scores above the threshold is an edge weighted by how well they go
 *  together. */

export interface GraphNode {
  id: string;
  item: Item;
  x: number;
  y: number;
  /** Hops from the focused node — drives size and opacity. */
  depth: number;
}

export interface GraphEdge {
  a: string;
  b: string;
  /** Raw pair score. */
  w: number;
  why: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const EDGE_MIN = 9;

/** Strongest partners for an item, across the whole catalogue. */
export function topPartners(item: Item, limit: number): { item: Item; w: number; why: string }[] {
  const out: { item: Item; w: number; why: string }[] = [];
  for (const cand of ITEMS) {
    if (cand.id === item.id) continue;
    const r = pairScore(item, cand);
    if (r.score < EDGE_MIN) continue;
    out.push({ item: cand, w: r.score, why: r.why[0] ?? "" });
  }
  out.sort((a, b) => b.w - a.w);
  return out.slice(0, limit);
}

/** Build the neighbourhood around a focus: its best partners, plus theirs.
 *  Simulating all 202 nodes at once produces a hairball nobody can read —
 *  two hops out is the part you're actually exploring. */
export function neighbourhood(
  focusId: string,
  opts: { first?: number; second?: number; cap?: number } = {},
): Graph {
  const { first = 12, second = 4, cap = 46 } = opts;
  const focus = getItem(focusId);
  if (!focus) return { nodes: [], edges: [] };

  const depth = new Map<string, number>([[focus.id, 0]]);
  const order: string[] = [focus.id];

  for (const p of topPartners(focus, first)) {
    if (!depth.has(p.item.id)) {
      depth.set(p.item.id, 1);
      order.push(p.item.id);
    }
  }

  for (const id of [...order]) {
    if (depth.get(id) !== 1 || order.length >= cap) continue;
    const item = getItem(id);
    if (!item) continue;
    for (const p of topPartners(item, second)) {
      if (order.length >= cap) break;
      if (!depth.has(p.item.id)) {
        depth.set(p.item.id, 2);
        order.push(p.item.id);
      }
    }
  }

  const ids = order.slice(0, cap);
  const idSet = new Set(ids);

  const candidates: GraphEdge[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = getItem(ids[i]);
      const b = getItem(ids[j]);
      if (!a || !b) continue;
      const r = pairScore(a, b);
      if (r.score < EDGE_MIN) continue;
      candidates.push({ a: a.id, b: b.id, w: r.score, why: r.why[0] ?? "" });
    }
  }

  // Keep each node's strongest few links. Every-pair-above-threshold produces a
  // hairball that is both unreadable and impossible to lay out — each node
  // ends up pulled toward every other and the whole graph collapses inward.
  const perNode = new Map<string, GraphEdge[]>();
  for (const e of candidates) {
    for (const end of [e.a, e.b]) {
      const list = perNode.get(end);
      if (list) list.push(e);
      else perNode.set(end, [e]);
    }
  }
  const kept = new Set<GraphEdge>();
  for (const [id, list] of perNode) {
    list.sort((x, y) => y.w - x.w);
    const take = id === focus.id ? first : 3;
    for (const e of list.slice(0, take)) kept.add(e);
  }
  const edges = [...kept];

  const nodes: GraphNode[] = ids
    .filter((id) => idSet.has(id))
    .map((id) => ({
      id,
      item: getItem(id)!,
      x: 0,
      y: 0,
      depth: depth.get(id) ?? 2,
    }));

  layout(nodes, edges, focus.id);
  return { nodes, edges };
}

/** Force-directed layout, run to convergence in one go rather than as a live
 *  loop: the caller animates nodes to the result, which is smoother to watch
 *  and completely deterministic. */
function layout(nodes: GraphNode[], edges: GraphEdge[], focusId: string) {
  const W = 1000;
  const H = 640;
  const n = nodes.length;
  if (n === 0) return;

  const rnd = rngFor(`graph-${focusId}`);
  const index = new Map(nodes.map((node, i) => [node.id, i]));

  // Seed on rings by depth so the simulation starts somewhere sensible.
  nodes.forEach((node, i) => {
    if (node.depth === 0) {
      node.x = W / 2;
      node.y = H / 2;
      return;
    }
    const r = node.depth === 1 ? 170 : 285;
    const a = (i / n) * Math.PI * 2 + rnd() * 0.6;
    node.x = W / 2 + Math.cos(a) * r * (0.85 + rnd() * 0.3);
    node.y = H / 2 + Math.sin(a) * r * (0.85 + rnd() * 0.3);
  });

  // Fruchterman-Reingold: repulsion k²/d and attraction d²/k balance at d = k,
  // so k is the natural edge length. Scaling it down (or scaling attraction up)
  // breaks that balance and the graph implodes.
  const k = Math.sqrt((W * H) / Math.max(1, n)) * 1.05;
  let temp = W / 6;

  for (let step = 0; step < 340; step++) {
    const dispX = new Float64Array(n);
    const dispY = new Float64Array(n);

    // Repulsion, every pair.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let d = Math.hypot(dx, dy);
        if (d < 0.01) {
          dx = (rnd() - 0.5) * 2;
          dy = (rnd() - 0.5) * 2;
          d = 1;
        }
        const rep = (k * k) / d;
        dispX[i] += (dx / d) * rep;
        dispY[i] += (dy / d) * rep;
        dispX[j] -= (dx / d) * rep;
        dispY[j] -= (dy / d) * rep;
      }
    }

    // Attraction along edges, scaled by pairing strength.
    for (const e of edges) {
      const i = index.get(e.a);
      const j = index.get(e.b);
      if (i === undefined || j === undefined) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy) || 0.01;
      // Stronger pairings pull a little harder, but stay near 1 so the
      // repulsion/attraction balance above survives.
      const strength = 0.7 + Math.min(1, e.w / 30) * 0.5;
      const att = ((d * d) / k) * strength;
      dispX[i] -= (dx / d) * att;
      dispY[i] -= (dy / d) * att;
      dispX[j] += (dx / d) * att;
      dispY[j] += (dy / d) * att;
    }

    for (let i = 0; i < n; i++) {
      const node = nodes[i];
      if (node.depth === 0) continue; // focus stays pinned in the middle
      const d = Math.hypot(dispX[i], dispY[i]) || 0.01;
      node.x += (dispX[i] / d) * Math.min(d, temp);
      node.y += (dispY[i] / d) * Math.min(d, temp);
      // Very gentle pull to centre — just enough to stop drift off-canvas.
      node.x += (W / 2 - node.x) * 0.004;
      node.y += (H / 2 - node.y) * 0.004;
      node.x = Math.max(46, Math.min(W - 46, node.x));
      node.y = Math.max(38, Math.min(H - 38, node.y));
    }
    temp *= 0.982;
  }
}

export const GRAPH_VIEW: [number, number] = [1000, 640];
