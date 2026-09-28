"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Pt = [number, number];

// Traced from /images/neighborhood-map.jpg and scaled to a 600×400 canvas.
const BOUNDARY: Pt[] = [
  [41, 59], [242, 57], [296, 37], [324, 37], [351, 82], [429, 125], [519, 148],
  [546, 195], [542, 304], [519, 324], [429, 339], [273, 345], [129, 349], [41, 117],
];

const LAKE: Pt[] = [
  [113, 226], [168, 195], [254, 176], [339, 160], [390, 140], [417, 144], [423, 187],
  [406, 234], [339, 254], [273, 254], [242, 285], [218, 304], [156, 296], [117, 254],
];

/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
function smoothPath(pts: Pt[], tension = 0.5) {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return `${d}Z`;
}

const boundaryPath = smoothPath(BOUNDARY, 0.35);
const lakePath = smoothPath(LAKE, 0.6);

/** Line-drawn schematic of the neighborhood: four boundary roads around Earley Lake. */
export function NeighborhoodMap({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration = 2) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, margin: "-15%" },
          transition: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
        };
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, margin: "-15%" },
          transition: { duration: 0.8, delay },
        };

  return (
    <svg
      viewBox="0 0 600 400"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Schematic map: the neighborhood surrounds Earley Lake and is bounded by 143rd Street West to the north, Burnhaven Drive to the east, Southcross Drive to the south, and County Road 5 to the west."
    >
      <defs>
        <pattern id="nm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--primary)" strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Neighborhood area */}
      <motion.path d={boundaryPath} fill="url(#nm-hatch)" {...fade(0.6)} />
      <motion.path
        d={boundaryPath}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        {...draw(0)}
      />

      {/* Lake */}
      <motion.path d={lakePath} fill="var(--accent)" stroke="var(--primary)" strokeWidth="1.2" {...fade(1.1)} />
      <motion.g {...fade(1.4)} stroke="var(--primary)" strokeOpacity="0.35" fill="none" strokeWidth="1">
        <path d="M205 225 q10 -4 20 0 t20 0" />
        <path d="M300 200 q10 -4 20 0 t20 0" />
        <path d="M250 245 q8 -3 16 0 t16 0" />
      </motion.g>
      <motion.text {...fade(1.5)} x="268" y="222" textAnchor="middle" className="fill-primary font-display italic" fontSize="20">
        Earley Lake
      </motion.text>

      {/* Road labels */}
      <motion.g {...fade(1.8)} className="fill-foreground" fontSize="11" letterSpacing="1.5" style={{ textTransform: "uppercase" }}>
        <text x="150" y="45" textAnchor="middle">143rd St W</text>
        <text x="455" y="112" textAnchor="middle" transform="rotate(22 455 112)">Burnhaven Dr</text>
        <text x="300" y="370" textAnchor="middle">Southcross Dr</text>
        <text x="62" y="235" textAnchor="middle" transform="rotate(70 62 235)">County Rd 5</text>
      </motion.g>

      {/* Compass & note */}
      <motion.g {...fade(2)} className="fill-muted-foreground" transform="translate(560 58)">
        <path d="M0 -18 L6 4 L0 0 L-6 4Z" className="fill-foreground" />
        <text y="18" textAnchor="middle" fontSize="11" fontWeight="600" className="fill-foreground">N</text>
      </motion.g>
      <motion.text {...fade(2)} x="590" y="392" textAnchor="end" fontSize="10" className="fill-muted-foreground" letterSpacing="0.5">
        Schematic, not to scale
      </motion.text>
    </svg>
  );
}
