import React from 'react';

type LogoVariant = 'mark' | 'compact' | 'full' | 'responsive';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface OfficialBrandLogoProps {
  className?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  priority?: boolean;
}

const heightByVariant: Record<LogoVariant, Record<LogoSize, string>> = {
  full: { sm: 'h-8', md: 'h-11', lg: 'h-14', xl: 'h-20' },
  compact: { sm: 'h-7', md: 'h-9', lg: 'h-11', xl: 'h-14' },
  mark: { sm: 'h-7', md: 'h-9', lg: 'h-12', xl: 'h-16' },
  responsive: { sm: 'h-7 sm:h-8', md: 'h-9 sm:h-11', lg: 'h-11 sm:h-14', xl: 'h-14 sm:h-20' },
};

const sourceByVariant: Record<LogoVariant, { src: string; width: number; height: number }> = {
  full: { src: '/logo/logo-full.webp', width: 430, height: 160 },
  compact: { src: '/logo/logo-compact.png', width: 135, height: 60 },
  mark: { src: '/logo/icon-192.png', width: 192, height: 192 },
  responsive: { src: '/logo/logo-compact.png', width: 135, height: 60 },
};

/** Official raster artwork with intrinsic dimensions to reserve navbar/footer layout. */
export const OfficialBrandLogo: React.FC<OfficialBrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  priority = false,
}) => {
  const source = sourceByVariant[variant];
  const image = (
    <img
      src={source.src}
      width={source.width}
      height={source.height}
      alt={variant === 'mark' ? '' : variant === 'compact' ? 'EDS' : 'PODIUM — Effet de Sol'}
      aria-hidden={variant === 'mark' ? true : undefined}
      className={`${heightByVariant[variant][size]} ${variant === 'mark' ? 'aspect-square' : ''} w-auto max-w-full shrink-0 select-none object-contain transition-all duration-300 group-hover:brightness-110 ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      {...(priority ? { fetchpriority: 'high' } : {})}
    />
  );

  if (variant === 'responsive') {
    return (
      <picture>
        <source media="(min-width: 640px)" srcSet="/logo/logo-full.webp" type="image/webp" />
        {image}
      </picture>
    );
  }

  return image;
};
