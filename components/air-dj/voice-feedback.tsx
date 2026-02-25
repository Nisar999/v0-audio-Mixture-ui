"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Music, Plus, Check, Hand, Volume2, SkipForward, Pause } from "lucide-react"

type FeedbackEntry = {
  text: string
  icon: typeof MessageSquare
  time: string
  type: "voice" | "gesture"
}

const INITIAL_ENTRIES: FeedbackEntry[] = [
  { text: "Playing Blinding Lights", icon: Music, time: "just now", type: "voice" },
  { text: "Swipe Right -- Next Track", icon: SkipForward, time: "2s ago", type: "gesture" },
  { text: "Added Levitating to queue", icon: Plus, time: "5s ago", type: "voice" },
  { text: "Palm Open -- Pause", icon: Pause, time: "8s ago", type: "gesture" },
]

const NEW_ENTRIES: FeedbackEntry[] = [
  { text: "Pinch In -- Volume Down", icon: Volume2, time: "just now", type: "gesture" },
  { text: "Playing Levitating", icon: Music, time: "just now", type: "voice" },
  { text: "Swipe Left -- Previous Track", icon: SkipForward, time: "just now", type: "gesture" },
  { text: "Shuffling playlist", icon: Check, time: "just now", type: "voice" },
  { text: "Thumbs Up -- Like Track", icon: Check, time: "just now", type: "gesture" },
  { text: "Volume decreased to 60%", icon: Volume2, time: "just now", type: "voice" },
  { text: "Fist -- Play", icon: Music, time: "just now", type: "gesture" },
  { text: "Added Heat Waves to queue", icon: Plus, time: "just now", type: "voice" },
]

export function VoiceFeedback() {
  const [entries, setEntries] = useState<FeedbackEntry[]>(INITIAL_ENTRIES)
  const [newIndex, setNewIndex] = useState(-1)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setNewIndex(0)
      setEntries((prev) => {
        const entry = NEW_ENTRIES[index % NEW_ENTRIES.length]
        return [entry, ...prev.slice(0, 4)]
      })
      index++
      setTimeout(() => setNewIndex(-1), 400)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Live Feed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Listening</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 px-5 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">showing:</span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Hand className="h-2.5 w-2.5" /> Gestures
        </span>
        <span className="flex items-center gap-1 text-[10px] font-medium text-foreground bg-secondary px-2 py-0.5 rounded-full">
          <MessageSquare className="h-2.5 w-2.5" /> Voice
        </span>
      </div>

      {/* Entry list */}
      <div className="flex flex-col pb-2">
        {entries.map((entry, i) => {
          const Icon = entry.icon
          return (
            <div
              key={`${entry.text}-${entry.type}-${i}`}
              className={`flex items-center gap-3 px-5 py-2.5 transition-all duration-300 ${
                i === newIndex ? "bg-secondary" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  entry.type === "gesture"
                    ? "bg-primary/15"
                    : "bg-secondary"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    entry.type === "gesture"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-foreground truncate">{entry.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wide ${
                      entry.type === "gesture" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {entry.type}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
