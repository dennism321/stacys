import { useId } from 'react';

type BrandMarkProps = {
  gapColor?: string;
  letterColor?: string;
  className?: string;
};

/** The brushstroke "S" monogram, in the official logo's rose-gold, gold, and black. */
export function BrandMark({ gapColor = '#faf7f2', letterColor = '#000000', className = '' }: BrandMarkProps) {
  const id = useId().replace(/:/g, '');
  const brush = `${id}-brush`;
  const gold = `${id}-gold`;

  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={brush} x1="16" y1="22" x2="228" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b9897f" />
          <stop offset="0.48" stopColor="#d4a99f" />
          <stop offset="1" stopColor="#f1cbc1" />
        </linearGradient>
        <linearGradient id={gold} x1="90" y1="28" x2="160" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ead588" />
          <stop offset="0.5" stopColor="#b88d37" />
          <stop offset="1" stopColor="#ead588" />
        </linearGradient>
      </defs>

      <g stroke={`url(#${brush})`} strokeLinecap="round" fill="none">
        <path d="M30 34C80 25 150 23 208 30" strokeWidth="31" />
        <path d="M37 80C93 73 160 71 211 78" strokeWidth="32" />
        <path d="M29 125C88 120 158 117 216 126" strokeWidth="29" />
      </g>
      <g fill={`url(#${brush})`}>
        <path d="M206 18c9 1 16 6 15 12s-6 9-12 8l-3-20Z" />
        <path d="M209 64c8 0 14 6 13 13-1 6-7 9-12 8l-1-21Z" />
        <path d="M214 112c10 2 18 8 16 15-2 6-9 9-15 7l-1-22Z" />
      </g>

      {/* Dry-brush gaps give the strokes their hand-painted texture. */}
      <g stroke={gapColor} strokeLinecap="round" fill="none">
        <path d="M116 45C148 46 180 47 214 50" strokeWidth="2.2" />
        <path d="M142 20C166 20 190 21 212 24" strokeWidth="1.5" />
        <path d="M60 39C80 39 98 40 118 40" strokeWidth="1.2" />
        <path d="M150 65C174 64 196 65 220 67" strokeWidth="1.8" />
        <path d="M118 92C150 93 182 94 214 97" strokeWidth="2" />
        <path d="M32 109C64 110 94 111 128 111" strokeWidth="1.8" />
        <path d="M160 113C182 113 202 114 222 116" strokeWidth="1.4" />
        <path d="M26 138C60 140 92 141 122 141" strokeWidth="1.5" />
        <path d="M40 30c5-4 11-4 15 0" strokeWidth="4.5" />
      </g>

      <text
        x="121"
        y="129"
        textAnchor="middle"
        transform="translate(121 0) scale(1.32 1) translate(-121 0)"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fontWeight="600"
        fontSize="150"
        fill={letterColor}
        stroke={`url(#${gold})`}
        strokeWidth="3.4"
        paintOrder="stroke"
      >
        S
      </text>
    </svg>
  );
}

type BrandLogoProps = {
  variant?: 'header' | 'footer';
  className?: string;
};

/** Full logo lockup: monogram, script name, and tagline. */
export default function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo-${variant} ${className}`}>
      <BrandMark
        className="brand-mark"
        gapColor={variant === 'footer' ? '#4e4035' : '#faf7f2'}
        letterColor={variant === 'footer' ? '#ffffff' : '#000000'}
      />
      <span className="brand-name">Stacy's Esthetics</span>
      <span className="brand-tagline">Fall in love with yourself</span>
    </span>
  );
}
