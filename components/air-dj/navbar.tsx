"use client"

import { User } from "lucide-react"
import { SpotifyAuraLogo } from "./spotify-aura-logo"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background">
      {/* Logo */}
      <SpotifyAuraLogo size="sm" />

      {/* Status pill */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">
          {'Listening for '}<span className="text-foreground font-medium">{'"Aura"'}</span>
        </span>
      </div>

      {/* Profile */}
      <button
        className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-border transition-colors"
        aria-label="User profile"
      >
        <User className="h-4 w-4 text-muted-foreground" />
      </button>
    </nav>
  )
}
