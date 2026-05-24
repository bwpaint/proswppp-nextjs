'use client';

import { useState, useEffect } from 'react';

interface StateItem { name: string; slug: string; abbreviation: string; }
interface Props { liveStates: StateItem[]; }

// Full state name → 2-letter abbreviation
const NAME_TO_ABBR: Record<string, string> = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
};

// ── Minimal inline TopoJSON decoder (replaces topojson-client) ──────────────
// The states-albers-10m.json is pre-projected so coords are already screen pixels.
// TopoJSON arcs use delta encoding: each [dx,dy] is relative to the previous point.
type RawArc  = [number, number][];
type ScreenPt = [number, number];

function decodeArcs(topology: any): ScreenPt[][] {
  const { scale = [1,1], translate = [0,0] } = topology.transform ?? {};
  return (topology.arcs as RawArc[]).map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as ScreenPt;
    });
  });
}

function ringToD(decoded: ScreenPt[][], indices: number[]): string {
  const pts: ScreenPt[] = [];
  for (const idx of indices) {
    const arc = idx >= 0 ? decoded[idx] : [...decoded[~idx]].reverse();
    if (pts.length === 0) {
      pts.push(...arc);
    } else {
      pts.push(...arc.slice(1)); // skip shared endpoint with previous arc
    }
  }
  if (!pts.length) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += `L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
  return d + 'Z';
}

function geoToD(geo: any, decoded: ScreenPt[][]): string {
  if (geo.type === 'Polygon')
    return (geo.arcs as number[][]).map(r => ringToD(decoded, r)).join(' ');
  if (geo.type === 'MultiPolygon')
    return (geo.arcs as number[][][]).map(poly => poly.map(r => ringToD(decoded, r)).join(' ')).join(' ');
  return '';
}
// ─────────────────────────────────────────────────────────────────────────────

interface StatePath { abbr: string; name: string; d: string; }

export default function USMapClient({ liveStates }: Props) {
  const [statePaths, setStatePaths] = useState<StatePath[]>([]);
  const [tooltip, setTooltip]       = useState<{ name: string; cx: number; cy: number } | null>(null);
  const [hovered, setHovered]       = useState<string | null>(null);

  const liveSet = new Set(liveStates.map(s => s.abbreviation));
  const slugMap = new Map(liveStates.map(s => [s.abbreviation, s.slug]));

  useEffect(() => {
    fetch('/us-states.json')
      .then(r => r.json())
      .then((topology: any) => {
        const decoded = decodeArcs(topology);
        const features: StatePath[] = topology.objects.states.geometries
          .map((geo: any) => {
            const name = geo.properties?.name ?? '';
            const abbr = NAME_TO_ABBR[name] ?? '';
            const d    = geoToD(geo, decoded);
            return { abbr, name, d };
          })
          .filter((s: StatePath) => s.abbr && s.d);
        setStatePaths(features);
      })
      .catch(() => {/* silently fail — map just won't render */});
  }, []);

  return (
    <div className="container pb-10">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Loading state */}
        {statePaths.length === 0 && (
          <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Roboto',sans-serif", fontSize: '0.9rem' }}>
              Loading map…
            </p>
          </div>
        )}

        {/* SVG Map — viewBox matches the Albers pre-projected 975×610 space */}
        {statePaths.length > 0 && (
          <svg
            viewBox="0 0 975 610"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="Interactive map of US states with SWPPP service availability"
            onMouseLeave={() => { setTooltip(null); setHovered(null); }}
          >
            {statePaths.map(({ abbr, name, d }) => {
              const isActive = liveSet.has(abbr);
              const slug     = slugMap.get(abbr);
              const isHov    = hovered === abbr;
              const fill     = isActive ? (isHov ? '#d4692a' : '#DE863F') : '#7B9CD1';

              const pathEl = (
                <path
                  key={abbr}
                  d={d}
                  fill={fill}
                  stroke={isActive ? '#000' : '#555555'}
                  strokeWidth={isActive ? 0.8 : 0.5}
                  style={{ cursor: isActive ? 'pointer' : 'default', transition: 'fill 0.15s ease' }}
                  onMouseEnter={e => {
                    if (isActive) setHovered(abbr);
                    const box = (e.currentTarget as SVGPathElement).getBBox();
                    setTooltip({ name, cx: box.x + box.width / 2, cy: box.y });
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                  aria-label={isActive ? `${name} — click to explore SWPPP services` : `${name} — coming soon`}
                />
              );

              return isActive && slug
                ? <a key={abbr} href={`/locations/${slug}`}>{pathEl}</a>
                : <g key={abbr}>{pathEl}</g>;
            })}

            {/* Hover tooltip */}
            {tooltip && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tooltip.cx - 56} y={tooltip.cy - 32}
                  width={112} height={24}
                  rx={4}
                  fill="rgba(0,0,0,0.88)"
                  stroke="rgba(222,134,63,0.6)"
                  strokeWidth={0.75}
                />
                <text
                  x={tooltip.cx} y={tooltip.cy - 16}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={9.5}
                  fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
                  fontWeight={700}
                >
                  {tooltip.name}
                </text>
              </g>
            )}
          </svg>
        )}

        {/* Legend */}
        <div
          className="flex flex-wrap items-center gap-6 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: 3, background: '#DE863F' }} />
            <span style={{ fontFamily:"'Roboto',Arial,sans-serif", fontSize:'0.8rem', color:'rgba(255,255,255,0.7)' }}>
              Active — click to explore
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: 3, background: '#7B9CD1', border: '1px solid #5a7ab0' }} />
            <span style={{ fontFamily:"'Roboto',Arial,sans-serif", fontSize:'0.8rem', color:'rgba(255,255,255,0.7)' }}>
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
