import React, { useId } from 'react';

interface SafeHavenLogoProps {
  className?: string;
  size?: number | string;
}

export const SafeHavenLogo: React.FC<SafeHavenLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  const rawId = useId();
  const maskId = `safehaven-vault-mask-${rawId.replace(/:/g, '')}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      className={className}
      style={style}
      fill="none"
    >
      <defs>
        <mask id={maskId}>
          {/* Base white rect keeps gold shapes */}
          <rect x="0" y="0" width="1000" height="1000" fill="#FFFFFF" />

          {/* Black paths create transparent cutouts (negative space) */}
          <g fill="#000000" stroke="#000000">
            {/* Hinges outlines */}
            <path
              d="M 760 320 H 925 C 945 320 955 330 955 350 V 415 C 955 435 945 445 925 445 H 760 Z"
              fill="none"
              stroke="#000000"
              strokeWidth="22"
              strokeLinejoin="round"
            />
            <path
              d="M 760 555 H 925 C 945 555 955 565 955 585 V 650 C 955 670 945 680 925 680 H 760 Z"
              fill="none"
              stroke="#000000"
              strokeWidth="22"
              strokeLinejoin="round"
            />
            <path
              d="M 865 445 V 555"
              fill="none"
              stroke="#000000"
              strokeWidth="22"
              strokeLinecap="square"
            />

            {/* Outer Concentric Ring Cutout */}
            <circle cx="450" cy="500" r="370" stroke="#000000" strokeWidth="22" fill="none" />

            {/* Rivets / Dots Cutouts */}
            <circle cx="450" cy="85" r="18" fill="#000000" stroke="none" />
            <circle cx="683" cy="182" r="18" fill="#000000" stroke="none" />
            <circle cx="683" cy="818" r="18" fill="#000000" stroke="none" />
            <circle cx="450" cy="915" r="18" fill="#000000" stroke="none" />
            <circle cx="217" cy="818" r="18" fill="#000000" stroke="none" />
            <circle cx="120" cy="500" r="18" fill="#000000" stroke="none" />
            <circle cx="217" cy="182" r="18" fill="#000000" stroke="none" />

            {/* Wheel Outer Ring Cutout */}
            <circle cx="450" cy="500" r="230" stroke="#000000" strokeWidth="22" fill="none" />

            {/* Wheel Inner Ring Cutout */}
            <circle cx="450" cy="500" r="180" stroke="#000000" strokeWidth="20" fill="none" />

            {/* Top Wedge Sector Cutout */}
            <path d="M 450 500 L 323 373 A 180 180 0 0 1 577 373 Z" fill="#000000" stroke="none" />

            {/* Bottom Wedge Sector Cutout */}
            <path d="M 450 500 L 577 627 A 180 180 0 0 1 323 627 Z" fill="#000000" stroke="none" />

            {/* Wheel Diagonal Spokes Cutout */}
            <line x1="323" y1="373" x2="577" y2="627" stroke="#000000" strokeWidth="30" strokeLinecap="round" />
            <line x1="323" y1="627" x2="577" y2="373" stroke="#000000" strokeWidth="30" strokeLinecap="round" />

            {/* Center Hub Circle Cutout */}
            <circle cx="450" cy="500" r="36" fill="#000000" stroke="none" />
          </g>
        </mask>
      </defs>

      {/* Gold Door & Hinges with SVG Mask applied */}
      <g fill="#F4B847" mask={`url(#${maskId})`}>
        <circle cx="450" cy="500" r="450" />
        <path d="M 760 320 H 925 C 945 320 955 330 955 350 V 415 C 955 435 945 445 925 445 H 760 Z" />
        <path d="M 760 555 H 925 C 945 555 955 565 955 585 V 650 C 955 670 945 680 925 680 H 760 Z" />
      </g>
    </svg>
  );
};
