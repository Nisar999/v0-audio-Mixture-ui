import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

# Configure SpotifyOAuth with token persistence
auth_manager = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-modify-playback-state user-read-playback-state",
    cache_path=".spotify_token_cache"  # Persistent token storage
)

sp = spotipy.Spotify(auth_manager=auth_manager)


def get_auth_url():
    """Get the authorization URL for Spotify OAuth flow"""
    return auth_manager.get_authorize_url()


def handle_callback(code):
    """Handle OAuth callback and exchange code for tokens"""
    token_info = auth_manager.get_access_token(code)
    return token_info


def refresh_token_if_needed():
    """Check if token needs refresh and refresh if necessary"""
    token_info = auth_manager.get_cached_token()
    if token_info and auth_manager.is_token_expired(token_info):
        token_info = auth_manager.refresh_access_token(token_info['refresh_token'])
    return token_info

def play_song(song_name):
    """Play a song by name, with automatic token refresh"""
    try:
        # Refresh token if needed
        refresh_token_if_needed()
        
        results = sp.search(q=song_name, type="track", limit=1)

        if results['tracks']['items']:
            uri = results['tracks']['items'][0]['uri']
            sp.start_playback(uris=[uri])
            return {"status": "playing", "song": song_name}

        return {"error": "not found"}
    except Exception as e:
        return {"error": f"Failed to play song: {str(e)}"}


def add_to_queue(song_name):
    """Add a song to queue by name, with automatic token refresh"""
    try:
        # Refresh token if needed
        refresh_token_if_needed()
        
        results = sp.search(q=song_name, type="track", limit=1)

        if results['tracks']['items']:
            uri = results['tracks']['items'][0]['uri']
            sp.add_to_queue(uri)
            return {"status": "queued"}

        return {"error": "not found"}
    except Exception as e:
        return {"error": f"Failed to add to queue: {str(e)}"}

def pause_playback():
    try:
        refresh_token_if_needed()
        current = sp.current_playback()
        if current and current['is_playing']:
            sp.pause_playback()
            return {"status": "paused"}
        elif current:
            sp.start_playback()
            return {"status": "playing"}
        return {"error": "no active device"}
    except Exception as e:
        return {"error": str(e)}

def next_track():
    try:
        refresh_token_if_needed()
        sp.next_track()
        return {"status": "next_track"}
    except Exception as e:
        return {"error": str(e)}

def previous_track():
    try:
        refresh_token_if_needed()
        sp.previous_track()
        return {"status": "previous_track"}
    except Exception as e:
        return {"error": str(e)}

def set_volume_down():
    try:
        refresh_token_if_needed()
        current = sp.current_playback()
        if current and current.get('device'):
            vol = max(0, current['device']['volume_percent'] - 10)
            sp.volume(vol)
            return {"status": f"volume_{vol}"}
        return {"error": "no active device"}
    except Exception as e:
        return {"error": str(e)}