"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Music, Plus, Check, Hand, Volume2, SkipForward, Pause } from "lucide-react"

import { api } from "@/lib/api"

type FeedbackEntry = {
  text: string
  icon: typeof MessageSquare
  time: string
  type: "voice" | "gesture"
}

// Helper to map text to icons
function getIconForText(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('play') || lower.includes('music')) return Music
  if (lower.includes('pause')) return Pause
  if (lower.includes('next') || lower.includes('previous') || lower.includes('skip') || lower.includes('swipe')) return SkipForward
  if (lower.includes('queue')) return Plus
  if (lower.includes('volume')) return Volume2
  if (lower.includes('like')) return Check
  return MessageSquare
}

export function VoiceFeedback() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([])
  const [newIndex, setNewIndex] = useState(-1)
  const [filter, setFilter] = useState<"all" | "gesture" | "voice">("all")

  useEffect(() => {
    const pollBackend = async () => {
      try {
        const result = await api.pollEvents();
        if (result && result.events && result.events.length > 0) {

          const newFormattedEvents = result.events.map((ev: any) => ({
            text: ev.text,
            icon: getIconForText(ev.text),
            time: ev.time,
            type: ev.type as "voice" | "gesture"
          }));

          setEntries(prev => {
            // Check if there's actually a new event pushed to avoid unnecessary re-renders
            if (prev.length > 0 && newFormattedEvents[0] && prev[0].text === newFormattedEvents[0].text && prev[0].type === newFormattedEvents[0].type) {
              return prev;
            }

            // If the latest event changed, animate the flash
            if (newFormattedEvents.length > 0) {
              setNewIndex(0);
              setTimeout(() => setNewIndex(-1), 1000);
            }

            // Combine new events with previous unique ones
            const combined = [...newFormattedEvents, ...prev];
            // Filter unique
            const unique = Array.from(new Set(combined.map(a => a.text)))
              .map(text => {
                return combined.find(a => a.text === text)
              })

            return (unique as FeedbackEntry[]).slice(0, 8);
          });
        }
      } catch (err) {
        console.warn("Could not fetch events");
      }
    };

    const interval = setInterval(pollBackend, 1500)
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
              className={`flex items-center gap-3 px-5 py-2.5 transition-all duration-300 ${i === newIndex ? "bg-secondary" : ""
                }`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${entry.type === "gesture"
                    ? "bg-primary/15"
                    : "bg-secondary"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 ${entry.type === "gesture"
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
                    className={`text-[10px] font-medium uppercase tracking-wide ${entry.type === "gesture" ? "text-primary" : "text-muted-foreground"
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
