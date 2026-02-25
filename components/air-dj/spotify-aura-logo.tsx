"use client"

interface SpotifyAuraLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SpotifyAuraLogo({ className = "", size = "md" }: SpotifyAuraLogoProps) {
  const dimensions = {
    sm: { width: 170, height: 45 },
    md: { width: 240, height: 64 },
    lg: { width: 340, height: 90 },
  }

  const { width, height } = dimensions[size]

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 340 90"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Spotify Aura logo"
    >
      <defs>
        <linearGradient id="auraGradient" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#1DB954" />
          <stop offset="100%" stopColor="#1ed760" />
        </linearGradient>

        <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rotating Aura Ring */}
      <circle
        cx="45"
        cy="45"
        r="28"
        stroke="url(#auraGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="150 50"
        filter="url(#subtleGlow)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 45 45"
          to="360 45 45"
          dur="12s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Static inner wave */}
      <path
        d="M30 47 C36 38, 54 38, 60 47 C54 56, 36 56, 30 47"
        stroke="#1DB954"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Spotify text */}
      <text
        x="90"
        y="40"
        fill="#FFFFFF"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="20"
        fontWeight="500"
      >
        Spotify
      </text>

      {/* AURA typing animation using mask */}
      <mask id="typingMask">
        <rect x="90" y="48" width="0" height="30" fill="white">
          <animate
            attributeName="width"
            from="0"
            to="120"
            dur="2.2s"
            fill="freeze"
          />
        </rect>
      </mask>

      {/* AURA text */}
      <text
        x="90"
        y="70"
        fill="#1DB954"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="28"
        fontWeight="700"
        mask="url(#typingMask)"
        filter="url(#subtleGlow)"
      >
        AURA
      </text>

      {/* Cursor blink */}
      <rect x="90" y="52" width="3" height="22" fill="#1DB954">
        <animate
          attributeName="x"
          from="90"
          to="210"
          dur="2.2s"
          fill="freeze"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  )
}
