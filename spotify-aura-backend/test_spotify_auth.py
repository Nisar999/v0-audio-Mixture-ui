import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

try:
    auth_manager = SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="user-modify-playback-state user-read-playback-state",
        cache_path=".spotify_token_cache"
    )
    
    sp = spotipy.Spotify(auth_manager=auth_manager)
    
    # Try to get current user to verify token
    user = sp.current_user()
    print(f"SUCCESS: Logged in as: {user.get('display_name', 'Unknown')}")
    
    # Try to get current playback
    playback = sp.current_playback()
    if playback and playback.get('item'):
        print(f"PLAYBACK: Currently playing {playback['item']['name']}")
    else:
        print("PLAYBACK: Nothing is currently playing")

except Exception as e:
    print(f"ERROR: {str(e)}")
