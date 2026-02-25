"use client"

import { useState } from "react"
import { ListMusic, Music2 } from "lucide-react"

const QUEUE = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd" },
  { id: 2, title: "Levitating", artist: "Dua Lipa" },
  { id: 3, title: "Stay", artist: "The Kid LAROI, Justin Bieber" },
  { id: 4, title: "Heat Waves", artist: "Glass Animals" },
  { id: 5, title: "As It Was", artist: "Harry Styles" },
  { id: 6, title: "Flowers", artist: "Miley Cyrus" },
  { id: 7, title: "Anti-Hero", artist: "Taylor Swift" },
]

export function QueuePlaylist() {
  const [currentPlaying, setCurrentPlaying] = useState(0)

  return (
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <ListMusic className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Queue</span>
        </div>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto max-h-56 scrollbar-thin">
        {QUEUE.map((track, i) => (
          <button
            key={track.id}
            onClick={() => setCurrentPlaying(i)}
            className={`w-full flex items-center gap-3 px-5 py-2 transition-colors text-left group ${
              i === currentPlaying
                ? "bg-secondary"
                : "hover:bg-secondary/60"
            }`}
          >
            {/* Track number / playing indicator */}
            <div className="flex-shrink-0 w-4 flex items-center justify-center">
              {i === currentPlaying ? (
                <div className="flex items-end gap-[2px] h-3.5">
                  <span
                    className="w-[3px] bg-primary rounded-sm"
                    style={{
                      animation: "eq 0.6s ease-in-out infinite alternate",
                      height: "6px",
                    }}
                  />
                  <span
                    className="w-[3px] bg-primary rounded-sm"
                    style={{
                      animation: "eq 0.6s ease-in-out 0.15s infinite alternate",
                      height: "10px",
                    }}
                  />
                  <span
                    className="w-[3px] bg-primary rounded-sm"
                    style={{
                      animation: "eq 0.6s ease-in-out 0.3s infinite alternate",
                      height: "4px",
                    }}
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground tabular-nums">{i + 1}</span>
              )}
            </div>

            {/* Mini cover */}
            <div className="flex-shrink-0 h-10 w-10 rounded bg-muted flex items-center justify-center">
              <Music2 className={`h-4 w-4 ${i === currentPlaying ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${i === currentPlaying ? "text-primary" : "text-foreground group-hover:text-foreground"}`}>
                {track.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes eq {
          0% { height: 3px; }
          100% { height: 14px; }
        }
      `}</style>
    </div>
  )
}
