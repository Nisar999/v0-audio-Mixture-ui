import cv2
import numpy as np
import time
import mediapipe as mp
import gesture
import events
import spotify

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

# Cooldown mechanics to prevent spamming Spotify API
last_gesture = None
last_action_time = 0
COOLDOWN_SECONDS = 2.0

def handle_spotify_action(action_name):
    if action_name == "play_pause":
        spotify.pause_playback()
    elif action_name == "next":
        spotify.next_track()
    elif action_name == "previous":
        spotify.previous_track()
    elif action_name == "volume_down":
        spotify.set_volume_down()
    # 'Like' functionality is complex in Spotify API without full scopes, so we just log it as an event for now

def generate_frames():
    global last_gesture, last_action_time
    
    while True:
        success, frame = cap.read()
        
        if not success:
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(frame, 'Simulated Camera Feed', (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            time.sleep(0.1)
        else:
            # Process Frame for AI tracking
            frame = cv2.flip(frame, 1) # Mirror image for user-friendliness
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb_frame)
            
            if results.multi_hand_landmarks and results.multi_handedness:
                for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                    handedness = results.multi_handedness[idx].classification[0].label
                    mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                    
                    detected_gesture = gesture.detect_gesture(hand_landmarks, handedness)
                    current_time = time.time()
                    
                    if detected_gesture:
                        # Draw gesture text on screen
                        cv2.putText(frame, detected_gesture.upper(), (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                        
                        # Process action ONLY if the physical gesture has changed state
                        if detected_gesture != last_gesture:
                            if (current_time - last_action_time) > COOLDOWN_SECONDS:
                                system_action = gesture.process_gesture(detected_gesture)
                                action_name = system_action["action"]
                                
                                if action_name != "none":
                                    # 1. Trigger Spotify
                                    handle_spotify_action(action_name)
                                    # 2. Push event to dashboard
                                    events.add_event(detected_gesture, action_name)
                                    
                                    last_action_time = current_time
                                    
                            # Always update the tracking state so holding a fist doesn't spam the API
                            last_gesture = detected_gesture
                    else:
                        # If hand returns to open palm/unrecognized, reset the gesture lock
                        last_gesture = None

        # Encode and stream frame
        ret, buffer = cv2.imencode('.jpg', frame)
        if ret:
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' +
                   frame_bytes +
                   b'\r\n')
                   
        # CRITICAL: Yield to the event loop so FastAPI doesn't freeze
        time.sleep(0.03)