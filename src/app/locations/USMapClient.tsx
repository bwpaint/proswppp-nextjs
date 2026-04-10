'use client';

interface StateItem {
  name: string;
  slug: string;
  abbreviation: string;
}

interface Props {
  liveStates: StateItem[];
}

// Each entry: [abbr, name, x, y, w, h, labelX?, labelY?]
// labelX/labelY optional overrides for text centering
const STATE_RECTS: [string, string, number, number, number, number][] = [
  // Row 1 — north
  ['WA', 'Washington',       20,  60,  80, 70],
  ['MT', 'Montana',         100,  60, 120, 70],
  ['ND', 'North Dakota',    220,  60,  80, 70],
  ['MN', 'Minnesota',       300,  60,  80, 70],
  ['WI', 'Wisconsin',       390,  60,  70, 60],
  ['NY', 'New York',        620,  60, 100, 60],
  ['VT', 'Vermont',         720,  60,  40, 50],
  ['NH', 'New Hampshire',   760,  60,  40, 50],
  ['ME', 'Maine',           800,  60,  80, 70],
  // Row 1 sub
  ['MA', 'Massachusetts',   720,  95,  80, 45],
  // Row 2
  ['OR', 'Oregon',           20, 130,  80, 70],
  ['ID', 'Idaho',           100, 130,  70, 80],
  ['SD', 'South Dakota',    220, 130,  80, 70],
  ['NE', 'Nebraska',        300, 130,  80, 60],
  ['IA', 'Iowa',            380, 130,  70, 60],
  ['MI', 'Michigan',        460,  60,  80, 70],
  ['IL', 'Illinois',        450, 130,  60, 70],
  ['IN', 'Indiana',         510, 130,  50, 70],
  ['OH', 'Ohio',            560, 130,  60, 70],
  ['PA', 'Pennsylvania',    620, 130, 100, 60],
  ['NJ', 'New Jersey',      720, 130,  40, 50],
  ['CT', 'Connecticut',     760, 130,  35, 40],
  ['RI', 'Rhode Island',    795, 130,  25, 35],
  // Row 3
  ['CA', 'California',       20, 200,  70,150],
  ['NV', 'Nevada',           90, 200,  70,100],
  ['UT', 'Utah',            160, 200,  70, 90],
  ['CO', 'Colorado',        230, 200,  90, 70],
  ['KS', 'Kansas',          320, 200,  90, 60],
  ['MO', 'Missouri',        410, 200,  70, 70],
  ['KY', 'Kentucky',        480, 200,  80, 60],
  ['WV', 'West Virginia',   560, 200,  55, 60],
  ['VA', 'Virginia',        615, 200,  90, 55],
  ['MD', 'Maryland',        705, 200,  60, 35],
  ['DE', 'Delaware',        765, 200,  30, 45],
  // Row 3 sub
  ['WY', 'Wyoming',         100, 200,  80, 70], // actually between ID/CO — fix coords
  // Row 4
  ['AZ', 'Arizona',          90, 270,  80, 90],
  ['NM', 'New Mexico',      170, 270,  80, 90],
  ['OK', 'Oklahoma',        260, 270, 100, 60],
  ['AR', 'Arkansas',        360, 270,  75, 60],
  ['TN', 'Tennessee',       435, 270, 100, 55],
  ['NC', 'North Carolina',  535, 270, 100, 55],
  ['SC', 'South Carolina',  635, 270,  65, 55],
  // Row 5
  ['TX', 'Texas',           180, 330, 140,130],
  ['LA', 'Louisiana',       340, 360,  70, 70],
  ['MS', 'Mississippi',     410, 330,  60, 80],
  ['AL', 'Alabama',         470, 330,  60, 90],
  ['GA', 'Georgia',         530, 330,  75, 95],
  ['FL', 'Florida',         540, 430,  80,110],
  // DC small marker
  ['DC', 'District of Columbia', 700, 255, 20, 20],
  // Alaska & Hawaii
  ['AK', 'Alaska',           20, 470, 120, 80],
  ['HI', 'Hawaii',          160, 500, 100, 50],
];

// WY overlaps with NV/UT area — fix: WY is between MT/SD (x=170) and NE (x=230 area)
// Let's use corrected positions for WY
const WY_FIXED: [string, string, number, number, number, number] = ['WY', 'Wyoming', 160, 130, 70, 70];

const STATES_FINAL = STATE_RECTS.filter(([abbr]) => abbr !== 'WY').concat([WY_FIXED]);

export default function USMapClient({ liveStates }: Props) {
  const liveSet = new Set(liveStates.map((s) => s.abbreviation));
  const slugMap = new Map(liveStates.map((s) => [s.abbreviation, s.slug]));

  const ACTIVE_FILL   = '#EF7C3B';
  const INACTIVE_FILL = '#1a1a1a';
  const ACTIVE_STROKE = '#2a2a2a';
  const HOVER_FILL    = '#d4692a';

  function handleMouseEnter(e: React.MouseEvent<SVGElement>) {
    const rect = e.currentTarget.querySelector('rect');
    if (rect) rect.setAttribute('fill', HOVER_FILL);
  }
  function handleMouseLeave(e: React.MouseEvent<SVGElement>, abbr: string) {
    const rect = e.currentTarget.querySelector('rect');
    if (rect) rect.setAttribute('fill', liveSet.has(abbr) ? ACTIVE_FILL : INACTIVE_FILL);
  }

  return (
    <div className="container">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <svg
          viewBox="0 0 960 600"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block' }}
          aria-label="Interactive map of US states with SWPPP service availability"
        >
          {STATES_FINAL.map(([abbr, name, x, y, w, h]) => {
            const isActive = liveSet.has(abbr);
            const slug = slugMap.get(abbr);
            const fill = isActive ? ACTIVE_FILL : INACTIVE_FILL;
            const cx = x + w / 2;
            const cy = y + h / 2;
            const fontSize = w < 30 ? 6 : w < 50 ? 7 : 9;

            const inner = (
              <g
                key={abbr}
                style={{ cursor: isActive ? 'pointer' : 'default' }}
                onMouseEnter={isActive ? handleMouseEnter : undefined}
                onMouseLeave={isActive ? (e) => handleMouseLeave(e, abbr) : undefined}
                role={isActive ? 'link' : undefined}
                aria-label={isActive ? `${name} — active, click to explore` : `${name} — coming soon`}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  fill={fill}
                  stroke={ACTIVE_STROKE}
                  strokeWidth={0.5}
                  rx={2}
                  style={{ transition: 'fill 0.15s' }}
                />
                <text
                  x={cx}
                  y={cy + fontSize * 0.35}
                  textAnchor="middle"
                  fill={isActive ? '#ffffff' : '#555555'}
                  fontSize={fontSize}
                  fontFamily="'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif"
                  fontWeight={700}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {abbr}
                </text>
              </g>
            );

            if (isActive && slug) {
              return (
                <a key={abbr} href={`/locations/${slug}`}>
                  {inner}
                </a>
              );
            }
            return inner;
          })}

          {/* Separator line between main map and AK/HI */}
          <line x1="20" y1="460" x2="300" y2="460" stroke="#222" strokeWidth={1} strokeDasharray="4,4" />

          {/* Legend labels */}
          <text x="20" y="585" fill="rgba(255,255,255,0.4)" fontSize={9}
            fontFamily="'Roboto', Arial, sans-serif">
            AK and HI shown repositioned
          </text>
        </svg>

        {/* Legend */}
        <div
          className="flex items-center gap-6 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div
              style={{ width: 16, height: 16, background: '#EF7C3B', borderRadius: 3 }}
            />
            <span
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Active — Click to explore
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 16,
                height: 16,
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: 3,
              }}
            />
            <span
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
