import { cn } from "@/lib/utils";

const INK = "#5f7f80";
const DEEP = "#3f5f60";
const WATER = "#bcd3d3";
const MIST = "#dce8e8";
const SAND = "#efe6d4";
const SUN = "#e7c27d";
const REED = "#7c9468";

/** Animated Earley Lake scene for the dashboard banner. */
export function LakeScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 200"
      preserveAspectRatio="xMidYMax slice"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="lk-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f7f3ea" stopOpacity="0" />
          <stop offset="1" stopColor={SAND} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="lk-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={WATER} />
          <stop offset="1" stopColor={INK} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="lk-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={SUN} stopOpacity="0.95" />
          <stop offset="1" stopColor={SUN} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="200" fill="url(#lk-sky)" />
      <circle cx="370" cy="92" r="46" fill="url(#lk-sun)" />
      <circle cx="370" cy="92" r="16" fill={SUN} opacity="0.9" />

      {/* birds */}
      <g className="animate-glide" style={{ animationDelay: "-12s" }}>
        <path d="M0 48 q5 -5 10 0 q5 -5 10 0" fill="none" stroke={DEEP} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M26 38 q4 -4 8 0 q4 -4 8 0" fill="none" stroke={DEEP} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* far hills */}
      <path d="M0 128 C60 96 110 104 160 116 C220 130 260 92 330 100 C390 106 430 118 480 108 V150 H0Z" fill={MIST} />
      {/* tree line */}
      <path
        d="M0 134 l8 -14 l8 14 l6 -10 l6 10 l9 -18 l9 18 l5 -8 l5 8 l10 -16 l10 16 H80 C140 128 180 138 240 132 l7 -12 l7 12 l6 -9 l6 9 l9 -16 l9 16 C330 128 400 138 480 130 V150 H0Z"
        fill={INK}
        opacity="0.55"
      />

      {/* lake */}
      <rect x="0" y="146" width="480" height="54" fill="url(#lk-water)" />
      <ellipse cx="370" cy="160" rx="34" ry="2" fill={SUN} opacity="0.55" />
      <ellipse cx="370" cy="170" rx="20" ry="1.5" fill={SUN} opacity="0.4" />
      <g className="animate-wave" opacity="0.6">
        <path
          d="M0 162 q15 -4 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0"
          fill="none"
          stroke="#fff"
          strokeWidth="1.2"
        />
      </g>
      <g className="animate-wave-slow" opacity="0.4">
        <path
          d="M0 182 q20 -5 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"
          fill="none"
          stroke="#fff"
          strokeWidth="1.2"
        />
      </g>

      {/* duck */}
      <g className="animate-bob">
        <path d="M232 166 q4 -10 16 -8 q6 -8 13 -4 q3 3 -1 6 l6 1 l-6 3 q2 7 -10 9 q-14 1 -18 -7z" fill={DEEP} />
        <circle cx="258" cy="156" r="1" fill="#fff" />
      </g>

      {/* reeds */}
      <g stroke={REED} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M24 200 q-2 -28 4 -48" />
        <path d="M34 200 q2 -20 -2 -36" />
        <path d="M44 200 q0 -24 8 -40" />
        <path d="M452 200 q-3 -26 3 -44" />
        <path d="M462 200 q2 -18 -3 -32" />
      </g>
      <g fill="#8a6a45">
        <rect x="26" y="146" width="4" height="12" rx="2" transform="rotate(10 28 152)" />
        <rect x="49" y="156" width="4" height="12" rx="2" transform="rotate(22 51 162)" />
        <rect x="453" y="150" width="4" height="12" rx="2" transform="rotate(6 455 156)" />
      </g>
    </svg>
  );
}

type EmptyVariant = "inbox" | "calendar" | "news" | "photos" | "people" | "search";

/** Small spot illustrations for empty states. */
export function EmptyIllustration({
  variant,
  className,
}: {
  variant: EmptyVariant;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 160 120" className={cn("h-28 w-auto", className)} aria-hidden>
      <ellipse cx="80" cy="104" rx="56" ry="7" fill={MIST} />
      {variant === "inbox" ? (
        <>
          <path d="M20 96 q15 -6 30 0 t30 0 t30 0 t30 0" fill="none" stroke={WATER} strokeWidth="3" strokeLinecap="round" />
          <g className="animate-bob">
            <path d="M44 74 h72 l-12 20 h-48z" fill={INK} />
            <path d="M80 74 v-44 l26 36 h-26z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <path d="M78 36 l-22 30 h22z" fill={SAND} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          </g>
        </>
      ) : null}
      {variant === "calendar" ? (
        <>
          <rect x="42" y="28" width="76" height="68" rx="10" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M42 46 h76" stroke={INK} strokeWidth="2.5" />
          <rect x="42" y="28" width="76" height="18" rx="10" fill={MIST} />
          <path d="M60 22 v12 M100 22 v12" stroke={DEEP} strokeWidth="3" strokeLinecap="round" />
          {[0, 1, 2, 3].map((c) =>
            [0, 1].map((r) => (
              <rect key={`${c}-${r}`} x={52 + c * 16} y={56 + r * 16} width="9" height="9" rx="2" fill={r === 1 && c === 2 ? SUN : MIST} />
            )),
          )}
          <g className="animate-bob">
            <path d="M120 38 q16 -2 18 14 q-16 4 -18 -14z" fill={REED} />
            <path d="M121 39 l15 12" stroke="#fff" strokeWidth="1" />
          </g>
        </>
      ) : null}
      {variant === "news" ? (
        <>
          <rect x="36" y="26" width="80" height="72" rx="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <rect x="46" y="36" width="36" height="24" rx="3" fill={MIST} />
          <path d="M88 40 h18 M88 48 h18 M88 56 h12 M46 70 h60 M46 78 h60 M46 86 h40" stroke={WATER} strokeWidth="3" strokeLinecap="round" />
          <g className="animate-bob">
            <path d="M118 30 l14 -8 l-4 16z" fill={SUN} />
            <path d="M112 40 q6 -4 8 -2" fill="none" stroke={SUN} strokeWidth="2" strokeLinecap="round" />
          </g>
        </>
      ) : null}
      {variant === "photos" ? (
        <>
          <rect x="52" y="22" width="68" height="56" rx="6" fill={MIST} stroke={INK} strokeWidth="2" transform="rotate(8 86 50)" />
          <rect x="38" y="32" width="72" height="62" rx="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M44 86 l18 -22 l12 12 l10 -8 l20 18z" fill={INK} opacity="0.7" />
          <circle cx="92" cy="48" r="6" fill={SUN} className="animate-bob" />
        </>
      ) : null}
      {variant === "people" ? (
        <>
          <circle cx="62" cy="50" r="14" fill={MIST} stroke={INK} strokeWidth="2.5" />
          <path d="M38 96 q0 -26 24 -26 q24 0 24 26" fill={MIST} stroke={INK} strokeWidth="2.5" />
          <circle cx="100" cy="46" r="16" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M74 98 q0 -30 26 -30 q26 0 26 30" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="122" cy="30" r="8" fill={SUN} className="animate-bob" />
          <path d="M119 30 h6 M122 27 v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : null}
      {variant === "search" ? (
        <>
          <circle cx="72" cy="56" r="26" fill="#fff" stroke={INK} strokeWidth="3" />
          <path d="M91 75 l20 20" stroke={DEEP} strokeWidth="6" strokeLinecap="round" />
          <path d="M60 50 q12 -10 24 0" fill="none" stroke={WATER} strokeWidth="3" strokeLinecap="round" className="animate-bob" />
        </>
      ) : null}
    </svg>
  );
}

/** Circular postmark stamped on each message in the inbox reader. */
export function Postmark({
  top,
  bottom,
  className,
}: {
  top: string;
  bottom: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-24 w-24 overflow-visible", className)} aria-hidden>
      <defs>
        <path id="pm-top" d="M20 60 a40 40 0 0 1 80 0" />
        <path id="pm-bottom" d="M16 60 a44 44 0 0 0 88 0" />
      </defs>
      <g fill="none" stroke={INK} strokeOpacity="0.55">
        <circle cx="60" cy="60" r="52" strokeWidth="2" />
        <circle cx="60" cy="60" r="34" strokeWidth="1.2" strokeDasharray="3 3" />
      </g>
      <text fontSize="10" fontWeight="600" letterSpacing="2.5" fill={INK} fillOpacity="0.7">
        <textPath href="#pm-top" startOffset="50%" textAnchor="middle">
          EARLEY LAKE
        </textPath>
      </text>
      <text fontSize="8.5" fontWeight="600" letterSpacing="1.6" fill={INK} fillOpacity="0.6">
        <textPath href="#pm-bottom" startOffset="50%" textAnchor="middle">
          BURNSVILLE · MN
        </textPath>
      </text>
      <text x="60" y="57" textAnchor="middle" fontSize="13" fontWeight="700" fill={DEEP} fillOpacity="0.75">
        {top}
      </text>
      <text x="60" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={INK} fillOpacity="0.7">
        {bottom}
      </text>
      <g stroke={INK} strokeOpacity="0.35" strokeWidth="1.4">
        <path d="M112 44 q10 -4 20 0 t20 0" fill="none" />
        <path d="M112 54 q10 -4 20 0 t20 0" fill="none" />
        <path d="M112 64 q10 -4 20 0 t20 0" fill="none" />
      </g>
    </svg>
  );
}
