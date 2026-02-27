def process_voice(command):

    if "play" in command:

        song = command.replace("play", "")

        return {"action": "play", "song": song}

    if "queue" in command:

        song = command.replace("queue", "")

        return {"action": "queue", "song": song}

    return {"action": "none"}