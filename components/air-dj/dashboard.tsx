"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "./navbar"
import { GestureCamera } from "./gesture-camera"
import { MusicPlayer } from "./music-player"
import { QueuePlaylist } from "./queue-playlist"
import { VoiceFeedback } from "./voice-feedback"
import { api } from "@/lib/api"

interface SpotifyAuraDashboardProps {
  isEntering?: boolean
}

// Ensure TypeScript knows about SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function SpotifyAuraDashboard({ isEntering = false }: SpotifyAuraDashboardProps) {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase().trim();

        console.log("Heard:", transcript);

        // Wake word detection
        if (transcript.includes("aura")) {
          // Extract the full command spoken after "Aura"
          const parts = transcript.split("aura");
          const command = parts[parts.length - 1].trim();

          if (command) {
            api.sendVoiceCommand(command);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.log("Speech recognition error", event.error);
        try {
          // Restart immediately on no-speech errors
          if (event.error === 'no-speech' || event.error === 'network') {
            recognition.stop();
            setTimeout(() => recognition.start(), 100);
          }
        } catch (e) { }
      };

      recognition.onend = () => {
        // Auto-restart to keep listening infinitely
        try {
          recognition.start();
        } catch (e) { }
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        console.error("Microphone access denied or already started", error);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div
      className={`flex flex-col h-screen bg-background overflow-hidden transition-all duration-700 ease-out ${isEntering ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0"
        }`}
    >
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
