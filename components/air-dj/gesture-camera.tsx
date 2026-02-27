"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, Hand, Mic } from "lucide-react"
import { api } from "@/lib/api"

const GESTURES = [
  "Next Track",
  "Volume Up",
  "Play/Pause",
  "Previous Track",
  "Volume Down",
]

export function GestureCamera() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [currentGesture, setCurrentGesture] = useState(GESTURES[0])
  const [gestureVisible, setGestureVisible] = useState(true)
  const [backendConnected, setBackendConnected] = useState(false)

  useEffect(() => {
    // Check backend connection
    api.checkBackendStatus().then(result => {
      setBackendConnected(!result.error);
    });

    const interval = setInterval(() => {
      setGestureVisible(false)
      setTimeout(() => {
        setCurrentGesture(GESTURES[Math.floor(Math.random() * GESTURES.length)])
        setGestureVisible(true)
      }, 200)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const startCamera = () => {
    if (backendConnected) {
      setCameraActive(true)
    } else {
      alert('Backend not connected. Please ensure the backend is running on http://127.0.0.1:8000')
    }
  }

  const handleGestureClick = async (gesture: string) => {
    if (backendConnected) {
      const result = await api.sendGesture(gesture.toLowerCase().replace(' ', '_'));
      console.log('Gesture result:', result);
    }
  }

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-bold text-foreground">Gesture Camera</span>
        <div className={`ml-auto w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}
          title={backendConnected ? 'Backend Connected' : 'Backend Disconnected'} />
      </div>

      {/* Video / Placeholder */}
      <div className="relative flex-1 min-h-0 mx-4 mb-3 rounded-md overflow-hidden bg-secondary">
        {cameraActive ? (
          <img
            ref={imgRef}
            src={api.getVideoFeedUrl()}
            className="w-full h-full object-cover"
            alt="Camera feed"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Hand className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {backendConnected ? 'Camera feed not active' : 'Backend not connected'}
            </p>
            <button
              onClick={startCamera}
              disabled={!backendConnected}
              className={`px-8 py-3 text-sm font-bold rounded-full transition-colors ${backendConnected
                ? 'bg-primary text-primary-foreground hover:bg-[#1ed760]'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
            >
              Enable Camera
            </button>
          </div>
        )}

        {/* Gesture detected pill */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/90 transition-all duration-200 cursor-pointer hover:bg-secondary ${gestureVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
            }`}
          onClick={() => handleGestureClick(currentGesture)}
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
