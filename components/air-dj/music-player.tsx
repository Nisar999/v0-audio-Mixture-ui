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
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import { api } from "@/lib/api"

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
  const [backendConnected, setBackendConnected] = useState(false)

  const currentTrack = TRACKS[currentTrackIndex]

  useEffect(() => {
    // Check backend connection
    api.checkBackendStatus().then(result => {
      setBackendConnected(!result.error);
    });
  }, []);

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

  const handlePlay = async () => {
    if (backendConnected) {
      const result = await api.playSong(currentTrack.title);
      console.log('Play result:', result);
      if (!result.error) {
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  }

  const handleNext = async () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);

    if (backendConnected) {
      const result = await api.playSong(TRACKS[nextIndex].title);
      console.log('Next track result:', result);
    }
  }

  const handlePrevious = async () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);

    if (backendConnected) {
      const result = await api.playSong(TRACKS[prevIndex].title);
      console.log('Previous track result:', result);
    }
  }

  const handleAddToQueue = async () => {
    if (backendConnected) {
      const result = await api.addToQueue(currentTrack.title);
      console.log('Queue result:', result);
    }
  }

  return (
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">


      {/* Album art */}
      <div className="w-full px-4 pt-4">
        <div className="relative w-full rounded-md overflow-hidden">
          <Image
            src="/images/album-cover.jpg"
            alt={`${currentTrack.title} album cover`}
            width={400}
            height={400}
            priority
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>

      {/* Track info */}
      <div className="px-4 pt-4 pb-1">
        <h3 className="text-base font-bold text-foreground truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-muted-foreground">
            {backendConnected ? 'Backend Connected' : 'Backend Disconnected'}
          </span>
        </div>
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
          onClick={handlePrevious}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous track"
        >
          <SkipBack className="h-5 w-5 fill-current" />
        </button>
        <button
          onClick={handlePlay}
          className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition-transform"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>
        <button
          onClick={handleNext}
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

      {/* Queue button */}
      <div className="px-4 pb-2">
        <button
          onClick={handleAddToQueue}
          disabled={!backendConnected}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${backendConnected
            ? 'bg-secondary hover:bg-secondary/80 text-foreground'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
        >
          Add to Queue
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
