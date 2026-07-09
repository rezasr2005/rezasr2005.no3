import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} select-none shrink-0`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Shape mask for clipping */}
        <clipPath id="logo-shape">
          <path d="M 50 2 C 62 12, 98 32, 98 50 C 98 68, 62 88, 50 98 C 38 88, 2 68, 2 50 C 2 32, 38 12, 50 2 Z" />
        </clipPath>
        {/* Clip path for the middle right sector (where the S turns dark navy) */}
        <clipPath id="middle-right-clip">
          <polygon points="50,50 100,0 100,100" />
        </clipPath>
      </defs>

      {/* Group with clipping applied */}
      <g clipPath="url(#logo-shape)">
        {/* Left side background (Cyan/Light Blue) */}
        <rect x="0" y="0" width="50" height="100" fill="#13b1f5" />

        {/* Right side backgrounds (Sectors) */}
        {/* Top-Right Sector (Navy) */}
        <polygon points="50,50 50,0 100,0" fill="#0b1e36" />
        {/* Middle-Right Sector (Cyan) */}
        <polygon points="50,50 100,0 100,100" fill="#13b1f5" />
        {/* Bottom-Right Sector (Navy) */}
        <polygon points="50,50 100,100 50,100" fill="#0b1e36" />

        {/* Letter 'F' on the left (Navy) */}
        <path d="M 20,20 H 45 V 30 H 31 V 40 H 40 V 50 H 31 V 80 H 20 Z" fill="#0b1e36" />

        {/* Letter 'S' on the right (first draw entire 'S' as Light Blue) */}
        <path d="M 80,22 C 64,22 53,30 53,43 C 53,57 77,53 77,63 C 77,69 71,73 64,73 C 56,73 54,68 54,64 H 43 C 43,75 52,84 65,84 C 81,84 89,75 89,63 C 89,48 65,52 65,42 C 65,36 71,32 77,32 C 83,32 85,36 85,40 H 96 C 96,28 89,22 80,22 Z" fill="#13b1f5" />

        {/* Draw Navy 'S' on top, but clipped only to the Middle-Right Sector */}
        <g clipPath="url(#middle-right-clip)">
          <path d="M 80,22 C 64,22 53,30 53,43 C 53,57 77,53 77,63 C 77,69 71,73 64,73 C 56,73 54,68 54,64 H 43 C 43,75 52,84 65,84 C 81,84 89,75 89,63 C 89,48 65,52 65,42 C 65,36 71,32 77,32 C 83,32 85,36 85,40 H 96 C 96,28 89,22 80,22 Z" fill="#0b1e36" />
        </g>
      </g>

      {/* Dividing Lines (On top of everything) */}
      <line x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="3" />
      <line x1="14" y1="14" x2="86" y2="86" stroke="white" strokeWidth="3" />
      <line x1="14" y1="86" x2="86" y2="14" stroke="white" strokeWidth="3" />

      {/* Outer White Border */}
      <path d="M 50 2 C 62 12, 98 32, 98 50 C 98 68, 62 88, 50 98 C 38 88, 2 68, 2 50 C 2 32, 38 12, 50 2 Z" stroke="white" strokeWidth="3" fill="none" />
    </svg>
  );
}
