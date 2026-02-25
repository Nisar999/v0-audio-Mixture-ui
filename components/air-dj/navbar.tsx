"use client"

import { Music2, User } from "lucide-react"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground">
          <Music2 className="h-4 w-4 text-background" />
        </div>
        <span className="text-base font-bold tracking-tight text-foreground">
          Spotify <span className="font-normal text-muted-foreground">Air DJ</span>
        </span>
      </div>

      {/* Status pill */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary">
        <span className="inline-block h-2 w-2 rounded-full bg-primary" />
        <span className="text-sm text-muted-foreground">
          {'Listening for '}<span className="text-foreground font-medium">{'"Hey Air DJ"'}</span>
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
