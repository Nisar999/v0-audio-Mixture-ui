"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Music, Plus, Check } from "lucide-react"

const INITIAL_COMMANDS = [
  { text: "Playing Blinding Lights", icon: Music, time: "just now" },
  { text: "Added Levitating to queue", icon: Plus, time: "2s ago" },
  { text: "Volume set to 80%", icon: Check, time: "5s ago" },
  { text: "Skipped to next track", icon: Check, time: "12s ago" },
]

const NEW_COMMANDS = [
  { text: "Playing Levitating", icon: Music, time: "just now" },
  { text: "Shuffling playlist", icon: Check, time: "just now" },
  { text: "Volume decreased to 60%", icon: Check, time: "just now" },
  { text: "Added Heat Waves to queue", icon: Plus, time: "just now" },
]

export function VoiceFeedback() {
  const [commands, setCommands] = useState(INITIAL_COMMANDS)
  const [newIndex, setNewIndex] = useState(-1)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setNewIndex(0)
      setCommands((prev) => {
        const cmd = NEW_COMMANDS[index % NEW_COMMANDS.length]
        return [cmd, ...prev.slice(0, 3)]
      })
      index++
      setTimeout(() => setNewIndex(-1), 400)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Voice Commands</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </div>

      {/* Command list */}
      <div className="flex flex-col pb-2">
        {commands.map((cmd, i) => {
          const Icon = cmd.icon
          return (
            <div
              key={`${cmd.text}-${i}`}
              className={`flex items-center gap-3 px-5 py-2.5 transition-all duration-200 ${
                i === newIndex ? "bg-secondary" : ""
              }`}
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{cmd.text}</p>
                <p className="text-xs text-muted-foreground">{cmd.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
