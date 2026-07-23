'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface Farm {
  id: number; name: string; category: string; state?: string; city: string | null; street: string | null;
  zip: string | null; phone: string | null; website: string | null; lat: number; lng: number;
}

export const FARM_COLORS: Record<string, string> = {
  'Farmers Market': '#5A6B33',
  'CSA': '#4E7FA6',
  'On-Farm Market': '#CE6A4A',
  'Agritourism': '#9166A6',
  'Food Hub': '#C6A24A',
};

const esc = (s: string | null) => (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

interface Props {
  farms: Farm[];
  active: Set<string>;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  height?: number;
}

// Vanilla-Leaflet map (loaded client-side only) with one circle marker per
// listing, coloured by category, OpenStreetMap tiles. Kept out of SSR.
export default function FarmsMap({ farms, active, selectedId, onSelect, height = 460 }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markerById = useRef<Map<number, any>>(new Map());

  // init map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(elRef.current, { scrollWheelZoom: false, attributionControl: true }).setView([39.5, -98.35], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      draw();
      // The container is often laid out after Leaflet initialises (dynamic import,
      // below the fold) — recompute size so the full tile grid loads.
      setTimeout(() => map.invalidateSize(), 120);
      setTimeout(() => map.invalidateSize(), 600);
    })();
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redraw markers on data / filter change
  useEffect(() => { draw(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [farms, active]);

  // when the set of farms changes (e.g. a new state), fit the map to them
  useEffect(() => {
    const L = LRef.current, map = mapRef.current;
    if (!L || !map || farms.length === 0) return;
    const b = L.latLngBounds(farms.map((f) => [f.lat, f.lng] as [number, number]));
    if (b.isValid()) map.fitBounds(b, { padding: [24, 24], maxZoom: 9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farms]);

  function draw() {
    const L = LRef.current, layer = layerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();
    markerById.current.clear();
    const shown = farms.filter((f) => active.has(f.category));
    for (const f of shown) {
      const m = L.circleMarker([f.lat, f.lng], {
        radius: 5, weight: 1.5, color: '#fff', fillColor: FARM_COLORS[f.category] || '#767676', fillOpacity: 0.9,
      });
      const site = f.website ? `<a href="${esc(f.website)}" target="_blank" rel="noopener" style="color:#5A6B33">website</a>` : '';
      const addr = [f.street, f.city, f.zip].filter(Boolean).map(esc).join(', ');
      m.bindPopup(
        `<strong>${esc(f.name)}</strong><br><span style="color:#767676">${esc(f.category)}</span>`
        + (addr ? `<br>${addr}` : '') + (f.phone ? `<br>${esc(f.phone)}` : '') + (site ? `<br>${site}` : ''),
        { className: 'farm-popup' }
      );
      if (onSelect) m.on('click', () => onSelect(f.id));
      m.addTo(layer);
      markerById.current.set(f.id, m);
    }
  }

  // focus a selected farm
  useEffect(() => {
    const m = selectedId != null ? markerById.current.get(selectedId) : null;
    if (m && mapRef.current) { mapRef.current.setView(m.getLatLng(), 11); m.openPopup(); }
  }, [selectedId]);

  return <div ref={elRef} style={{ height, width: '100%' }} className="border border-border" />;
}
