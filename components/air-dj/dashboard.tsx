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

      <main className="flex-1 flex flex-col lg:flex-row gap-2 p-2 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* Left column - Camera feed (65%) */}
        <section className="lg:w-[65%] flex-shrink-0 min-h-[400px] lg:min-h-0 lg:h-full">
          <GestureCamera />
        </section>

        {/* Right column - Player + Queue + Voice (35%) */}
        <aside className="lg:w-[35%] flex flex-col gap-2 min-h-0 lg:overflow-y-auto pb-4 lg:pb-0 scrollbar-thin">
          <MusicPlayer />
          <QueuePlaylist />
          <VoiceFeedback />
        </aside>
      </main>
    </div>
  )
}
