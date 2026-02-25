"use client"

import { useState, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
} from "lucide-react"
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
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

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
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">
      {/* Album art */}
      <div className="relative aspect-square w-full overflow-hidden p-4 pb-0">
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <Image
            src="/images/album-cover.jpg"
            alt={`${currentTrack.title} album cover`}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Track info */}
      <div className="px-4 pt-4 pb-1">
        <h3 className="text-base font-bold text-foreground truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-1">
        <div
          className="relative h-1 w-full rounded-full bg-border overflow-hidden cursor-pointer group"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-foreground group-hover:bg-primary transition-colors duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-muted-foreground font-medium">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 px-4 py-2">
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-1.5 transition-colors ${shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          aria-label="Toggle shuffle"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            setCurrentTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)
            setProgress(0)
          }}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous track"
        >
          <SkipBack className="h-5 w-5 fill-current" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>
        <button
          onClick={() => {
            setCurrentTrackIndex((i) => (i + 1) % TRACKS.length)
            setProgress(0)
          }}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next track"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
        <button
          onClick={() => setRepeat(!repeat)}
          className={`p-1.5 transition-colors ${repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          aria-label="Toggle repeat"
        >
          <Repeat className="h-4 w-4" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-4 pb-4 pt-1">
        <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div
          className="relative h-1 w-full rounded-full bg-border overflow-hidden cursor-pointer group"
          role="slider"
          aria-valuenow={volume}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Volume"
        >
          <div
            className="h-full rounded-full bg-foreground group-hover:bg-primary transition-colors duration-200"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  )
}
