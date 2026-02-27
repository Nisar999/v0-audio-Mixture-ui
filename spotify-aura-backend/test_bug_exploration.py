"""
Bug Condition Exploration Test for Spotify Authentication Fix

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8**

This test demonstrates authentication bugs exist on unfixed code.
CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists.
DO NOT attempt to fix the test or code when it fails.
"""

import pytest
from fastapi.testclient import TestClient
from hypothesis import given, strategies as st, settings
import os
import sys
from unittest.mock import patch

# Set environment variables for testing (simulating what should be loaded by dotenv)
os.environ.setdefault('SPOTIFY_CLIENT_ID', 'test_client_id')
os.environ.setdefault('SPOTIFY_CLIENT_SECRET', 'test_client_secret') 
os.environ.setdefault('SPOTIFY_REDIRECT_URI', 'http://localhost:8000/callback')

# Add the backend directory to Python path
sys.path.append('v0-audio-Mixture-ui/spotify-aura-backend')

from main import app

client = TestClient(app)

class TestSpotifyAuthenticationBugs:
    """
    Property-based test that explores authentication bugs on unfixed code.
    Expected to FAIL on unfixed code to confirm bugs exist.
    """
    
    @given(st.text(min_size=1, max_size=50).filter(lambda x: x.isprintable() and not any(c in x for c in '?&=# \t\n\r')))
    @settings(max_examples=10)
    def test_missing_login_endpoint_returns_404(self, random_param):
        """
        Test that /login endpoint is missing and returns 404.
        **Validates: Requirements 1.3**
        """
        # Try to access login endpoint - should fail with 404 on unfixed code
        response = client.get(f"/login?param={random_param}")
        
        # On unfixed code, this should return 404 (endpoint doesn't exist)
        # On fixed code, this should redirect to Spotify auth (3xx status)
        assert response.status_code in [200, 302, 307], f"Login endpoint should work, got {response.status_code}"
    
    @given(st.text(min_size=10, max_size=50).filter(lambda x: x.isprintable() and not any(c in x for c in '?&=# \t\n\r')))
    @settings(max_examples=10)
    def test_missing_callback_endpoint_returns_404(self, auth_code):
        """
        Test that /callback endpoint is missing and returns 404.
        **Validates: Requirements 1.4**
        """
        # Try to access callback endpoint - should fail with 404 on unfixed code
        response = client.get(f"/callback?code={auth_code}")
        
        # On unfixed code, this should return 404 (endpoint doesn't exist)
        # On fixed code, this should handle the callback (2xx or 3xx status)
        assert response.status_code in [200, 302, 307], f"Callback endpoint should work, got {response.status_code}"
    
    def test_environment_variables_not_loaded(self):
        """
        Test that environment variables are not loaded properly on startup.
        **Validates: Requirements 1.2**
        """
        # Import spotify module to check if env vars are loaded
        import spotify
        
        # Check if the SpotifyOAuth was created with None values
        # This happens when python-dotenv is not imported in main.py
        auth_manager = spotify.sp.auth_manager
        
        # On unfixed code, these should be None because dotenv isn't loaded
        # On fixed code, these should have actual values from .env file
        assert auth_manager.client_id is not None, "SPOTIFY_CLIENT_ID should be loaded from environment"
        assert auth_manager.client_secret is not None, "SPOTIFY_CLIENT_SECRET should be loaded from environment"
        assert auth_manager.redirect_uri is not None, "SPOTIFY_REDIRECT_URI should be loaded from environment"
    
    @given(st.text(min_size=1, max_size=100).filter(lambda x: x.strip() and x.isprintable() and not any(c in x for c in '?&=# \t\n\r')))
    @settings(max_examples=5)
    def test_spotify_api_calls_fail_with_auth_errors(self, song_name):
        """
        Test that Spotify API calls fail with authentication errors.
        **Validates: Requirements 1.1, 1.5, 1.6**
        """
        # Try to play a song - should fail with auth error on unfixed code
        response = client.post(f"/play?song={song_name}")
        
        # On unfixed code, this should fail due to authentication issues
        # On fixed code, this should work (200) or return proper error for invalid songs
        assert response.status_code == 200, f"Play endpoint should work with authentication, got {response.status_code}: {response.text}"
        
        # Also test queue endpoint
        response = client.post(f"/queue?song={song_name}")
        assert response.status_code == 200, f"Queue endpoint should work with authentication, got {response.status_code}: {response.text}"
    
    def test_cors_errors_block_cross_origin_requests(self):
        """
        Test that cross-origin requests fail with CORS errors.
        **Validates: Requirements 1.7**
        """
        # Simulate a cross-origin request from a frontend
        headers = {
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
        
        # Make a preflight OPTIONS request
        response = client.options("/play", headers=headers)
        
        # On unfixed code, this should fail or not include proper CORS headers
        # On fixed code, this should include Access-Control-Allow-Origin header
        cors_header = response.headers.get("Access-Control-Allow-Origin")
        assert cors_header is not None, "CORS headers should be present for cross-origin requests"
        
        # Test actual cross-origin POST request
        post_headers = {"Origin": "http://localhost:3000", "Content-Type": "application/json"}
        response = client.post("/play", json="test song", headers=post_headers)
        
        # Should have CORS headers in response
        cors_header = response.headers.get("Access-Control-Allow-Origin")
        assert cors_header is not None, "CORS headers should be present in POST response"

if __name__ == "__main__":
    # Run the tests to demonstrate bugs on unfixed code
    pytest.main([__file__, "-v", "--tb=short"])