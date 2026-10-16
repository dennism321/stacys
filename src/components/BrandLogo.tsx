import { asset } from '../paths';

type BrandLogoProps = {
  variant?: 'header' | 'footer';
  className?: string;
};

/**
 * Full logo lockup: the brushstroke "S" monogram, script name, and tagline.
 * The monogram is rendered straight from the original Illustrator artwork so the
 * dry-brush texture matches exactly: black "S" on light backgrounds, white on dark.
 */
export default function BrandLogo({ variant = 'header', className = '' }: BrandLogoProps) {
  const mark = asset(variant === 'footer' ? 'images/logo-mark-light.webp' : 'images/logo-mark-dark.webp');

  return (
    <span className={`brand-logo brand-logo-${variant} ${className}`}>
      <img className="brand-mark" src={mark} srcSet={`${mark.replace('.webp', '-360.webp')} 360w, ${mark} 600w`} sizes="180px" alt="" width="600" height="377" decoding="async" />
      <span className="brand-name">Stacy's Esthetics</span>
      <span className="brand-tagline">Fall in love with yourself</span>
    </span>
  );
}
