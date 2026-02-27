import math
from collections import deque
import time

# Keep track of the wrist's X-coordinate history for swipe detection
wrist_history = {
    "Left": deque(maxlen=10),
    "Right": deque(maxlen=10)
}
last_swipe_time = 0

def calculate_distance(p1, p2):
    """Calculate Euclidean distance between two landmarks (with x, y attributes)"""
    return math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)

def detect_gesture(hand_landmarks, handedness="Right"):
    """
    Analyzes MediaPipe hand landmarks and returns a detected gesture string.
    Returns: 'fist', 'thumbs_up', 'pinch', 'swipe_left', 'swipe_right', 'open_palm', or None
    """
    global wrist_history, last_swipe_time
    
    lm = hand_landmarks.landmark
    
    # 1. Update wrist history for swipe detection
    current_time = time.time()
    wrist_x = lm[0].x
    
    history = wrist_history.get(handedness, wrist_history["Right"])
    history.append(wrist_x)
    
    # Check for swipe (cooldown of 1.5 seconds)
    if current_time - last_swipe_time > 1.5 and len(history) == history.maxlen:
        start_x = history[0]
        end_x = history[-1]
        delta = end_x - start_x
        
        # Note: x coordinates go from 0 (left) to 1 (right) on the image
        # If the user moves their hand left, delta is negative
        if delta < -0.15: 
            last_swipe_time = current_time
            wrist_history.clear()
            return "swipe_left"
        elif delta > 0.15:
            last_swipe_time = current_time
            wrist_history.clear()
            return "swipe_right"

    def is_finger_extended(tip_idx, pip_idx):
        return calculate_distance(lm[tip_idx], lm[0]) > calculate_distance(lm[pip_idx], lm[0])

    index_ext = is_finger_extended(8, 6)
    middle_ext = is_finger_extended(12, 10)
    ring_ext = is_finger_extended(16, 14)
    pinky_ext = is_finger_extended(20, 18)
    
    # Thumb relies on x-coords relative to hand direction, but distance to wrist vs IP works well enough
    thumb_ext = calculate_distance(lm[4], lm[0]) > calculate_distance(lm[3], lm[0])
    
    raw_gesture = None
    
    # 2. Check for Fist (all fingers folded)
    if not index_ext and not middle_ext and not ring_ext and not pinky_ext and not thumb_ext:
        raw_gesture = "fist"
            
    # 3. Check for Thumbs Up (only thumb extended)
    elif thumb_ext and not index_ext and not middle_ext and not ring_ext and not pinky_ext:
        raw_gesture = "thumbs_up"
        
    # 4. Check for Pinch
    pinch_distance = calculate_distance(lm[4], lm[8])
    if pinch_distance < 0.05 and not index_ext and not middle_ext: 
        pass
        
    if pinch_distance < 0.10 and middle_ext and ring_ext and pinky_ext:
        raw_gesture = "pinch"

    # 5. Check for Open Palm (all fingers extended)
    elif index_ext and middle_ext and ring_ext and pinky_ext and thumb_ext:
        raw_gesture = "open_palm"

    return raw_gesture


def process_gesture(gesture_name):
    """Maps the detected physical gesture to a system action"""
    action_map = {
        "fist": "play_pause",
        "swipe_left": "previous",
        "swipe_right": "next",
        "thumbs_up": "like",
        "pinch": "volume_down"
    }
    
    action = action_map.get(gesture_name, "none")
    return {"action": action, "gesture": gesture_name}