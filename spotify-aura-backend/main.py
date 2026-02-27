from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

import spotify
import camera
import voice
import gesture
import events

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")

def root():
    return {"status": "Spotify Aura Backend Running"}


@app.get("/video_feed")

def video_feed():

    return StreamingResponse(
        camera.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@app.get("/events")
def get_live_events():
    """Returns real-time AI gestures and voice commands to the frontend dashboard"""
    return {"events": events.get_events()}

@app.get("/current_playback")
def current_playback():
    """Returns the user's real-time Spotify playing state for the UI Player"""
    return spotify.get_current_playback()


@app.post("/play")

def play(song: str):
    """Play a song with proper authentication error handling"""
    try:
        result = spotify.play_song(song)
        if "error" in result:
            if "authentication" in result["error"].lower() or "token" in result["error"].lower():
                raise HTTPException(status_code=401, detail="Authentication required. Please login first at /login")
            elif "not found" in result["error"]:
                raise HTTPException(status_code=404, detail=f"Song '{song}' not found")
            else:
                raise HTTPException(status_code=500, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to play song: {str(e)}")


@app.post("/queue")

def queue(song: str):
    """Add song to queue with proper authentication error handling"""
    try:
        result = spotify.add_to_queue(song)
        if "error" in result:
            if "authentication" in result["error"].lower() or "token" in result["error"].lower():
                raise HTTPException(status_code=401, detail="Authentication required. Please login first at /login")
            elif "not found" in result["error"]:
                raise HTTPException(status_code=404, detail=f"Song '{song}' not found")
            else:
                raise HTTPException(status_code=500, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add song to queue: {str(e)}")


@app.post("/voice")

def voice_command(command: str):
    """Process voice commands with proper authentication error handling"""
    try:
        result = voice.process_voice(command)

        if result["action"] == "play":
            play_result = spotify.play_song(result["song"])
            if "error" in play_result:
                if "authentication" in play_result["error"].lower() or "token" in play_result["error"].lower():
                    raise HTTPException(status_code=401, detail="Authentication required. Please login first at /login")
                elif "not found" in play_result["error"]:
                    raise HTTPException(status_code=404, detail=f"Song '{result['song']}' not found")
                else:
                    raise HTTPException(status_code=500, detail=play_result["error"])
            
            events.add_event("voice_play", result["song"].strip())
            return play_result

        if result["action"] == "queue":
            queue_result = spotify.add_to_queue(result["song"])
            if "error" in queue_result:
                if "authentication" in queue_result["error"].lower() or "token" in queue_result["error"].lower():
                    raise HTTPException(status_code=401, detail="Authentication required. Please login first at /login")
                elif "not found" in queue_result["error"]:
                    raise HTTPException(status_code=404, detail=f"Song '{result['song']}' not found")
                else:
                    raise HTTPException(status_code=500, detail=queue_result["error"])
            
            events.add_event("voice_queue", result["song"].strip())
            return queue_result

        # Handle simple system commands
        if result["action"] in ["pause", "stop"]:
            spotify.pause_playback()
            events.add_event("voice_pause", "Playback Paused")
            return {"status": "paused"}
            
        if result["action"] == "skip":
            spotify.next_track()
            events.add_event("voice_skip", "Skipped Track")
            return {"status": "skipped"}
            
        if result["action"] == "previous":
            spotify.previous_track()
            events.add_event("voice_previous", "Previous Track")
            return {"status": "previous"}
            
        if result["action"] == "volume_down":
            spotify.set_volume_down()
            events.add_event("voice_volume", "Volume Decreased")
            return {"status": "volume_down"}
            
        if result["action"] == "volume_up":
            spotify.set_volume_up()
            events.add_event("voice_volume", "Volume Increased")
            return {"status": "volume_up"}

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process voice command: {str(e)}")


@app.post("/gesture")

def gesture_command(gesture_name: str):

    return gesture.process_gesture(gesture_name)