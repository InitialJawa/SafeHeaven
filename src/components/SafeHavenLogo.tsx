import React, { useId } from 'react';

interface SafeHavenLogoProps {
  className?: string;
  size?: number | string;
}

export const SafeHavenLogo: React.FC<SafeHavenLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: size, height: size } : undefined;
  const rawId = useId();
  const idPrefix = `sh-gold-${rawId.replace(/:/g, '')}`;

  const bgGradId = `${idPrefix}-bgGrad`;
  const borderGradId = `${idPrefix}-borderGrad`;
  const goldTopGradId = `${idPrefix}-goldTopGrad`;
  const goldFrontGradId = `${idPrefix}-goldFrontGrad`;
  const goldFrontLusterId = `${idPrefix}-goldFrontLuster`;
  const goldLeftGradId = `${idPrefix}-goldLeftGrad`;
  const goldRightGradId = `${idPrefix}-goldRightGrad`;
  const bevelSpecularId = `${idPrefix}-bevelSpecular`;
  const stampGradId = `${idPrefix}-stampGrad`;
  const shadowFilterId = `${idPrefix}-shadowFilter`;
  const goldGlowId = `${idPrefix}-goldGlow`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      className={className}
      style={style}
      fill="none"
    >
      <defs>
        {/* Dark Metallic Background Gradient */}
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1d26" />
          <stop offset="45%" stopColor="#0e0d12" />
          <stop offset="100%" stopColor="#050507" />
        </linearGradient>

        {/* Outer App Icon Border Gradient */}
        <linearGradient id={borderGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a4756" />
          <stop offset="50%" stopColor="#25232e" />
          <stop offset="100%" stopColor="#121118" />
        </linearGradient>

        {/* Gold Top Face Specular Gradient */}
        <linearGradient id={goldTopGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B3" />
          <stop offset="25%" stopColor="#FCDA68" />
          <stop offset="65%" stopColor="#E8AF30" />
          <stop offset="100%" stopColor="#C78914" />
        </linearGradient>

        {/* Gold Front Face Main Body Gradient */}
        <linearGradient id={goldFrontGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFDC73" />
          <stop offset="30%" stopColor="#F3B32B" />
          <stop offset="75%" stopColor="#C9830E" />
          <stop offset="100%" stopColor="#8A5203" />
        </linearGradient>

        {/* Gold Front Face Metallic Luster (Left to Right Sweep) */}
        <linearGradient id={goldFrontLusterId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFEBB0" stopOpacity="0.6" />
          <stop offset="35%" stopColor="#FFF8E0" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#E5A01A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8A5203" stopOpacity="0.7" />
        </linearGradient>

        {/* Left Shadow Facet */}
        <linearGradient id={goldLeftGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D99B1E" />
          <stop offset="50%" stopColor="#9E690B" />
          <stop offset="100%" stopColor="#543400" />
        </linearGradient>

        {/* Right Shadow Facet */}
        <linearGradient id={goldRightGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8720F" />
          <stop offset="50%" stopColor="#694103" />
          <stop offset="100%" stopColor="#301A00" />
        </linearGradient>

        {/* Bevel Highlight Line Specular */}
        <linearGradient id={bevelSpecularId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFE899" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D9961A" stopOpacity="0.1" />
        </linearGradient>

        {/* Debossed Stamp Text Fill */}
        <linearGradient id={stampGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#573300" />
          <stop offset="100%" stopColor="#8C5708" />
        </linearGradient>

        {/* Soft Drop Shadow Filter */}
        <filter id={shadowFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.75" />
        </filter>

        {/* Ambient Gold Glow Filter */}
        <filter id={goldGlowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="24" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* App Icon Card Background Frame */}
      <rect x="30" y="30" width="940" height="940" rx="200" fill={`url(#${bgGradId})`} stroke={`url(#${borderGradId})`} strokeWidth="12" />

      {/* Subtle Ambient Gold Glow beneath Gold Bars */}
      <ellipse cx="500" cy="720" rx="380" ry="120" fill="#E8AF30" opacity="0.18" filter={`url(#${goldGlowId})`} />

      <g filter={`url(#${shadowFilterId})`}>
        {/* ================= TOP GOLD BAR ================= */}
        <g id="top-bar">
          {/* Shadow on middle bars */}
          <polygon points="310,250 690,250 720,290 280,290" fill="#000000" opacity="0.4" />

          {/* Top Face */}
          <polygon points="360,100 640,100 690,250 310,250" fill={`url(#${goldTopGradId})`} />
          <line x1="362" y1="102" x2="638" y2="102" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />

          {/* Left Side Facet */}
          <polygon points="360,100 310,250 330,410 375,250" fill={`url(#${goldLeftGradId})`} />

          {/* Right Side Facet */}
          <polygon points="640,100 690,250 670,410 625,250" fill={`url(#${goldRightGradId})`} />

          {/* Front Face */}
          <polygon points="310,250 690,250 670,410 330,410" fill={`url(#${goldFrontGradId})`} />
          <polygon points="310,250 690,250 670,410 330,410" fill={`url(#${goldFrontLusterId})`} />

          {/* Front Bevel Highlights */}
          <line x1="310" y1="250" x2="690" y2="250" stroke={`url(#${bevelSpecularId})`} strokeWidth="4" />
          <line x1="310" y1="250" x2="330" y2="410" stroke={`url(#${bevelSpecularId})`} strokeWidth="2.5" />
          <line x1="690" y1="250" x2="670" y2="410" stroke="#694103" strokeWidth="2" />
          <line x1="330" y1="410" x2="670" y2="410" stroke="#543400" strokeWidth="3" />
        </g>

        {/* ================= MIDDLE LEFT GOLD BAR ================= */}
        <g id="mid-left-bar">
          {/* Top Face */}
          <polygon points="200,260 450,260 470,420 150,420" fill={`url(#${goldTopGradId})`} />
          <line x1="202" y1="262" x2="448" y2="262" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />

          {/* Left Side Facet */}
          <polygon points="200,260 150,420 175,590 220,420" fill={`url(#${goldLeftGradId})`} />

          {/* Front Face */}
          <polygon points="150,420 470,420 445,590 175,590" fill={`url(#${goldFrontGradId})`} />
          <polygon points="150,420 470,420 445,590 175,590" fill={`url(#${goldFrontLusterId})`} />

          {/* Bevels */}
          <line x1="150" y1="420" x2="470" y2="420" stroke={`url(#${bevelSpecularId})`} strokeWidth="4" />
          <line x1="150" y1="420" x2="175" y2="590" stroke={`url(#${bevelSpecularId})`} strokeWidth="2.5" />
          <line x1="470" y1="420" x2="445" y2="590" stroke="#694103" strokeWidth="2" />
          <line x1="175" y1="590" x2="445" y2="590" stroke="#543400" strokeWidth="3" />
        </g>

        {/* ================= MIDDLE RIGHT GOLD BAR ================= */}
        <g id="mid-right-bar">
          {/* Top Face */}
          <polygon points="550,260 800,260 850,420 530,420" fill={`url(#${goldTopGradId})`} />
          <line x1="552" y1="262" x2="798" y2="262" stroke="#FFFFFF" strokeWidth="3" opacity="0.8" />

          {/* Right Side Facet */}
          <polygon points="800,260 850,420 825,590 780,420" fill={`url(#${goldRightGradId})`} />

          {/* Front Face */}
          <polygon points="530,420 850,420 825,590 555,590" fill={`url(#${goldFrontGradId})`} />
          <polygon points="530,420 850,420 825,590 555,590" fill={`url(#${goldFrontLusterId})`} />

          {/* Bevels */}
          <line x1="530" y1="420" x2="850" y2="420" stroke={`url(#${bevelSpecularId})`} strokeWidth="4" />
          <line x1="530" y1="420" x2="555" y2="590" stroke={`url(#${bevelSpecularId})`} strokeWidth="2.5" />
          <line x1="850" y1="420" x2="825" y2="590" stroke="#694103" strokeWidth="2" />
          <line x1="555" y1="590" x2="825" y2="590" stroke="#543400" strokeWidth="3" />
        </g>

        {/* Shadow cast by middle bars onto bottom bar */}
        <polygon points="120,600 880,600 900,635 100,635" fill="#000000" opacity="0.45" />

        {/* ================= BOTTOM FRONT GOLD BAR (MAIN BASE INGOT) ================= */}
        <g id="bottom-main-bar">
          {/* Top Face Slope */}
          <polygon points="175,590 825,590 885,635 115,635" fill={`url(#${goldTopGradId})`} />
          <line x1="177" y1="592" x2="823" y2="592" stroke="#FFFFFF" strokeWidth="3.5" opacity="0.85" />

          {/* Left Side Facet */}
          <polygon points="175,590 115,635 80,830 140,830" fill={`url(#${goldLeftGradId})`} />

          {/* Right Side Facet */}
          <polygon points="825,590 885,635 920,830 860,830" fill={`url(#${goldRightGradId})`} />

          {/* Front Main Face */}
          <polygon points="115,635 885,635 860,830 140,830" fill={`url(#${goldFrontGradId})`} />
          <polygon points="115,635 885,635 860,830 140,830" fill={`url(#${goldFrontLusterId})`} />

          {/* Bevel Edge Highlights */}
          <line x1="115" y1="635" x2="885" y2="635" stroke={`url(#${bevelSpecularId})`} strokeWidth="5" />
          <line x1="115" y1="635" x2="140" y2="830" stroke={`url(#${bevelSpecularId})`} strokeWidth="3" />
          <line x1="885" y1="635" x2="860" y2="830" stroke="#694103" strokeWidth="2.5" />
          <line x1="140" y1="830" x2="860" y2="830" stroke="#422800" strokeWidth="4" />

          {/* STAMP ENGRAVING "FINE GOLD 999.9" */}
          <text x="642" y="738" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="44" fill="#FFFFFF" opacity="0.35" letterSpacing="3">FINE GOLD</text>
          <text x="640" y="736" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="44" fill={`url(#${stampGradId})`} letterSpacing="3">FINE GOLD</text>

          <text x="732" y="792" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="48" fill="#FFFFFF" opacity="0.35" letterSpacing="2">999.9</text>
          <text x="730" y="790" fontFamily="'Inter', 'Arial Black', sans-serif" fontWeight="900" fontSize="48" fill={`url(#${stampGradId})`} letterSpacing="2">999.9</text>
        </g>
      </g>
    </svg>
  );
};
