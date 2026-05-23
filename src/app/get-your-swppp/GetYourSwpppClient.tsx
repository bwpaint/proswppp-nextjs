'use client';

/**
 * GetYourSwpppClient.tsx — Map-first SWPPP order flow
 *
 * Flow:
 *   1. Hero → "Start My Order" button
 *   2. Animated US map appears — orange = active state, blue = inactive
 *   3a. Click orange state → map swoops out → 4-step wizard slides in
 *   3b. Click blue state → modal with lead-capture form (routes to staff)
 *   4. Wizard: Contact Info → Project Details → Add-ons → Review & Payment
 *
 * API:  https://cms.proswppp.com/wp-json/proswppp-order/v1
 * Env:  NEXT_PUBLIC_SOP_API_BASE, NEXT_PUBLIC_SOP_API_KEY
 */

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
  ChevronRight, ChevronLeft, CheckCircle2, Building2, FileText,
  Shield, CreditCard, MapPin, Clock, Lock, X, Phone,
} from 'lucide-react';

// ─── Config ────────────────────────────────────────────────────────────────────
const SOP_BASE =
  process.env.NEXT_PUBLIC_SOP_API_BASE ??
  'https://cms.proswppp.com/wp-json/proswppp-order/v1';
const SOP_KEY = process.env.NEXT_PUBLIC_SOP_API_KEY ?? '';
const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/proswppp/hero-construction-dark.webp';

// ─── State slug ↔ code mapping ────────────────────────────────────────────────
const STATE_INFO: { code: string; name: string; slug: string }[] = [
  { code: 'AL', name: 'Alabama',        slug: 'alabama'        },
  { code: 'AK', name: 'Alaska',         slug: 'alaska'         },
  { code: 'AZ', name: 'Arizona',        slug: 'arizona'        },
  { code: 'AR', name: 'Arkansas',       slug: 'arkansas'       },
  { code: 'CA', name: 'California',     slug: 'california'     },
  { code: 'CO', name: 'Colorado',       slug: 'colorado'       },
  { code: 'CT', name: 'Connecticut',    slug: 'connecticut'    },
  { code: 'DE', name: 'Delaware',       slug: 'delaware'       },
  { code: 'FL', name: 'Florida',        slug: 'florida'        },
  { code: 'GA', name: 'Georgia',        slug: 'georgia'        },
  { code: 'HI', name: 'Hawaii',         slug: 'hawaii'         },
  { code: 'ID', name: 'Idaho',          slug: 'idaho'          },
  { code: 'IL', name: 'Illinois',       slug: 'illinois'       },
  { code: 'IN', name: 'Indiana',        slug: 'indiana'        },
  { code: 'IA', name: 'Iowa',           slug: 'iowa'           },
  { code: 'KS', name: 'Kansas',         slug: 'kansas'         },
  { code: 'KY', name: 'Kentucky',       slug: 'kentucky'       },
  { code: 'LA', name: 'Louisiana',      slug: 'louisiana'      },
  { code: 'ME', name: 'Maine',          slug: 'maine'          },
  { code: 'MD', name: 'Maryland',       slug: 'maryland'       },
  { code: 'MA', name: 'Massachusetts',  slug: 'massachusetts'  },
  { code: 'MI', name: 'Michigan',       slug: 'michigan'       },
  { code: 'MN', name: 'Minnesota',      slug: 'minnesota'      },
  { code: 'MS', name: 'Mississippi',    slug: 'mississippi'    },
  { code: 'MO', name: 'Missouri',       slug: 'missouri'       },
  { code: 'MT', name: 'Montana',        slug: 'montana'        },
  { code: 'NE', name: 'Nebraska',       slug: 'nebraska'       },
  { code: 'NV', name: 'Nevada',         slug: 'nevada'         },
  { code: 'NH', name: 'New Hampshire',  slug: 'new-hampshire'  },
  { code: 'NJ', name: 'New Jersey',     slug: 'new-jersey'     },
  { code: 'NM', name: 'New Mexico',     slug: 'new-mexico'     },
  { code: 'NY', name: 'New York',       slug: 'new-york'       },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina' },
  { code: 'ND', name: 'North Dakota',   slug: 'north-dakota'   },
  { code: 'OH', name: 'Ohio',           slug: 'ohio'           },
  { code: 'OK', name: 'Oklahoma',       slug: 'oklahoma'       },
  { code: 'OR', name: 'Oregon',         slug: 'oregon'         },
  { code: 'PA', name: 'Pennsylvania',   slug: 'pennsylvania'   },
  { code: 'RI', name: 'Rhode Island',   slug: 'rhode-island'   },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina' },
  { code: 'SD', name: 'South Dakota',   slug: 'south-dakota'   },
  { code: 'TN', name: 'Tennessee',      slug: 'tennessee'      },
  { code: 'TX', name: 'Texas',          slug: 'texas'          },
  { code: 'UT', name: 'Utah',           slug: 'utah'           },
  { code: 'VT', name: 'Vermont',        slug: 'vermont'        },
  { code: 'VA', name: 'Virginia',       slug: 'virginia'       },
  { code: 'WA', name: 'Washington',     slug: 'washington'     },
  { code: 'WV', name: 'West Virginia',  slug: 'west-virginia'  },
  { code: 'WI', name: 'Wisconsin',      slug: 'wisconsin'      },
  { code: 'WY', name: 'Wyoming',        slug: 'wyoming'        },
];

// ─── TopoJSON decoder — same approach as /locations page (no external packages) ─
type RawArc   = [number, number][];
type ScreenPt = [number, number];

function decodeArcs(topology: any): ScreenPt[][] {
  const { scale = [1, 1], translate = [0, 0] } = topology.transform ?? {};
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
    pts.length === 0 ? pts.push(...arc) : pts.push(...arc.slice(1));
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

interface StatePath { abbr: string; name: string; d: string; }

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

// ─── (STATE_SVG_PATHS removed — map now uses /us-states.json TopoJSON) ──────────
const STATE_SVG_PATHS: Record<string, string> = {
  AL: 'M 680.61 441.07 L 669.46 440.41 L 669.78 408.54 L 672.39 396.41 L 682.35 397.04 L 697.05 399.05 L 701.09 406.28 L 699.73 439.75 Z',
  AK: 'M 188.54 518.76 L 179.99 507.11 L 182.48 494.79 L 188.54 487.83 L 198.1 488.06 L 205.04 501.34 L 201.01 514.62 Z M 152 529 L 133 527 L 119 516 L 119 500 L 133 491 L 148 496 L 158 510 Z',
  AZ: 'M 218.54 368.51 L 217.21 341.34 L 186.41 340.68 L 155.26 340.01 L 155.92 371.16 L 156.59 398.33 L 180.42 414.32 L 202.28 426.99 L 218.54 392.34 Z',
  AR: 'M 566.4 353.87 L 521.89 352.54 L 520.57 332.61 L 518.58 317.95 L 566.4 317.28 L 566.4 353.87 Z',
  CA: 'M 157.25 329.35 L 128.08 298.2 L 112.42 280.54 L 100.43 258.22 L 104.47 239.9 L 119.47 231.82 L 122.84 217.82 L 133.49 209.07 L 143.48 194.07 L 159.24 185.99 L 174.24 177.91 L 184.23 171.82 L 186.89 155.5 L 188.88 140.5 L 218.71 142.49 L 218.71 329.35 Z',
  CO: 'M 362.66 285.32 L 299.73 283.99 L 299.73 256.82 L 298.4 237.56 L 367.99 237.56 L 367.99 258.15 Z',
  CT: 'M 834.92 180.27 L 828.84 180.27 L 820.1 194.6 L 819.43 207.59 L 823.14 211.98 L 841.66 207.59 Z',
  DE: 'M 800.6 219.56 L 798.61 232.55 L 796.29 243.54 L 789.88 234.13 L 788.55 217.57 L 795.63 215.58 Z',
  FL: 'M 688.67 463.01 L 691.32 451.68 L 699.07 439.75 L 698.07 426.99 L 685.98 426.99 L 660.81 441.07 L 638.95 455.15 L 619.76 465.01 L 611.35 478.66 L 616.76 490.65 L 635.28 499.98 L 660.15 505.98 L 679.96 500.65 L 700.4 488.99 L 715.73 470.34 Z',
  GA: 'M 699.73 439.75 L 701.09 406.28 L 703.75 387.96 L 659.48 388.29 L 636.95 388.29 L 636.95 406.61 L 636.62 424.93 L 638.95 455.15 L 660.81 441.07 L 685.98 426.99 L 698.07 426.99 Z',
  HI: 'M 280 520 L 268 518 L 261 508 L 265 499 L 277 499 L 284 509 Z M 301 523 L 290 521 L 288 511 L 296 505 L 306 509 Z M 322 526 L 312 522 L 311 513 L 318 508 L 329 512 Z',
  ID: 'M 218.71 199.07 L 218.71 142.49 L 237.23 140.5 L 247.89 143.16 L 256.31 135.08 L 269.3 141.83 L 275.38 150.57 L 275.38 199.07 L 256.86 205.82 Z',
  IL: 'M 573.81 244.64 L 573.15 222.32 L 569.44 204.0 L 557.44 200.95 L 547.46 204.66 L 543.08 221.65 L 540.75 247.96 L 541.42 264.95 L 553.08 280.61 L 565.07 280.61 L 573.15 268.62 Z',
  IN: 'M 594.94 243.97 L 592.62 214.13 L 574.48 214.13 L 573.81 244.64 L 573.15 268.62 L 592.28 268.62 Z',
  IA: 'M 517.25 215.47 L 517.92 197.14 L 516.59 189.07 L 464.75 188.4 L 443.55 190.06 L 440.54 196.48 L 450.52 215.47 L 517.25 215.47 Z',
  KS: 'M 444.22 283.99 L 368.0 283.99 L 367.99 258.15 L 367.99 237.56 L 444.22 237.56 Z',
  KY: 'M 641.26 285.98 L 637.62 271.65 L 627.63 268.62 L 596.27 267.95 L 573.15 268.62 L 565.07 280.61 L 553.08 280.61 L 554.74 294.69 L 563.74 297.04 L 595.6 298.37 L 623.44 300.36 L 632.09 290.05 Z',
  LA: 'M 566.4 390.62 L 521.23 390.62 L 519.24 375.96 L 519.9 362.28 L 521.89 352.54 L 566.4 353.87 L 566.4 376.62 Z M 566.4 390.62 L 576.71 398.03 L 589.37 404.11 L 596.61 412.19 L 575.38 416.23 L 560.71 408.15 L 548.05 415.57 L 543.68 407.48 L 554.34 393.61 Z',
  ME: 'M 880.01 135.25 L 873.27 124.26 L 869.89 108.27 L 856.9 108.94 L 851.57 122.26 L 840.66 133.26 L 839.99 148.26 L 852.98 149.59 L 862.63 142.25 L 872.61 148.26 Z',
  MD: 'M 771.43 235.55 L 761.12 233.22 L 750.13 232.55 L 737.14 234.54 L 735.82 218.9 L 747.14 213.47 L 762.79 214.13 L 771.43 222.22 Z',
  MA: 'M 836.91 167.95 L 826.92 158.96 L 822.19 161.95 L 813.78 161.95 L 809.74 172.28 L 819.43 179.6 L 829.09 181.93 Z M 853.31 173.95 L 846.23 172.28 L 836.91 167.95 L 829.09 181.93 L 836.91 188.27 L 853.31 183.27 Z',
  MI: 'M 609.69 163.88 L 622.02 151.89 L 634.01 139.9 L 634.68 155.89 L 627.93 167.22 L 620.02 174.22 L 610.03 175.55 Z M 574.15 196.48 L 571.82 180.49 L 579.07 173.55 L 592.06 168.22 L 608.69 162.88 L 614.7 172.22 L 605.7 181.55 L 597.29 192.54 L 585.97 196.48 Z',
  MN: 'M 463.42 113.27 L 464.09 81.45 L 451.1 64.13 L 437.44 63.79 L 413.94 63.79 L 407.86 99.78 L 400.12 110.77 L 406.86 138.6 L 440.87 140.93 L 462.08 139.6 Z',
  MS: 'M 601.31 440.41 L 601.64 400.75 L 599.65 362.28 L 566.4 353.87 L 566.4 376.62 L 566.4 390.62 L 566.4 420.13 L 576.38 441.07 Z',
  MO: 'M 564.08 285.32 L 519.24 285.98 L 518.58 317.95 L 520.57 332.61 L 521.89 352.54 L 566.4 353.87 L 566.4 317.28 L 566.4 285.32 Z',
  MT: 'M 275.38 150.57 L 275.38 102.44 L 350.0 103.11 L 386.66 105.44 L 393.41 130.27 L 407.86 135.93 L 407.86 145.26 L 385.32 148.59 L 362.66 157.9 L 333.5 168.22 L 298.4 170.55 L 275.38 199.07 Z',
  NE: 'M 443.55 246.63 L 367.99 237.56 L 367.99 258.15 L 368.0 283.99 L 444.22 283.99 L 444.22 258.15 Z M 443.55 246.63 L 464.75 247.96 L 510.5 248.63 L 511.83 243.97 L 518.58 238.89 L 517.25 215.47 L 450.52 215.47 L 443.55 246.63 Z',
  NV: 'M 218.54 330.01 L 218.71 199.07 L 238.89 199.07 L 256.86 205.82 L 276.04 223.48 L 263.72 330.01 Z',
  NH: 'M 848.91 140.59 L 840.66 133.26 L 839.99 148.26 L 835.92 162.28 L 841.66 167.28 L 848.91 163.28 Z',
  NJ: 'M 800.6 202.59 L 795.63 215.58 L 796.29 234.55 L 802.26 236.55 L 810.34 229.55 L 814.05 214.13 Z',
  NM: 'M 298.4 363.61 L 297.07 330.01 L 297.07 285.32 L 299.73 283.99 L 362.66 285.32 L 362.0 312.49 L 363.32 340.34 L 364.32 370.19 L 298.4 369.85 Z',
  NY: 'M 786.56 184.59 L 775.57 168.28 L 759.46 163.28 L 741.18 163.28 L 736.81 155.89 L 724.14 152.23 L 714.49 155.89 L 698.07 165.22 L 712.5 190.05 L 754.14 192.38 L 773.91 196.48 Z',
  NC: 'M 751.46 302.03 L 735.48 294.69 L 703.75 295.36 L 678.24 298.37 L 665.91 304.69 L 643.25 300.36 L 636.95 315.29 L 641.26 320.95 L 660.81 319.62 L 689.64 316.95 L 718.81 318.29 L 748.47 312.95 L 756.47 308.29 Z',
  ND: 'M 399.45 100.44 L 400.12 64.13 L 403.83 62.8 L 459.04 63.13 L 462.75 63.13 L 463.42 113.27 L 462.08 139.6 L 406.86 138.6 L 399.78 132.27 Z',
  OH: 'M 640.59 222.32 L 640.59 199.32 L 616.42 197.14 L 608.02 200.95 L 592.28 214.13 L 594.94 243.97 L 629.28 242.64 L 640.59 240.64 Z',
  OK: 'M 522.55 352.54 L 444.22 350.55 L 363.32 349.88 L 363.32 340.34 L 362.0 312.49 L 444.22 310.83 L 519.24 310.83 L 519.24 332.61 Z',
  OR: 'M 129.4 185.99 L 128.74 155.5 L 130.74 138.84 L 159.24 135.84 L 187.88 132.17 L 218.71 142.49 L 218.71 199.07 L 188.22 199.07 L 162.9 195.07 L 140.73 194.07 Z',
  PA: 'M 757.8 195.48 L 712.5 190.05 L 698.07 193.38 L 694.36 213.13 L 712.83 220.9 L 756.47 219.56 L 768.46 216.57 Z',
  RI: 'M 851.24 192.27 L 841.66 192.27 L 836.91 202.26 L 839.33 210.26 L 847.74 210.26 Z',
  SC: 'M 703.75 387.96 L 701.09 371.62 L 710.49 352.87 L 718.81 318.29 L 689.64 316.95 L 660.81 319.62 L 641.26 320.95 L 636.95 388.29 L 659.48 388.29 Z',
  SD: 'M 399.78 180.49 L 400.12 148.59 L 407.86 145.26 L 407.86 135.93 L 462.08 139.6 L 463.42 183.49 L 444.88 183.49 Z',
  TN: 'M 641.26 320.95 L 636.95 315.29 L 643.25 300.36 L 592.62 300.36 L 574.48 300.36 L 554.74 294.69 L 554.74 317.28 L 566.4 317.28 L 566.4 330.01 L 641.26 330.01 Z',
  TX: 'M 444.22 350.55 L 444.22 310.83 L 362.0 312.49 L 363.32 340.34 L 364.32 370.19 L 362.0 406.28 L 374.99 432.44 L 395.16 452.69 L 404.48 472.29 L 432.65 491.88 L 449.57 501.54 L 477.07 509.63 L 488.39 503.21 L 503.38 501.87 L 513.04 490.22 L 507.63 471.63 L 520.62 451.02 L 519.24 423.6 L 519.9 362.28 L 521.89 352.54 Z',
  UT: 'M 262.39 311.49 L 263.72 281.32 L 263.72 248.63 L 275.38 248.63 L 297.07 249.3 L 297.07 285.32 L 297.07 311.49 Z M 263.72 330.01 L 263.72 311.49 L 297.07 311.49 L 297.07 330.01 Z',
  VT: 'M 828.17 133.59 L 823.14 126.26 L 818.43 141.59 L 816.1 160.28 L 822.19 161.95 L 826.92 158.96 L 828.84 152.26 Z',
  VA: 'M 765.79 265.28 L 757.8 258.28 L 741.18 252.95 L 724.81 250.62 L 703.75 261.62 L 678.24 271.62 L 660.48 271.28 L 641.26 285.98 L 632.09 290.05 L 623.44 300.36 L 643.25 300.36 L 665.91 304.69 L 678.24 298.37 L 703.75 295.36 L 719.15 284.66 L 736.14 273.28 L 751.46 263.95 Z',
  WA: 'M 130.74 138.84 L 128.74 111.61 L 132.74 97.61 L 160.57 92.95 L 180.74 97.61 L 190.73 111.61 L 207.39 116.27 L 218.71 116.27 L 218.71 142.49 L 188.88 140.5 L 159.24 135.84 Z',
  WV: 'M 741.18 252.95 L 736.81 241.96 L 724.81 237.3 L 717.81 228.96 L 700.07 224.96 L 694.36 213.13 L 698.07 193.38 L 712.5 190.05 L 723.48 197.81 L 741.18 197.81 L 752.13 205.81 L 757.8 214.81 L 756.47 219.56 L 768.46 216.57 L 771.43 222.22 L 765.79 236.88 L 757.8 246.95 Z',
  WI: 'M 551.41 174.22 L 544.75 157.9 L 551.08 143.59 L 558.76 135.26 L 573.81 131.6 L 576.38 142.93 L 572.48 157.57 L 574.15 175.55 L 573.81 196.48 L 557.44 200.95 L 547.46 196.48 Z',
  WY: 'M 275.38 199.07 L 298.4 170.55 L 333.5 168.22 L 362.66 157.9 L 385.32 148.59 L 393.41 195.48 L 393.41 229.48 L 367.99 231.49 L 298.4 229.48 L 275.38 228.48 Z',
};

const STATE_LABELS: Record<string, [number, number]> = {
  AL: [684, 450], AK: [175, 502], AZ: [187, 375], AR: [543, 335],
  CA: [157, 260], CO: [333, 262], CT: [830, 195], DE: [797, 228],
  FL: [663, 468], GA: [668, 415], HI: [290, 512], ID: [247, 170],
  IL: [557, 246], IN: [583, 243], IA: [479, 205], KS: [406, 261],
  KY: [600, 283], LA: [551, 390], ME: [860, 133], MD: [757, 228],
  MA: [836, 175], MI: [590, 183], MN: [436, 110], MS: [582, 407],
  MO: [543, 320], MT: [335, 153], NE: [471, 258], NV: [240, 265],
  NH: [844, 153], NJ: [805, 215], NM: [330, 330], NY: [748, 178],
  NC: [696, 305], ND: [432, 100], OH: [617, 220], OK: [443, 332],
  OR: [171, 170], PA: [730, 207], RI: [845, 200], SC: [678, 358],
  SD: [432, 163], TN: [598, 313], TX: [456, 422], UT: [276, 296],
  VT: [820, 148], VA: [710, 275], WA: [172, 118], WV: [729, 233],
  WI: [557, 170], WY: [335, 198],
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type Phase = 'hero' | 'map' | 'wizard' | 'done';

interface SopRegion {
  id: number;
  name: string;
  slug: string;
  is_active: string | boolean | number;
  has_sub_regions: string | boolean | number;
}

interface RegionPricing {
  region: { id: number; name: string; slug: string; is_active: boolean };
  pricing: {
    certified_price: number | null;
    turnkey_price: number | null;
    eportal_price: number | null;
    inspection_price: number | null;
    binder_price: number | null;
  } | null;
  sub_regions: { id: number; name: string; slug: string; certified_price: number | null }[];
  special_categories: { id: number; name: string; slug: string; certified_price: number | null }[];
}

interface OrderForm {
  firstName: string; lastName: string; company: string; email: string; phone: string;
  specialCategory: string;
  projectName: string; projectStreet: string; projectCity: string;
  projectState: string; projectZip: string; landDisturbance: string;
  serviceNeeded: string; startDate: string; endDate: string; drawingsLink: string;
  ePortal: boolean; ePortalMonths: number;
  cpesc: boolean; cpescMonths: number;
  hardCopy: boolean;
}

interface LeadForm {
  name: string; company: string; email: string; phone: string; message: string;
}

// ─── Pricing from ProSWPPP-Pricing-Master.xlsx ────────────────────────────────
const STATE_PRICES: Record<string, number> = {
  AL: 2497, AK: 3897, AZ: 2497, AR: 1997, CA: 5997, CO: 1997, CT: 3497,
  DE: 3497, FL: 1997, GA: 2497, HI: 3897, ID: 2497, IL: 4997, IN: 7997,
  IA: 2997, KS: 2497, KY: 2497, LA: 1797, ME: 3497, MD: 3497, MA: 3497,
  MI: 3497, MN: 2497, MS: 1897, MO: 2497, MT: 3497, NE: 2497, NV: 2497,
  NH: 3497, NJ: 3897, NM: 2497, NY: 3997, NC: 2497, ND: 2497, OH: 2897,
  OK: 1797, OR: 3497, PA: 3497, RI: 3497, SC: 2497, SD: 2497, TN: 1997,
  TX: 1797, UT: 2797, VT: 3897, VA: 5997, WA: 2797, WV: 2497, WI: 2897,
  WY: 2497,
};

const LAND_OPTIONS = [
  'Under 1 Acre', '1 to 5 Acres', '5 to 10 Acres', '10 to 25 Acres', '25+ Acres',
];
const SERVICE_OPTIONS = [
  'New SWPPP', 'SWPPP Revision / Update', 'SWPPP Inspection',
  'Annual Report', 'SWPPP Training', 'General Question',
];
const FALLBACK_PRICE = 2497; // used only if state not in STATE_PRICES

const EMPTY_ORDER: OrderForm = {
  firstName: '', lastName: '', company: '', email: '', phone: '',
  specialCategory: '',
  projectName: '', projectStreet: '', projectCity: '',
  projectState: '', projectZip: '', landDisturbance: '', serviceNeeded: '',
  startDate: '', endDate: '', drawingsLink: '',
  ePortal: false, ePortalMonths: 3,
  cpesc: false, cpescMonths: 3,
  hardCopy: false,
};

// ─── Pricing helpers ───────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function calcTotal(form: OrderForm, pricing: RegionPricing | null) {
  const base = pricing?.pricing?.certified_price ?? STATE_PRICES[form.projectState] ?? FALLBACK_PRICE;
  const ep = form.ePortal ? (pricing?.pricing?.eportal_price ?? 197) * form.ePortalMonths : 0;
  const cp = form.cpesc ? (pricing?.pricing?.inspection_price ?? 297) * form.cpescMonths : 0;
  const bd = form.hardCopy ? (pricing?.pricing?.binder_price ?? 300) : 0;
  return { base, ep, cp, bd, total: base + ep + cp + bd };
}

// ─── Shared UI atoms ───────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-amber-200 bg-white px-4 py-3 text-gray-900 ' +
  'placeholder:text-gray-400 focus:border-orange-400 focus:outline-none ' +
  'focus:ring-1 focus:ring-orange-400/25 transition-all text-sm';
const selectBg = { background: '#FFFFFF', color: '#111111' };

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1.5">
      {children}{required && <span className="text-orange-500 ml-1">*</span>}
    </label>
  );
}
function Field({ label, id, type = 'text', value, onChange, placeholder, required, hint, disabled }: {
  label: string; id: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; hint?: string; disabled?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className={inputCls + (disabled ? ' opacity-60 cursor-not-allowed' : '')} />
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}
function Select({ label, id, value, onChange, options, required }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>{label}</Label>
      <select id={id} value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-amber-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400/25 transition-all text-sm appearance-none"
        style={selectBg}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function MonthSelect({ label, id, value, onChange }: { label: string; id: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} value={value} onChange={e => onChange(parseInt(e.target.value))}
        className="w-full rounded-lg border border-amber-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none transition-all text-sm appearance-none"
        style={selectBg}>
        {[1, 2, 3, 4, 5, 6, 9, 12].map(m => <option key={m} value={m}>{m} month{m !== 1 ? 's' : ''}</option>)}
      </select>
    </div>
  );
}
function Divider() { return <div className="border-t border-amber-100 my-5" />; }
function SecLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">{children}</p>;
}

// ─── US Map SVG ────────────────────────────────────────────────────────────────
function USOrderMap({
  regions,
  loading,
  onStateClick,
}: {
  regions: SopRegion[];
  loading: boolean;
  onStateClick: (code: string, slug: string, active: boolean) => void;
}) {
  const [statePaths, setStatePaths] = useState<StatePath[]>([]);
  const [hovered, setHovered]       = useState<string | null>(null);
  const [tooltip, setTooltip]       = useState<{ name: string; cx: number; cy: number } | null>(null);

  // When the Storm Order Pro plugin REST endpoint is unavailable, `regions`
  // arrives empty. Fall back to treating every state as active so the map
  // remains clickable (rather than painting every state blue + popping the
  // 'we don't serve this state' modal on every click).
  const hasRegionData = regions.length > 0;
  const activeSlugSet = new Set(
    regions.filter(r => r.is_active == 1 || r.is_active === true || r.is_active === '1').map(r => r.slug)
  );

  // Fetch the same /us-states.json used by the /locations page
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
      .catch(() => {});
  }, []);

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {/* Loading overlay for SOP API */}
      {loading && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading state availability…
          </div>
        </div>
      )}

      {/* Map container — identical to /locations page */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {statePaths.length === 0 && (
          <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.9rem' }}>Loading map…</p>
          </div>
        )}

        {statePaths.length > 0 && (
          <svg
            viewBox="0 0 975 610"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="Interactive map of US states"
            onMouseLeave={() => { setTooltip(null); setHovered(null); }}
          >
            {statePaths.map(({ abbr, name, d }) => {
              const info   = STATE_INFO.find(s => s.code === abbr);
              // If the region API didn't return data, treat every known
              // state as active so the visitor can still select one.
              const active = hasRegionData
                ? (info ? activeSlugSet.has(info.slug) : false)
                : !!info;
              const isHov  = hovered === abbr;
              const fill   = active ? (isHov ? '#d4692a' : '#EF7C3B') : '#6B9ED1';
              return (
                <path
                  key={abbr}
                  d={d}
                  fill={fill}
                  stroke={active ? '#000' : '#555555'}
                  strokeWidth={active ? 0.8 : 0.5}
                  style={{ cursor: 'pointer', transition: 'fill 0.15s ease' }}
                  onMouseEnter={e => {
                    if (active) setHovered(abbr);
                    const box = (e.currentTarget as SVGPathElement).getBBox();
                    setTooltip({ name, cx: box.x + box.width / 2, cy: box.y });
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                  onClick={() => {
                    if (!info) return;
                    onStateClick(abbr, info.slug, active);
                  }}
                />
              );
            })}

            {tooltip && (
              <g style={{ pointerEvents: 'none' }}>
                <rect
                  x={tooltip.cx - 56} y={tooltip.cy - 32}
                  width={112} height={24} rx={4}
                  fill="rgba(0,0,0,0.88)"
                  stroke="rgba(239,124,59,0.6)"
                  strokeWidth={0.75}
                />
                <text
                  x={tooltip.cx} y={tooltip.cy - 16}
                  textAnchor="middle" fill="#fff"
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

        {/* Legend — identical to /locations page */}
        <div
          className="flex flex-wrap items-center gap-6 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: 3, background: '#EF7C3B' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Available — click to order</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 16, height: 16, borderRadius: 3, background: '#6B9ED1', border: '1px solid #5a7ab0' }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Contact us for service</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Blue-state lead modal ──────────────────────────────────────────────────────
function InactiveStateModal({ stateName, onClose }: { stateName: string; onClose: () => void }) {
  const [lead, setLead] = useState<LeadForm>({ name: '', company: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!lead.name || !lead.email) return;
    setSending(true);
    try {
      await fetch(`${SOP_BASE}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: stateName, ...lead }),
      });
    } catch { /* non-blocking */ }
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  };

  const setL = (k: keyof LeadForm, v: string) => setLead(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-6 relative" style={{ background: '#111115' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Message Sent!
            </h3>
            <p className="text-sm text-gray-400">Our team will reach out to you about {stateName} service shortly.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg text-sm font-bold text-white" style={{ background: '#f97316' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {stateName} — Service Inquiry
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                We&apos;re not actively providing services in <strong className="text-white">{stateName}</strong> at this time.
                Leave your info below and our team will contact you manually to discuss your options.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Your Name" id="l-name" value={lead.name} onChange={v => setL('name', v)} placeholder="John Smith" required />
                <Field label="Company" id="l-company" value={lead.company} onChange={v => setL('company', v)} placeholder="ACME Construction" />
              </div>
              <Field label="Email" id="l-email" type="email" value={lead.email} onChange={v => setL('email', v)} placeholder="john@example.com" required />
              <Field label="Phone" id="l-phone" type="tel" value={lead.phone} onChange={v => setL('phone', v)} placeholder="(555) 000-0000" />
              <div>
                <Label htmlFor="l-msg">Brief Description</Label>
                <textarea id="l-msg" value={lead.message} onChange={e => setL('message', e.target.value)} rows={3}
                  placeholder="Project type, size, timeline…"
                  className={inputCls + ' resize-none'} />
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={sending || !lead.name || !lead.email}
              className="mt-5 w-full rounded-lg py-3.5 text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: (!lead.name || !lead.email) ? 'rgba(249,115,22,0.35)' : '#f97316', cursor: (!lead.name || !lead.email) ? 'not-allowed' : 'pointer' }}
            >
              {sending
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending…</>
                : <>Send Inquiry <ChevronRight className="w-4 h-4" /></>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Step 1 — Contact Info ─────────────────────────────────────────────────────
function Step1({ form, set }: { form: OrderForm; set: (k: keyof OrderForm, v: string | boolean | number) => void }) {
  return (
    <div className="space-y-4">
      <SecLabel>Contact Information</SecLabel>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First Name" id="firstName" value={form.firstName} onChange={v => set('firstName', v)} placeholder="John" required />
        <Field label="Last Name" id="lastName" value={form.lastName} onChange={v => set('lastName', v)} placeholder="Smith" required />
      </div>
      <Field label="Company" id="company" value={form.company} onChange={v => set('company', v)} placeholder="ACME Construction Co." required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" id="email" type="email" value={form.email} onChange={v => set('email', v)} placeholder="john@acme.com" required />
        <Field label="Phone" id="phone" type="tel" value={form.phone} onChange={v => set('phone', v)} placeholder="(555) 000-0000" required />
      </div>
    </div>
  );
}

// ─── Step 2 — Project Details ──────────────────────────────────────────────────
function Step2({
  form, set, regionData, pricingLoading,
}: {
  form: OrderForm;
  set: (k: keyof OrderForm, v: string | boolean | number) => void;
  regionData: RegionPricing | null;
  pricingLoading: boolean;
}) {
  const stateName = STATE_INFO.find(s => s.code === form.projectState)?.name;
  const hasSpecialCats = (regionData?.special_categories?.length ?? 0) > 0;
  const hasSubRegions = (regionData?.sub_regions?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      {hasSpecialCats && (
        <div className="rounded-xl border border-orange-200 p-4" style={{ background: 'rgba(249,115,22,0.06)' }}>
          <p className="text-sm font-bold text-orange-600 mb-3">Do any of these apply to your project?</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="specialCategory" value="" checked={form.specialCategory === ''}
                onChange={() => set('specialCategory', '')} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-gray-700">None of the below</span>
            </label>
            {regionData!.special_categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="specialCategory" value={cat.slug} checked={form.specialCategory === cat.slug}
                  onChange={() => set('specialCategory', cat.slug)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-900">{cat.name}</span>
                {cat.certified_price && (
                  <span className="text-xs text-orange-600 ml-auto">{fmt(cat.certified_price)}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {hasSubRegions && (
        <div className="rounded-xl border border-amber-200 p-4" style={{ background: '#FFFBF4' }}>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Select Your Region</p>
          <div className="space-y-2">
            {regionData!.sub_regions.map(sub => (
              <label key={sub.id} className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="subRegion" value={sub.slug}
                  checked={form.specialCategory === sub.slug}
                  onChange={() => set('specialCategory', sub.slug)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-900">{sub.name}</span>
                {sub.certified_price && (
                  <span className="text-xs text-orange-600 ml-auto">{fmt(sub.certified_price)}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      <SecLabel>Project Details</SecLabel>

      <Field label="Project Name" id="projectName" value={form.projectName} onChange={v => set('projectName', v)}
        placeholder="Lakeview Road Expansion — Phase 2" required />

      <div className="rounded-xl border border-amber-200 p-4 space-y-3" style={{ background: '#FFFBF4' }}>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-gray-900">Project Location</p>
        </div>
        <Field label="Street Address" id="projectStreet" value={form.projectStreet} onChange={v => set('projectStreet', v)} placeholder="456 Construction Blvd" required />
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <Field label="City" id="projectCity" value={form.projectCity} onChange={v => set('projectCity', v)} placeholder="Houston" required />
          </div>
          <div className="col-span-2">
            <Label htmlFor="projectState" required>State</Label>
            <input id="projectState" value={stateName ?? form.projectState} disabled
              className={inputCls + ' opacity-60 cursor-not-allowed'} />
          </div>
          <div className="col-span-1">
            <Field label="Zip" id="projectZip" value={form.projectZip} onChange={v => set('projectZip', v)} placeholder="77001" required />
          </div>
        </div>

        {pricingLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
            <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin" />
            Loading pricing for {stateName}…
          </div>
        )}
        {regionData && !pricingLoading && (
          <div className="flex items-center gap-2 pt-1">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700">
              Base price for <strong className="text-green-800">{regionData.region.name}</strong>:{' '}
              <strong>{fmt(regionData.pricing?.certified_price ?? STATE_PRICES[form.projectState] ?? FALLBACK_PRICE)}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Land Disturbance Area" id="land" value={form.landDisturbance}
          onChange={v => set('landDisturbance', v)} options={LAND_OPTIONS} required />
        <Select label="Service Needed" id="service" value={form.serviceNeeded}
          onChange={v => set('serviceNeeded', v)} options={SERVICE_OPTIONS} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Project Start Date" id="startDate" type="date" value={form.startDate}
          onChange={v => set('startDate', v)} required />
        <Field label="Project End Date" id="endDate" type="date" value={form.endDate}
          onChange={v => set('endDate', v)} />
      </div>

      <Field label="Link to Civil Drawings" id="drawings" type="url" value={form.drawingsLink}
        onChange={v => set('drawingsLink', v)} placeholder="https://dropbox.com/sh/…"
        hint="Dropbox, Google Drive, or any file-sharing link" />
    </div>
  );
}

// ─── Step 3 — Add-ons ──────────────────────────────────────────────────────────
function Step3({ form, set, regionData }: {
  form: OrderForm;
  set: (k: keyof OrderForm, v: string | boolean | number) => void;
  regionData: RegionPricing | null;
}) {
  const totals = calcTotal(form, regionData);
  const ep_price = regionData?.pricing?.eportal_price ?? 197;
  const cp_price = regionData?.pricing?.inspection_price ?? 297;
  const bd_price = regionData?.pricing?.binder_price ?? 300;

  const addonCls = (checked: boolean) =>
    `block rounded-xl border p-5 cursor-pointer transition-all ${checked
      ? 'border-orange-400'
      : 'border-amber-200 hover:border-amber-300'
    }`;

  return (
    <div className="space-y-4">
      <SecLabel>Optional Add-ons</SecLabel>

      <label className={addonCls(form.ePortal)} style={form.ePortal ? { background: 'rgba(249,115,22,0.08)' } : { background: '#FFFBF4' }}>
        <div className="flex items-start gap-4">
          <input type="checkbox" checked={form.ePortal} onChange={e => set('ePortal', e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900 text-sm">E-Portal Access</span>
              <span className="text-sm font-bold text-orange-600">{fmt(ep_price)}/mo</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-0.5 mb-2">
              <li>• Custom inspection portal — mobile compatible</li>
              <li>• Cloud-stored docs emailed to all parties</li>
            </ul>
            {form.ePortal && (
              <div className="mt-3 space-y-2" onClick={e => e.preventDefault()}>
                <MonthSelect label="How many months?" id="ePortalMonths" value={form.ePortalMonths}
                  onChange={v => set('ePortalMonths', v)} />
                <p className="text-sm font-semibold text-orange-600">Subtotal: {fmt(totals.ep)}</p>
              </div>
            )}
          </div>
        </div>
      </label>

      <label className={addonCls(form.cpesc)} style={form.cpesc ? { background: 'rgba(249,115,22,0.08)' } : { background: '#FFFBF4' }}>
        <div className="flex items-start gap-4">
          <input type="checkbox" checked={form.cpesc} onChange={e => set('cpesc', e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900 text-sm">CPESC Certified Inspections</span>
              <span className="text-sm font-bold text-orange-600">{fmt(cp_price)}/mo</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-0.5 mb-2">
              <li>• Custom inspection portal included</li>
              <li>• Remotely coordinated with certified inspectors</li>
            </ul>
            {form.cpesc && (
              <div className="mt-3 space-y-2" onClick={e => e.preventDefault()}>
                <MonthSelect label="How many months?" id="cpescMonths" value={form.cpescMonths}
                  onChange={v => set('cpescMonths', v)} />
                <p className="text-sm font-semibold text-orange-600">Subtotal: {fmt(totals.cp)}</p>
              </div>
            )}
          </div>
        </div>
      </label>

      <label className={addonCls(form.hardCopy)} style={form.hardCopy ? { background: 'rgba(249,115,22,0.08)' } : { background: '#FFFBF4' }}>
        <div className="flex items-start gap-4">
          <input type="checkbox" checked={form.hardCopy} onChange={e => set('hardCopy', e.target.checked)}
            className="mt-1 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-900 text-sm">Hard Copy Binders</span>
              <span className="text-sm font-bold text-orange-600">{fmt(bd_price)}</span>
            </div>
            <p className="text-sm text-gray-600">2 professionally printed &amp; bound SWPPP hard copies.</p>
          </div>
        </div>
      </label>

      <div className="rounded-xl border border-amber-200 p-5" style={{ background: '#F5EEE2' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Price Summary</p>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base SWPPP</span>
            <span className="text-gray-900 font-medium">{fmt(totals.base)}</span>
          </div>
          {form.ePortal && <div className="flex justify-between"><span className="text-gray-600">E-Portal ({form.ePortalMonths} mo)</span><span className="text-gray-900">{fmt(totals.ep)}</span></div>}
          {form.cpesc && <div className="flex justify-between"><span className="text-gray-600">CPESC ({form.cpescMonths} mo)</span><span className="text-gray-900">{fmt(totals.cp)}</span></div>}
          {form.hardCopy && <div className="flex justify-between"><span className="text-gray-600">Hard Copy Binders</span><span className="text-gray-900">{fmt(totals.bd)}</span></div>}
          <div className="flex justify-between border-t border-amber-200 pt-3">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-orange-600">{fmt(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 — Review & Payment ─────────────────────────────────────────────────
function Step4({ form, regionData, onSubmit, submitting }: {
  form: OrderForm;
  regionData: RegionPricing | null;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const totals = calcTotal(form, regionData);
  const stateName = STATE_INFO.find(s => s.code === form.projectState)?.name ?? form.projectState;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-amber-200 p-5" style={{ background: '#F5EEE2' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4">Order Summary</p>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</p>
            <p className="text-gray-900 font-semibold">{form.firstName} {form.lastName}</p>
            <p className="text-gray-600">{form.company}</p>
            <p className="text-gray-600">{form.email} · {form.phone}</p>
          </div>
          <div className="border-t border-amber-200 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Project</p>
            <p className="text-gray-900 font-semibold">{form.projectName}</p>
            <p className="text-gray-600">{form.projectCity}, {stateName} {form.projectZip}</p>
            <p className="text-gray-600">{form.landDisturbance} · {form.serviceNeeded}</p>
            {form.startDate && <p className="text-gray-600">Start: {form.startDate}</p>}
          </div>
          <div className="border-t border-amber-200 pt-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Pricing</p>
            <div className="flex justify-between"><span className="text-gray-600">Base SWPPP</span><span className="text-gray-900">{fmt(totals.base)}</span></div>
            {form.ePortal && <div className="flex justify-between"><span className="text-gray-600">E-Portal ({form.ePortalMonths} mo)</span><span className="text-gray-900">{fmt(totals.ep)}</span></div>}
            {form.cpesc && <div className="flex justify-between"><span className="text-gray-600">CPESC ({form.cpescMonths} mo)</span><span className="text-gray-900">{fmt(totals.cp)}</span></div>}
            {form.hardCopy && <div className="flex justify-between"><span className="text-gray-600">Hard Copy Binders</span><span className="text-gray-900">{fmt(totals.bd)}</span></div>}
          </div>
          <div className="flex justify-between border-t border-orange-300/40 pt-4">
            <span className="font-bold text-gray-900 text-base">Total Due Today</span>
            <span className="text-2xl font-black text-orange-600">{fmt(totals.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 p-5" style={{ background: '#F5EEE2' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Payment</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock className="w-3 h-3" />Secured by Stripe
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-yellow-500/50 p-3 mb-4" style={{ background: 'rgba(234,179,8,0.07)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-xs font-semibold text-yellow-700">Demo Mode — Payment not processed</span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Card Number</p>
              <div className="rounded-lg border border-amber-200 px-4 py-3 font-mono text-sm text-gray-500" style={{ background: '#FFFBF4' }}>4242 4242 4242 4242</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Expiry</p>
                <div className="rounded-lg border border-amber-200 px-4 py-3 font-mono text-sm text-gray-500" style={{ background: '#FFFBF4' }}>12 / 28</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">CVC</p>
                <div className="rounded-lg border border-amber-200 px-4 py-3 font-mono text-sm text-gray-500" style={{ background: '#FFFBF4' }}>•••</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onSubmit} disabled={submitting}
          className="w-full rounded-lg text-white font-bold py-4 text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: submitting ? 'rgba(249,115,22,0.5)' : '#f97316', cursor: submitting ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = '#ea6010'; }}
          onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLElement).style.background = '#f97316'; }}>
          {submitting
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
            : <><Shield className="w-4 h-4" />Place Order — {fmt(totals.total)}</>}
        </button>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 256-bit SSL</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 72-hour delivery</span>
          <span>·</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 100% compliant or free</span>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation / Receipt ────────────────────────────────────────────────────
function Confirmation({ form, regionData, onReset }: {
  form: OrderForm;
  regionData: RegionPricing | null;
  onReset: () => void;
}) {
  const totals   = calcTotal(form, regionData);
  const stateName = STATE_INFO.find(s => s.code === form.projectState)?.name ?? form.projectState;
  // Generate a short reference ID — in production this would come from the API response
  const orderId  = `SWP-${Date.now().toString().slice(-7)}`;

  return (
    <div className="py-4">
      {/* ── Success header ── */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full border border-green-500/30 flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(34,197,94,0.1)' }}>
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.5px' }}>
          Order Received!
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Thank you, <span className="font-semibold text-gray-900">{form.firstName}</span>!{' '}
          A confirmation has been sent to{' '}
          <span className="font-semibold text-gray-900">{form.email}</span>.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono mt-3"
          style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>
          Order {orderId}
        </div>
      </div>

      {/* ── Receipt ── */}
      <div className="rounded-xl border border-amber-200 p-5 mb-4" style={{ background: '#F5EEE2' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4">Receipt</p>

        <div className="space-y-4 text-sm">
          {/* Contact */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</p>
            <p className="text-gray-900 font-semibold">{form.firstName} {form.lastName}</p>
            {form.company && <p className="text-gray-600">{form.company}</p>}
            <p className="text-gray-600">{form.email}</p>
            {form.phone && <p className="text-gray-600">{form.phone}</p>}
          </div>

          {/* Project */}
          <div className="border-t border-amber-200 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Project</p>
            <p className="text-gray-900 font-semibold">{form.projectName}</p>
            {form.projectStreet && <p className="text-gray-600">{form.projectStreet}</p>}
            <p className="text-gray-600">
              {form.projectCity ? `${form.projectCity}, ` : ''}{stateName} {form.projectZip}
            </p>
            <p className="text-gray-600">{form.landDisturbance} · {form.serviceNeeded}</p>
            {form.startDate && (
              <p className="text-gray-600">
                Start: {form.startDate}{form.endDate ? ` — End: ${form.endDate}` : ''}
              </p>
            )}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-amber-200 pt-4 space-y-2.5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Pricing</p>
            <div className="flex justify-between">
              <span className="text-gray-600">Base SWPPP — {stateName}</span>
              <span className="text-gray-900">{fmt(totals.base)}</span>
            </div>
            {form.ePortal && (
              <div className="flex justify-between">
                <span className="text-gray-600">E-Portal Access ({form.ePortalMonths} mo)</span>
                <span className="text-gray-900">{fmt(totals.ep)}</span>
              </div>
            )}
            {form.cpesc && (
              <div className="flex justify-between">
                <span className="text-gray-600">CPESC Inspections ({form.cpescMonths} mo)</span>
                <span className="text-gray-900">{fmt(totals.cp)}</span>
              </div>
            )}
            {form.hardCopy && (
              <div className="flex justify-between">
                <span className="text-gray-600">Hard Copy Binders</span>
                <span className="text-gray-900">{fmt(totals.bd)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-orange-300/40 pt-3">
              <span className="font-bold text-gray-900">Total Charged</span>
              <span className="text-2xl font-black text-orange-600">{fmt(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── What happens next ── */}
      <div className="rounded-xl border border-amber-200 p-5 mb-6" style={{ background: '#F5EEE2' }}>
        <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">What Happens Next</p>
        <div className="space-y-3">
          {[
            { icon: CheckCircle2, text: 'You\'ll receive an email confirmation within minutes.' },
            { icon: Clock,        text: 'Our team begins preparation within 24 hours of your order.' },
            { icon: FileText,     text: 'Your completed SWPPP is delivered within 72 hours.' },
            { icon: Shield,       text: '100% compliant or we revise it free of charge — guaranteed.' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a href="tel:8554387977"
          className="flex items-center justify-center gap-2 rounded-lg border border-amber-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:border-amber-300 transition-all w-full sm:w-auto"
          style={{ background: '#FFFBF4' }}>
          <Phone className="w-4 h-4" />Call Us: 855-GET-SWPPP
        </a>
        <button onClick={onReset}
          className="flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white w-full sm:w-auto transition-all"
          style={{ background: '#f97316' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ea6010'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f97316'}>
          Start a New Order <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Contact', icon: Building2 },
  { id: 2, label: 'Project', icon: FileText },
  { id: 3, label: 'Add-ons', icon: Shield },
  { id: 4, label: 'Payment', icon: CreditCard },
];

function ProgressBar({ step, submitted }: { step: number; submitted: boolean }) {
  return (
    <div className="max-w-2xl mx-auto px-4 mb-8">
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id || submitted;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                  style={{
                    borderColor: done || active ? '#f97316' : 'rgba(255,255,255,0.12)',
                    background: done ? '#f97316' : active ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
                  }}>
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-white" />
                    : <Icon className="w-4 h-4" style={{ color: active ? '#fb923c' : '#4b5563' }} />}
                </div>
                <span className="text-xs mt-1.5 font-semibold" style={{ color: active ? '#fb923c' : done ? '#9ca3af' : '#4b5563' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-0.5 flex-1 mx-2 transition-all duration-500"
                  style={{ background: step > s.id || submitted ? '#f97316' : 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────
export default function GetYourSwpppClient() {
  const [phase, setPhase] = useState<Phase>('hero');
  const [regions, setRegions] = useState<SopRegion[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('');
  const [inactiveModal, setInactiveModal] = useState<{ name: string } | null>(null);
  const [regionData, setRegionData] = useState<RegionPricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OrderForm>(EMPTY_ORDER);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    if (phase !== 'map') return;
    setMapLoading(true);
    fetch(`${SOP_BASE}/regions`, { headers: SOP_KEY ? { 'X-API-Key': SOP_KEY } : {} })
      .then(r => r.ok ? r.json() : { regions: [] })
      .then(data => setRegions(data.regions ?? []))
      .catch(() => setRegions([]))
      .finally(() => setMapLoading(false));
  }, [phase]);

  // ?start=map in the URL skips the hero landing and drops the visitor
  // straight onto the state-selection map. Used by the home-page CTAs
  // ('Get My SWPPP' / 'Start My Order') that already signal order intent.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === 'map') {
      setPhase('map');
    }
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    setPricingLoading(true);
    fetch(`${SOP_BASE}/regions/${selectedSlug}/pricing`, { headers: SOP_KEY ? { 'X-API-Key': SOP_KEY } : {} })
      .then(r => r.ok ? r.json() : null)
      .then(data => setRegionData(data ?? null))
      .catch(() => setRegionData(null))
      .finally(() => setPricingLoading(false));
  }, [selectedSlug]);

  const set = useCallback((k: keyof OrderForm, v: string | boolean | number) => setForm(f => ({ ...f, [k]: v })), []);

  const handleStartOrder = () => { setPhase('map'); setTimeout(scrollToTop, 100); };

  const handleStateClick = (code: string, slug: string, active: boolean) => {
    if (!active) {
      const info = STATE_INFO.find(s => s.code === code);
      setInactiveModal({ name: info?.name ?? code });
      return;
    }
    setSelectedCode(code);
    setSelectedSlug(slug);
    setForm(f => ({ ...f, projectState: code }));
    setPhase('wizard');
    setTimeout(scrollToTop, 100);
  };

  const canProceed = () => {
    if (step === 1) return !!(form.firstName && form.lastName && form.company && form.email && form.phone);
    if (step === 2) return !!(form.projectName && form.projectState && form.startDate && form.landDisturbance && form.serviceNeeded);
    return true;
  };

  const goNext = () => { scrollToTop(); setStep(s => s + 1); };
  const goBack = () => {
    if (step === 1) { setPhase('map'); setStep(1); setSubmitted(false); }
    else { scrollToTop(); setStep(s => s - 1); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const totals = calcTotal(form, regionData);

      // Map the rich order form into the EXISTING Fluent Form #3 (13 camelCase fields).
      // Extra data (dates, addons, totals, region info) is packed into `notes` as a
      // formatted summary so nothing is lost on the WP side.
      // When the WebWize Connect Orders plugin + Stripe go in, this switches back to
      // `${SOP_BASE}/orders` for the full e-commerce flow.
      const projectAddress = [form.projectStreet, form.projectCity, form.projectZip]
        .filter(Boolean).join(', ');

      const notes = [
        form.specialCategory ? `Special Category: ${form.specialCategory}` : '',
        form.startDate ? `Start Date: ${form.startDate}` : '',
        form.endDate ? `End Date: ${form.endDate}` : '',
        `E-Portal Add-on: ${form.ePortal ? `yes${form.ePortalMonths ? ` (${form.ePortalMonths} months)` : ''}` : 'no'}`,
        `CPESC Add-on: ${form.cpesc ? `yes${form.cpescMonths ? ` (${form.cpescMonths} months)` : ''}` : 'no'}`,
        `Hard Copy Add-on: ${form.hardCopy ? 'yes' : 'no'}`,
        `Region: ${selectedSlug || ''} (${selectedCode || ''})`,
        `─────────────────────`,
        `Total Amount: $${totals.total}`,
      ].filter(Boolean).join('\n');

      await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_slug: 'get-swppp',
          fields: {
            firstName:        form.firstName,
            lastName:         form.lastName,
            company:          form.company,
            email:            form.email,
            phone:            form.phone,
            projectName:      form.projectName,
            projectAddress:   projectAddress,
            state:            selectedCode || '',
            Zip:              form.projectZip,
            acreage:          form.landDisturbance,
            service:          form.serviceNeeded,
            civilDrawingsUrl: form.drawingsLink,
            notes:            notes,
          },
        }),
      });
    } catch { /* non-blocking */ }
    await new Promise(r => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
    setPhase('done');
    scrollToTop();
  };

  // ── Reset — clears all state and returns to hero ──────────────────────────────
  const handleReset = () => {
    setPhase('hero');
    setStep(1);
    setForm(EMPTY_ORDER);
    setSelectedCode('');
    setSelectedSlug('');
    setRegionData(null);
    setSubmitting(false);
    setSubmitted(false);
    setInactiveModal(null);
    setTimeout(scrollToTop, 50);
  };

  const stepTitle = ['', 'Contact Information', 'Project Details', 'Services & Add-ons', 'Review & Payment'][step];

  return (
    <div ref={topRef} className="min-h-screen" style={{ background: '#0A0A0C', color: '#F2F2F0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Reset button — fixed top-right, visible on all non-hero phases ── */}
      {phase !== 'hero' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:border-white/20 transition-all"
            style={{ background: 'rgba(10,10,12,0.92)', backdropFilter: 'blur(8px)' }}
            title="Start over from the beginning"
          >
            <X className="w-3.5 h-3.5" />Start Over
          </button>
        </div>
      )}

      {/* ── Hero ── */}
      {phase === 'hero' && (
        <div
          className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.9) 70%, #0A0A0C 100%), url(${HERO_BG})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
            style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#fb923c' }} />
            72-Hour Guaranteed Delivery
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-1px', lineHeight: 1.1 }}>
            Get Your <span style={{ color: '#f97316' }}>SWPPP</span> Now
          </h1>
          <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed mb-10">
            Select your state below to get started. Your fully compliant SWPPP delivered within 72 hours — guaranteed.
          </p>

          <button
            onClick={handleStartOrder}
            className="flex items-center justify-center gap-3 rounded-xl text-white font-black text-lg py-5 px-16 transition-all hover:scale-105 active:scale-100 shadow-2xl"
            style={{ background: '#f97316', minWidth: '340px', letterSpacing: '0.3px' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ea6010'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f97316'}
          >
            Start My Order
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" />100% Compliant</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" />72-Hour Delivery</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-orange-500" />17+ Years Experience</span>
            <a href="tel:8554387977" className="flex items-center gap-2 text-orange-400 font-semibold no-underline hover:text-orange-300">
              <Phone className="w-4 h-4" />855-GET-SWPPP
            </a>
          </div>
        </div>
      )}

      {/* ── Map Phase ── */}
      {phase === 'map' && (
        <div className="min-h-screen px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>
                <MapPin className="w-3.5 h-3.5" />Select Your State
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.5px' }}>
                Where Is Your Project?
              </h2>
              <p className="text-gray-400 max-w-md mx-auto text-sm">
                Click your state to see pricing and begin your order.
                <span className="text-orange-400"> Orange states</span> are available now.
              </p>
            </div>

            <USOrderMap regions={regions} loading={mapLoading} onStateClick={handleStateClick} />

            <div className="text-center mt-8">
              <button onClick={() => setPhase('hero')} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Wizard Phase ── */}
      {(phase === 'wizard' || phase === 'done') && (
        <div className="min-h-screen px-4 py-16">
          {!submitted && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ borderColor: 'rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.08)', color: '#fb923c' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#fb923c' }} />
                72-Hour SWPPP Delivery
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.5px' }}>
                Get Your <span style={{ color: '#f97316' }}>SWPPP</span> Now
              </h1>
              {selectedCode && (
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {STATE_INFO.find(s => s.code === selectedCode)?.name}
                  <button onClick={() => { setPhase('map'); setStep(1); }}
                    className="text-orange-400 underline underline-offset-2 ml-1 hover:text-orange-300">change</button>
                </p>
              )}
            </div>
          )}

          {!submitted && <ProgressBar step={step} submitted={submitted} />}

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-amber-200/70 p-6 sm:p-8" style={{ background: '#FCF7EF' }}>
              {submitted ? (
                <Confirmation form={form} regionData={regionData} onReset={handleReset} />
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.3px' }}>
                      {stepTitle}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Step {step} of {STEPS.length}</p>
                  </div>

                  {step === 1 && <Step1 form={form} set={set} />}
                  {step === 2 && <Step2 form={form} set={set} regionData={regionData} pricingLoading={pricingLoading} />}
                  {step === 3 && <Step3 form={form} set={set} regionData={regionData} />}
                  {step === 4 && <Step4 form={form} regionData={regionData} onSubmit={handleSubmit} submitting={submitting} />}

                  {step < 4 && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-amber-100">
                      <button onClick={goBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        {step === 1 ? 'Change State' : 'Back'}
                      </button>
                      <button
                        onClick={goNext}
                        disabled={!canProceed()}
                        className="flex items-center gap-2 rounded-lg text-white font-bold px-6 py-3 text-sm transition-all"
                        style={{
                          background: canProceed() ? '#f97316' : 'rgba(249,115,22,0.35)',
                          cursor: canProceed() ? 'pointer' : 'not-allowed',
                        }}
                        onMouseEnter={e => { if (canProceed()) (e.currentTarget as HTMLElement).style.background = '#ea6010'; }}
                        onMouseLeave={e => { if (canProceed()) (e.currentTarget as HTMLElement).style.background = '#f97316'; }}
                      >
                        {step === 3 ? 'Review Order' : 'Continue'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {!submitted && (
              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-600 flex-wrap">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gray-500" />SSL Encrypted</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" />72-Hour Delivery</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />100% Compliant or FREE</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Inactive state modal ── */}
      {inactiveModal && (
        <InactiveStateModal
          stateName={inactiveModal.name}
          onClose={() => setInactiveModal(null)}
        />
      )}
    </div>
  );
}
