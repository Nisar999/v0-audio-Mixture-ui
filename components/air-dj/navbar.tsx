"use client"

import { useState, useEffect } from "react"
import { Disc3 } from "lucide-react"

export function Navbar() {
  const [listening, setListening] = useState(true)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Disc3 className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          AIR <span className="text-primary">DJ</span>
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/60 border border-border/60">
        <span
          className={`inline-block h-2 w-2 rounded-full transition-all duration-700 ${
            listening
              ? pulse
                ? "bg-primary shadow-[0_0_8px_2px_rgba(29,185,84,0.6)]"
                : "bg-primary shadow-[0_0_4px_1px_rgba(29,185,84,0.3)]"
              : "bg-muted-foreground"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {listening ? "Listening for wake word..." : "Idle"}
        </span>
      </div>

      <button
        onClick={() => setListening(!listening)}
        className="h-9 w-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
      >
        <span className="sr-only">User profile</span>
        <span className="text-sm font-bold text-primary">DJ</span>
      </button>
    </nav>
  )
}
