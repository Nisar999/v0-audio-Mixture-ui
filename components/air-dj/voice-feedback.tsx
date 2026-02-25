"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Check, Music, Plus } from "lucide-react"

const COMMANDS = [
  { text: "Playing song: Blinding Lights", icon: Music, time: "just now" },
  { text: "Added song to queue", icon: Plus, time: "2s ago" },
  { text: "Volume set to 80%", icon: Check, time: "5s ago" },
  { text: "Skipped to next track", icon: Check, time: "12s ago" },
]

export function VoiceFeedback() {
  const [commands, setCommands] = useState(COMMANDS)
  const [animatingIndex, setAnimatingIndex] = useState(-1)

  useEffect(() => {
    const newCommands = [
      { text: "Playing song: Levitating", icon: Music, time: "just now" },
      { text: "Shuffling playlist", icon: Check, time: "just now" },
      { text: "Volume decreased to 60%", icon: Check, time: "just now" },
      { text: "Added Heat Waves to queue", icon: Plus, time: "just now" },
    ]

    let index = 0
    const interval = setInterval(() => {
      setAnimatingIndex(0)
      setCommands((prev) => {
        const updated = [newCommands[index % newCommands.length], ...prev.slice(0, 3)]
        return updated
      })
      index++
      setTimeout(() => setAnimatingIndex(-1), 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-[0_0_30px_-5px_rgba(29,185,84,0.1)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Voice Commands</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] text-primary font-medium">Active</span>
        </div>
      </div>

      {/* Command list */}
      <div className="flex flex-col">
        {commands.map((cmd, i) => {
          const Icon = cmd.icon
          return (
            <div
              key={`${cmd.text}-${i}`}
              className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-b-0 transition-all duration-300 ${
                i === animatingIndex
                  ? "bg-primary/10 translate-x-0"
                  : "bg-transparent"
              }`}
            >
              <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground truncate">{cmd.text}</p>
                <p className="text-[10px] text-muted-foreground">{cmd.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
