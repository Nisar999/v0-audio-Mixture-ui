"use client"

import { useState } from "react"
import { Hand, Mic, Zap, ChevronRight } from "lucide-react"
import { SpotifyAuraLogo } from "./spotify-aura-logo"
import { ThemeToggle } from "./theme-toggle"

const FEATURES = [
  {
    icon: Hand,
    title: "Gesture Control",
    description: "Wave, swipe, and point to control your music hands-free.",
  },
  {
    icon: Mic,
    title: "Voice Commands",
    description: "Say \"Aura\" and your assistant obeys. Skip, shuffle, or queue up.",
  },
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Instant gesture recognition powered by your camera feed.",
  },
]

interface LandingPageProps {
  onLaunch: () => void
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleLaunch = () => {
    setIsExiting(true)
    setTimeout(onLaunch, 600)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-all duration-600 ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Theme toggle in top right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1DB95408_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_#1DB95410_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-2xl text-center">
        {/* Logo */}
        <SpotifyAuraLogo size="lg" />

        {/* Headline */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance leading-tight">
            Control your music with{" "}
            <span className="text-primary">gestures</span> and{" "}
            <span className="text-primary">voice</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-lg mx-auto">
            Your camera becomes your controller. Wave to skip, pinch to adjust volume, or just say &quot;Aura&quot;.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-2 rounded-lg bg-card p-5"
              >
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA button */}
        <button
          onClick={handleLaunch}
          disabled={isExiting}
          className="group flex items-center gap-2 px-10 py-4 text-base font-bold rounded-full bg-primary text-primary-foreground hover:bg-[#1ed760] active:scale-95 transition-all duration-200 disabled:opacity-70"
        >
          {"Let's Roll"}
          <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-xs text-muted-foreground">
          Camera and microphone access required
        </p>
      </div>
    </div>
  )
}
