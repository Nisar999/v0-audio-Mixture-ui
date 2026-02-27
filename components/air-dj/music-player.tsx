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
import { api } from "@/lib/api"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)

  // Real tracker states
  const [title, setTitle] = useState("No track playing")
  const [artist, setArtist] = useState("Unknown Artist")
  const [albumArt, setAlbumArt] = useState("/images/album-cover.jpg")
  const [hasActiveDevice, setHasActiveDevice] = useState(false)

  useEffect(() => {
    // Check backend connection
    api.checkBackendStatus().then(result => {
      setBackendConnected(!result.error);
    });

    const fetchPlayback = async () => {
      const data = await api.getCurrentPlayback();
      if (data && data.status === "active") {
        setHasActiveDevice(true);
        setIsPlaying(data.is_playing);
        setTitle(data.title);
        setArtist(data.artist);
        setProgress(data.progress_ms);
        setDuration(data.duration_ms);
        setVolume(data.device_volume);
        if (data.album_art) {
          setAlbumArt(data.album_art);
        }
      } else {
        setHasActiveDevice(false);
        setIsPlaying(false);
      }
    };

    fetchPlayback();
    const interval = setInterval(fetchPlayback, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  const handlePlay = async () => {
    if (backendConnected) {
      setIsPlaying(!isPlaying); // Optimistic UI
      await api.sendVoiceCommand(isPlaying ? "pause" : "play");
    }
  }

  const handleNext = async () => {
    if (backendConnected) {
      await api.sendVoiceCommand("skip");
    }
  }

  const handlePrevious = async () => {
    if (backendConnected) {
      // Send physical gesture string mapped to previous
      await api.sendGesture("swipe_left");
    }
  }

  const handleAddToQueue = async () => {
    if (backendConnected) {
      await api.addToQueue(title);
    }
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex flex-col rounded-lg bg-card overflow-hidden">
      {/* Album art */}
      <div className="w-full px-4 pt-4">
        <div className="relative w-full rounded-md overflow-hidden aspect-square">
          <Image
            src={albumArt}
            alt={`${title} album cover`}
            fill
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>

      {/* Track info */}
      <div className="px-4 pt-4 pb-1">
        <h3 className="text-base font-bold text-foreground truncate">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-muted-foreground">
            {backendConnected ? (hasActiveDevice ? 'Spotify Connected' : 'No Active Spotify Device') : 'Backend Disconnected'}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-1">
        <div
          className="relative h-1 w-full rounded-full bg-border overflow-hidden group"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-foreground transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">{formatTime(progress)}</span>
          <span className="text-[11px] text-muted-foreground font-medium">{formatTime(duration)}</span>
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
          disabled={!backendConnected || !hasActiveDevice}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${backendConnected && hasActiveDevice
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
          className="relative h-1 w-full rounded-full bg-border overflow-hidden group"
          role="slider"
        >
          <div
            className="h-full rounded-full bg-foreground group-hover:bg-primary transition-all duration-500"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  )
}
