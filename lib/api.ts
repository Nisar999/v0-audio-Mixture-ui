// Backend API configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// API functions for backend communication
export const api = {
  // Spotify controls
  async playSong(song: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/play?song=${encodeURIComponent(song)}`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable - play song:', (error as Error).message);
      return { error: 'Failed to play song' };
    }
  },

  async addToQueue(song: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/queue?song=${encodeURIComponent(song)}`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable - add to queue:', (error as Error).message);
      return { error: 'Failed to add to queue' };
    }
  },

  // Voice commands
  async sendVoiceCommand(command: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/voice?command=${encodeURIComponent(command)}`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable - voice command:', (error as Error).message);
      return { error: 'Failed to send voice command' };
    }
  },

  // Gesture commands
  async sendGesture(gesture: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/gesture?gesture_name=${encodeURIComponent(gesture)}`, {
        method: 'POST',
      });
      return await response.json();
    } catch (error) {
      console.warn('Backend unavailable - gesture:', (error as Error).message);
      return { error: 'Failed to send gesture' };
    }
  },

  // Get video feed URL
  getVideoFeedUrl() {
    return `${API_BASE_URL}/video_feed`;
  },

  // Get live AI event stream
  async pollEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      return await response.json();
    } catch {
      return { events: [] };
    }
  },

  // Get current real Spotify playback
  async getCurrentPlayback() {
    try {
      const response = await fetch(`${API_BASE_URL}/current_playback`);
      return await response.json();
    } catch {
      return { status: "none", is_playing: false };
    }
  },


  // Check backend status
  async checkBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return await response.json();
    } catch {
      return { error: 'Backend not available' };
    }
  }
};
