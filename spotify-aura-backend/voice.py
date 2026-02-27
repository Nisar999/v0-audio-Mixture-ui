def process_voice(command):
    command = command.lower().strip()
    
    if "play" in command:
        song = command.replace("play", "").strip()
        if not song:
            return {"action": "pause"} # Toggles play/pause
        return {"action": "play", "song": song}

    if "queue" in command:
        song = command.replace("queue", "").strip()
        if song:
            return {"action": "queue", "song": song}

    if "pause" in command or "stop" in command:
        return {"action": "pause"}

    if "skip" in command or "next" in command:
        return {"action": "skip"}
        
    if "previous" in command or "back" in command:
        return {"action": "previous"}

    if "volume" in command and "down" in command:
        return {"action": "volume_down"}

    return {"action": "none"}