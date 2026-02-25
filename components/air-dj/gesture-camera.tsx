"use client"

import { useState, useEffect, useRef } from "react"
import { Video, Hand, Mic } from "lucide-react"

const GESTURES = [
  { label: "Volume Up", icon: "🔊" },
  { label: "Volume Down", icon: "🔉" },
  { label: "Speed Control", icon: "⚡" },
  { label: "Next Track", icon: "⏭" },
  { label: "Play/Pause", icon: "⏯" },
]

export function GestureCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [currentGesture, setCurrentGesture] = useState(GESTURES[0])
  const [gestureVisible, setGestureVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setGestureVisible(false)
      setTimeout(() => {
        setCurrentGesture(GESTURES[Math.floor(Math.random() * GESTURES.length)])
        setGestureVisible(true)
      }, 300)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch {
      // Camera not available
    }
  }

  return (
    <div className="relative flex flex-col h-full rounded-xl overflow-hidden border border-border bg-card shadow-[0_0_30px_-5px_rgba(29,185,84,0.1)]">
      {/* Header label */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/60">
        <Video className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-foreground">Gesture Camera Feed</span>
      </div>

      {/* Video / Placeholder */}
      <div className="relative flex-1 min-h-0 bg-background/50">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                <Hand className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
            </div>
            <p className="text-sm text-muted-foreground">Camera feed not active</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_rgba(29,185,84,0.4)]"
            >
              Enable Camera
            </button>
          </div>
        )}

        {/* Gesture overlays */}
        <div
          className={`absolute top-16 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 border border-primary/30 backdrop-blur-sm transition-all duration-300 ${
            gestureVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <Hand className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            Gesture detected: {currentGesture.label}
          </span>
        </div>

        {/* Animated scan lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-0 right-0 h-px bg-primary/30"
            style={{
              animation: "scan 4s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Bottom wake word bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card/90 backdrop-blur-sm border-t border-border/60">
        <div className="relative">
          <Mic className="h-5 w-5 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
        <span className="text-sm text-muted-foreground">
          {'Wake word: '}<span className="text-foreground font-medium">{'"Hey Air DJ"'}</span>
        </span>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}
