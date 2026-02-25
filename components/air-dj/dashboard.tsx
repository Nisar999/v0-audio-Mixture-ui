"use client"

import { Navbar } from "./navbar"
import { GestureCamera } from "./gesture-camera"
import { MusicPlayer } from "./music-player"
import { QueuePlaylist } from "./queue-playlist"
import { VoiceFeedback } from "./voice-feedback"

export function AirDJDashboard() {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Left side - Camera feed (70%) */}
        <section className="lg:w-[70%] flex-shrink-0 min-h-[400px] lg:min-h-0 lg:h-full">
          <GestureCamera />
        </section>

        {/* Right side - Player + Queue + Voice (30%) */}
        <aside className="lg:w-[30%] flex flex-col gap-4 min-h-0 lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-thin">
          <MusicPlayer />
          <QueuePlaylist />
          <VoiceFeedback />
        </aside>
      </main>

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
