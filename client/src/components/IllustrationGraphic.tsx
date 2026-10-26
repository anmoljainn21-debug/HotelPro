import React from 'react';

export const IllustrationGraphic: React.FC<{ className?: string }> = ({ className = 'w-full max-w-md' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 520 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        {/* Soft decorative background leaf foliage */}
        <g opacity="0.35">
          {/* Left botanical leaves */}
          <path
            d="M80 340C70 280 40 240 20 230C45 220 85 245 95 295C100 240 85 190 70 170C95 180 120 220 115 270C130 210 140 160 135 130C155 160 155 220 135 275"
            fill="#3B82F6"
          />
          <circle cx="55" cy="300" r="10" fill="#1E40AF" opacity="0.5" />
          <circle cx="55" cy="325" r="8" fill="#1E40AF" opacity="0.5" />
          <circle cx="55" cy="348" r="6" fill="#1E40AF" opacity="0.5" />

          {/* Right botanical leaves */}
          <path
            d="M440 330C455 270 480 230 500 220C475 210 435 235 425 285C420 230 435 180 450 160C425 170 400 210 405 260C390 200 380 150 385 120C365 150 365 210 385 265"
            fill="#60A5FA"
          />
        </g>

        {/* Floating geometric particles */}
        <rect x="250" y="360" width="10" height="10" rx="2" transform="rotate(45 250 360)" fill="#3B82F6" opacity="0.7" />
        <rect x="235" y="360" width="8" height="8" rx="2" transform="rotate(45 235 360)" fill="#93C5FD" opacity="0.7" />
        <rect x="265" y="360" width="8" height="8" rx="2" transform="rotate(45 265 360)" fill="#93C5FD" opacity="0.7" />
        <rect x="250" y="110" width="8" height="8" rx="2" transform="rotate(45 250 110)" fill="#3B82F6" opacity="0.7" />
        <rect x="180" y="150" width="6" height="6" rx="2" transform="rotate(45 180 150)" fill="#60A5FA" opacity="0.5" />
        <rect x="330" y="140" width="6" height="6" rx="2" transform="rotate(45 330 140)" fill="#60A5FA" opacity="0.5" />

        {/* Desktop Monitor Screen Base and Stand */}
        <path d="M120 375H400V383H120V375Z" fill="#3B82F6" />
        <path d="M250 330H270V375H250V330Z" fill="#CBD5E1" />
        <rect x="75" y="145" width="370" height="205" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4" />
        <rect x="85" y="155" width="350" height="185" rx="3" fill="#FFFFFF" />

        {/* Dark Clipboard / Document on Screen */}
        <rect x="205" y="175" width="135" height="150" rx="8" transform="rotate(-10 205 175)" fill="#1E293B" />
        <circle cx="280" cy="275" r="22" fill="#EF4444" opacity="0.9" />
        {/* Striped pattern on red circle */}
        <line x1="262" y1="266" x2="298" y2="266" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="260" y1="274" x2="300" y2="274" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="264" y1="282" x2="296" y2="282" stroke="#FFFFFF" strokeWidth="2.5" />

        {/* Left Hand Holding Paper */}
        <path
          d="M100 240C110 230 135 225 155 220C170 216 195 210 210 215C222 219 224 232 212 242C200 252 185 258 170 262C150 268 135 275 125 285L90 270L100 240Z"
          fill="#FED7AA"
        />
        {/* Left Sleeve */}
        <path d="M90 235L125 250L105 315L65 295L90 235Z" fill="#2563EB" />
        <path d="M125 250L135 254L120 288L110 284L125 250Z" fill="#FFFFFF" />

        {/* Right Hand Holding Pen */}
        <path
          d="M340 250C330 240 315 235 300 230C288 226 270 220 272 210C274 200 288 202 300 210C315 220 335 235 350 250L340 250Z"
          fill="#FED7AA"
        />
        <path
          d="M355 270C345 255 330 240 315 230C300 220 290 212 288 200C295 192 305 195 318 205C335 218 355 240 375 260L355 270Z"
          fill="#FED7AA"
        />
        {/* Right Sleeve */}
        <path d="M365 255L400 240L425 295L390 310L365 255Z" fill="#2563EB" />
        <path d="M365 255L360 265L388 277L393 267L365 255Z" fill="#FFFFFF" />

        {/* Stylized Red Signing Pen */}
        <g transform="rotate(-35 320 200)">
          <path d="M312 110L326 110L324 200L314 200Z" fill="#DC2626" />
          <path d="M314 200L319 220L324 200Z" fill="#1E293B" />
          <path d="M312 100L326 100L326 110L312 110Z" fill="#2563EB" />
          <circle cx="319" cy="140" r="2.5" fill="#FFFFFF" />
          <circle cx="319" cy="160" r="2.5" fill="#FFFFFF" />
          <circle cx="319" cy="180" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
