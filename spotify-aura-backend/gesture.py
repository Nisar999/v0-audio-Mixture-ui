import math
from collections import deque
import time

# Keep track of the wrist's X-coordinate history for swipe detection
wrist_history = deque(maxlen=10)
last_swipe_time = 0

def calculate_distance(p1, p2):
    """Calculate Euclidean distance between two landmarks (with x, y attributes)"""
    return math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)

def detect_gesture(hand_landmarks):
    """
    Analyzes MediaPipe hand landmarks and returns a detected gesture string.
    Returns: 'fist', 'thumbs_up', 'pinch', 'swipe_left', 'swipe_right', 'open_palm', or None
    """
    global wrist_history, last_swipe_time
    
    # MediaPipe landmarks map (0-20)
    # 0: WRIST, 4: THUMB_TIP, 8: INDEX_FINGER_TIP, 12: MIDDLE_FINGER_TIP
    # 16: RING_FINGER_TIP, 20: PINKY_TIP
    # 5, 9, 13, 17 are the MCP joints (knuckles at the base of the fingers)
    
    lm = hand_landmarks.landmark
    
    # 1. Update wrist history for swipe detection
    current_time = time.time()
    wrist_x = lm[0].x
    wrist_history.append(wrist_x)
    
    # Check for swipe (cooldown of 1.5 seconds)
    if current_time - last_swipe_time > 1.5 and len(wrist_history) == wrist_history.maxlen:
        start_x = wrist_history[0]
        end_x = wrist_history[-1]
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

    # For static gestures, we define "folded" if the tip's Y is lower down the screen (higher Y value) than the MCP joint
    # Note: Y goes from 0 (top) to 1 (bottom)
    index_folded = lm[8].y > lm[5].y
    middle_folded = lm[12].y > lm[9].y
    ring_folded = lm[16].y > lm[13].y
    pinky_folded = lm[20].y > lm[17].y
    
    thumb_straight_up = lm[4].y < lm[3].y < lm[2].y
    
    # 2. Check for Fist 
    if index_folded and middle_folded and ring_folded and pinky_folded:
        if not thumb_straight_up: # If thumb is up, it's a thumbs up, not a fist
            return "fist"
            
    # 3. Check for Thumbs Up
    if thumb_straight_up and index_folded and middle_folded and ring_folded and pinky_folded:
        return "thumbs_up"
        
    # 4. Check for Pinch (Thumb and Index tips are close together)
    pinch_distance = calculate_distance(lm[4], lm[8])
    if pinch_distance < 0.05:
        # Ensure other fingers are relatively open or not strictly important, but let's just trigger on pinch_distance
        return "pinch"
        
    # 5. Check for Open Palm (all fingers extended up)
    if not index_folded and not middle_folded and not ring_folded and not pinky_folded:
        return "open_palm"

    return None

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