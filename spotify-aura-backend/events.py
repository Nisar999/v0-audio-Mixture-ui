import datetime

event_queue = []

def add_event(gesture_name, action_name):
    """
    Adds a formatted event to the global queue for the frontend to poll.
    """
    global event_queue
    
    # Map gesture names to UI friendly text
    text_map = {
        "fist": "Fist -- Play/Pause",
        "thumbs_up": "Thumbs Up -- Like",
        "swipe_left": "Swipe Left -- Previous",
        "swipe_right": "Swipe Right -- Next",
        "pinch": "Pinch -- Volume Down",
        "open_palm": "Open Palm -- Volume Up",
        "voice_play": f"Playing {action_name}",
        "voice_queue": f"Added {action_name} to queue"
    }
    
    text = text_map.get(gesture_name, f"{gesture_name} detected")
    
    event_type = "voice" if "voice" in gesture_name else "gesture"
        
    event = {
        "text": text,
        "type": event_type,
        "time": "just now"
    }
    
    event_queue.insert(0, event) # Newest at the top
    
    # Keep queue small to prevent memory leaks
    if len(event_queue) > 10:
        event_queue.pop()

def get_events():
    """Returns and clears the event queue for long polling"""
    global event_queue
    current_events = event_queue.copy()
    event_queue.clear()
    return current_events
