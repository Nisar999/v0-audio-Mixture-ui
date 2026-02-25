"use client"

import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import Image from "next/image"

const TRACKS = [
  { title: "Blinding Lights", artist: "The Weeknd", duration: 200 },
  { title: "Levitating", artist: "Dua Lipa", duration: 203 },
  { title: "Stay", artist: "The Kid LAROI, Justin Bieber", duration: 141 },
  { title: "Heat Waves", artist: "Glass Animals", duration: 238 },
  { title: "As It Was", artist: "Harry Styles", duration: 167 },
]

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [progress, setProgress] = useState(42)
  const [volume, setVolume] = useState(75)

  const currentTrack = TRACKS[currentTrackIndex]

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentTrackIndex((i) => (i + 1) % TRACKS.length)
          return 0
        }
        return p + 0.5
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const currentTime = (progress / 100) * currentTrack.duration

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-[0_0_30px_-5px_rgba(29,185,84,0.1)]">
      {/* Album art */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src="/images/album-cover.jpg"
          alt={`${currentTrack.title} album cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Now playing badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-medium text-primary uppercase tracking-wider">Now Playing</span>
        </div>
      </div>

      {/* Track info */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-base font-semibold text-foreground truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="relative h-1 w-full rounded-full bg-secondary overflow-hidden group cursor-pointer">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_6px_rgba(29,185,84,0.6)]" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-muted-foreground">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 pb-3">
        <button
          onClick={() => setCurrentTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous track"
        >
          <SkipBack className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-[0_0_20px_-3px_rgba(29,185,84,0.5)]"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setCurrentTrackIndex((i) => (i + 1) % TRACKS.length)
            setProgress(0)
          }}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next track"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="relative h-1 w-full rounded-full bg-secondary overflow-hidden cursor-pointer group">
          <div
            className="h-full rounded-full bg-primary/60 transition-all"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  )
}
