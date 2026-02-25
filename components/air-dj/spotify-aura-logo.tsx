"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface SpotifyAuraLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SpotifyAuraLogo({ className = "", size = "md" }: SpotifyAuraLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = !mounted || resolvedTheme === "dark"
  const textColor = isDark ? "#FFFFFF" : "#191414"

  const dimensions = {
    sm: { width: 170, height: 45 },
    md: { width: 240, height: 64 },
    lg: { width: 340, height: 80 },
  }

  const { width, height } = dimensions[size]

  // Using unique IDs per instance to avoid SVG filter/mask collisions
  const uid = size

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 170 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Spotify Aura logo"
    >
      <defs>
        <linearGradient id={`auraGrad-${uid}`} x1="0" y1="0" x2="70" y2="70">
          <stop offset="0%" stopColor="#1DB954" />
          <stop offset="100%" stopColor="#1ed760" />
        </linearGradient>
      </defs>

      {/* Rotating Aura Ring */}
      <circle
        cx="40"
        cy="40"
        r="26"
        stroke={`url(#auraGrad-${uid})`}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="140 44"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 40 40"
          to="360 40 40"
          dur="14s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Inner wave mark */}
      <path
        d="M27 42 C33 34, 47 34, 53 42 C47 50, 33 50, 27 42"
        stroke="#1DB954"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* "Spotify" text */}
      <text
        x="82"
        y="34"
        fill={textColor}
        fontFamily="Inter, Arial, sans-serif"
        fontSize="18"
        fontWeight="500"
      >
        Spotify
      </text>

      {/* "AURA" text with clip reveal */}
      <clipPath id={`typeClip-${uid}`}>
        <rect x="82" y="42" width="0" height="30">
          <animate
            attributeName="width"
            from="0"
            to="78"
            dur="1.8s"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.25 0.1 0.25 1"
          />
        </rect>
      </clipPath>

      <text
        x="82"
        y="64"
        fill="#1DB954"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="26"
        fontWeight="700"
        clipPath={`url(#typeClip-${uid})`}
      >
        AURA
      </text>

      {/* Typing cursor */}
      <rect x="82" y="47" width="2.5" height="20" rx="1" fill="#1DB954">
        <animate
          attributeName="x"
          from="82"
          to="158"
          dur="1.8s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.25 0.1 0.25 1"
        />
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  )
}
