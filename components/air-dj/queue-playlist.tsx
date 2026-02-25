"use client"

import { useState, useEffect } from "react"
import { ListMusic, Music2 } from "lucide-react"

const QUEUE = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", playing: true },
  { id: 2, title: "Levitating", artist: "Dua Lipa", playing: false },
  { id: 3, title: "Stay", artist: "The Kid LAROI, Justin Bieber", playing: false },
  { id: 4, title: "Heat Waves", artist: "Glass Animals", playing: false },
  { id: 5, title: "As It Was", artist: "Harry Styles", playing: false },
  { id: 6, title: "Flowers", artist: "Miley Cyrus", playing: false },
  { id: 7, title: "Anti-Hero", artist: "Taylor Swift", playing: false },
]

export function QueuePlaylist() {
  const [currentPlaying, setCurrentPlaying] = useState(0)
  const [addAnimation, setAddAnimation] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAddAnimation(true)
      setTimeout(() => setAddAnimation(false), 600)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-[0_0_30px_-5px_rgba(29,185,84,0.1)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
        <ListMusic className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Queue</span>
        <span className="ml-auto text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
          {QUEUE.length} tracks
        </span>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto max-h-56 scrollbar-thin">
        {QUEUE.map((track, i) => (
          <button
            key={track.id}
            onClick={() => setCurrentPlaying(i)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-secondary/50 text-left ${
              i === currentPlaying
                ? "bg-primary/10 border-l-2 border-l-primary"
                : "border-l-2 border-l-transparent"
            } ${addAnimation && i === QUEUE.length - 1 ? "animate-pulse" : ""}`}
          >
            {/* Track number / playing indicator */}
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {i === currentPlaying ? (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-primary rounded-full animate-bounce" style={{ height: "8px", animationDelay: "0ms", animationDuration: "600ms" }} />
                  <span className="w-0.5 bg-primary rounded-full animate-bounce" style={{ height: "12px", animationDelay: "150ms", animationDuration: "600ms" }} />
                  <span className="w-0.5 bg-primary rounded-full animate-bounce" style={{ height: "6px", animationDelay: "300ms", animationDuration: "600ms" }} />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              )}
            </div>

            {/* Mini cover */}
            <div className="flex-shrink-0 h-8 w-8 rounded bg-secondary flex items-center justify-center">
              <Music2 className={`h-3.5 w-3.5 ${i === currentPlaying ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-medium truncate ${i === currentPlaying ? "text-primary" : "text-foreground"}`}>
                {track.title}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
