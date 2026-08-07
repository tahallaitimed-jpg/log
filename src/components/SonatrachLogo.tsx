import React from 'react';

interface SonatrachLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtext?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const SonatrachLogo: React.FC<SonatrachLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true,
  subtext = 'Division HSE',
  variant = 'auto'
}) => {
  // Sizing configurations
  let emblemHeight = 'h-10'; // height for emblem
  let textSize = 'text-base';
  let badgeSize = 'text-[10px] px-2 py-0.5';

  if (size === 'sm') {
    emblemHeight = 'h-8';
    textSize = 'text-xs';
    badgeSize = 'text-[9px] px-1.5 py-0.5';
  } else if (size === 'lg') {
    emblemHeight = 'h-14';
    textSize = 'text-xl';
    badgeSize = 'text-xs px-2.5 py-1';
  } else if (size === 'xl') {
    emblemHeight = 'h-20';
    textSize = 'text-2xl';
    badgeSize = 'text-sm px-3 py-1';
  }

  // Text color based on theme
  const textColor = variant === 'light' 
    ? 'text-slate-900' 
    : variant === 'dark' 
    ? 'text-white' 
    : 'text-slate-900 dark:text-white';

  const subtextColor = variant === 'light'
    ? 'text-slate-600'
    : variant === 'dark'
    ? 'text-cyan-200/90'
    : 'text-slate-600 dark:text-cyan-200/90';

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Crisp Official Sonatrach Emblem Container */}
      <div className={`relative ${emblemHeight} aspect-[3/4] flex-shrink-0 flex items-center justify-center bg-white rounded-xl p-1 shadow-md border border-slate-200/60 dark:border-slate-800`}>
        <svg 
          viewBox="0 0 100 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-contain"
        >
          {/* Top Arabic Typography: سوناطراك */}
          <text
            x="50"
            y="18"
            textAnchor="middle"
            fill="#1E293B"
            fontSize="18"
            fontWeight="bold"
            fontFamily="'Segoe UI', 'Amiri', 'Traditional Arabic', sans-serif"
          >
            سوناطراك
          </text>

          {/* Official Sonatrach "S" Orange Emblem */}
          <g>
            {/* Top Bar */}
            <rect x="5" y="26" width="90" height="18" rx="4" fill="#EE7D00" />
            
            {/* Middle Bar */}
            <rect x="5" y="50" width="90" height="18" rx="4" fill="#EE7D00" />
            
            {/* Bottom Bar */}
            <rect x="5" y="74" width="90" height="18" rx="4" fill="#EE7D00" />

            {/* Right Vertical Connector (Connecting Top & Middle on Right) */}
            <rect x="68" y="26" width="27" height="42" rx="4" fill="#EE7D00" />

            {/* Left Vertical Connector (Connecting Middle & Bottom on Left) */}
            <rect x="5" y="50" width="27" height="42" rx="4" fill="#EE7D00" />
          </g>

          {/* Bottom Latin Typography: sonatrach */}
          <text
            x="50"
            y="112"
            textAnchor="middle"
            fill="#1E293B"
            fontSize="13"
            fontWeight="900"
            letterSpacing="0.2"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            sonatrach
          </text>
        </svg>

        {/* Small HSE badge on emblem */}
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-black text-slate-950 items-center justify-center border border-white shadow">
            H
          </span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-wider uppercase ${textColor} ${textSize}`}>
              SONATRACH
            </span>
            {subtext && (
              <span className={`font-black bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-md ${badgeSize}`}>
                {subtext}
              </span>
            )}
          </div>
          <span className={`text-[11px] font-semibold tracking-normal leading-tight hidden sm:block ${subtextColor}`}>
            Système de Gestion DDSD
          </span>
        </div>
      )}
    </div>
  );
};
