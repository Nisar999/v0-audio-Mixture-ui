"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Hand, Mic } from "lucide-react"

const GESTURES = [
  "Next Track",
  "Volume Up",
  "Play/Pause",
  "Previous Track",
  "Volume Down",
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
      }, 200)
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
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-bold text-foreground">Gesture Camera</span>
      </div>

      {/* Video / Placeholder */}
      <div className="relative flex-1 min-h-0 mx-4 mb-3 rounded-md overflow-hidden bg-secondary">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Hand className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Camera feed not active</p>
            <button
              onClick={startCamera}
              className="px-8 py-3 text-sm font-bold rounded-full bg-primary text-primary-foreground hover:bg-[#1ed760] transition-colors"
            >
              Enable Camera
            </button>
          </div>
        )}

        {/* Gesture detected pill */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/90 transition-all duration-200 ${
            gestureVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <Hand className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{currentGesture}</span>
        </div>
      </div>

      {/* Bottom wake word bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-border">
        <Mic className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground">
          {'Wake word: '}<span className="text-foreground font-medium">{'"Aura"'}</span>
        </span>
      </div>
    </div>
  )
}
