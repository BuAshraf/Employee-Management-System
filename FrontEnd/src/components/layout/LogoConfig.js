import React, { useId } from 'react';

/**
 * EMSLogoPattern
 * - A small, high-contrast, tileable pattern that remains visible at 32–48px.
 * - Uses currentColor for strokes/fills so it adapts to the theme.
 * - Props let you tune tile size, densities, and opacities.
 */
export default function EMSLogoPattern({
  width = '100%',
  height = '100%',
  tile = 40, // logical tile size in px-like units
  groupOpacity = 0.9,
  diamondFillOpacity = 0.35,
  circle7Opacity = 0.4,
  strokeOpacity = 0.25,
  centerColor = '#1976d2', // default blue for center
  cornerColor,
  idSuffix,
} = {}) {
  // Unique pattern id per instance to avoid collisions when used multiple times
  const rid = useId();
  const patternId = `emsPattern-${String(idSuffix || rid).replace(/:/g, '')}`;
  const dotColor = cornerColor || centerColor;

  // Helpers computed from tile size so it scales cleanly
  const cx = tile / 2;
  const cy = tile / 2;
  const s = tile * 0.38; // diamond half-size
  const corner = tile * 0.18; // corner dot center offset
  const dotR = Math.max(1, tile * 0.07);
  const ringR = tile * 0.46;
  const ringStroke = Math.max(1, tile * 0.06);
  const crossStroke = Math.max(1, tile * 0.04);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${tile} ${tile}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="EMS logo pattern"
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id={patternId} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <g opacity={groupOpacity}>
            {/* Cross guide lines */}
            <path
              d={`M0 ${cy} L ${tile} ${cy} M ${cx} 0 L ${cx} ${tile}`}
              stroke="currentColor"
              strokeWidth={crossStroke}
              strokeOpacity={strokeOpacity}
              fill="none"
              shapeRendering="geometricPrecision"
            />

            {/* Outer subtle ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR}
              fill="none"
              stroke="currentColor"
              strokeWidth={ringStroke}
              strokeOpacity={strokeOpacity * 0.9}
              shapeRendering="geometricPrecision"
            />

            {/* Central diamond */}
            <polygon
              points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
              fill="currentColor"
              fillOpacity={diamondFillOpacity}
              shapeRendering="geometricPrecision"
            />

            {/* Corner dots */}
            <circle cx={corner} cy={corner} r={dotR} fill={dotColor} fillOpacity={0.35} />
            <circle cx={tile - corner} cy={corner} r={dotR} fill={dotColor} fillOpacity={0.35} />
            <circle cx={corner} cy={tile - corner} r={dotR} fill={dotColor} fillOpacity={0.35} />
            <circle cx={tile - corner} cy={tile - corner} r={dotR} fill={dotColor} fillOpacity={0.35} />

            {/* Center circle for focal contrast */}
            <circle cx={cx} cy={cy} r={Math.max(1, tile * 0.12)} fill={centerColor} fillOpacity={circle7Opacity} />
          </g>
        </pattern>
      </defs>

      {/* Apply pattern */}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * EMSLogoMark
 * - Compact, solid emblem for places where a solid mark is preferred.
 * - Uses currentColor by default to match text/icon colors.
 */
export function EMSLogoMark({
  size = 48,
  colorPrimary = 'currentColor',
  colorSecondary = '#1976d2',
  bg = 'none',
  strokeWidth = 2,
  borderRadius = 10,
  opacity = 1,
} = {}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="EMS logo mark"
      style={{ display: 'block' }}
    >
      {/* Background / container */}
      <rect x="2" y="2" width="60" height="60" rx={borderRadius} fill={bg} stroke={colorPrimary} strokeOpacity={0.25} strokeWidth={strokeWidth} />

      {/* Large diamond */}
      <polygon
        points="32,8 56,32 32,56 8,32"
        fill={colorPrimary}
        opacity={0.22 * opacity}
      />

      {/* Inner rotated square outline */}
      <g transform="translate(32 32) rotate(45)">
        <rect x="-14" y="-14" width="28" height="28" fill="none" stroke={colorPrimary} strokeWidth={strokeWidth} opacity={0.6 * opacity} />
      </g>

      {/* Center circle */}
      <circle cx="32" cy="32" r="7" fill={colorSecondary} opacity={0.85 * opacity} />
    </svg>
  );
}
