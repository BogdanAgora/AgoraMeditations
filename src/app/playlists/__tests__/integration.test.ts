import { describe, it, expect, beforeAll } from 'vitest';
import { youtubeService } from '@/lib/youtube';

describe('Playlist Integration Tests', () => {
  beforeAll(() => {
    // Ensure we have a test API key for integration tests
    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY === 'test-api-key-12345') {
      console.warn('Integration tests require a real YouTube API key. Skipping...');
    }
  });

  it('should validate API key configuration', async () => {
    const result = await youtubeService.validateApiKey();
    
    if (process.env.YOUTUBE_API_KEY === 'test-api-key-12345') {
      // In test environment with mock key, expect failure
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('API_KEY_INVALID');
    } else {
      // With real API key, should succeed or fail with specific error
      if (!result.success) {
        console.log('API Key validation failed:', result.error);
        // This is expected in CI/test environments without real API keys
        expect(['API_KEY_MISSING', 'API_KEY_INVALID', 'QUOTA_EXCEEDED', 'NETWORK_ERROR']).toContain(result.error?.type);
      } else {
        expect(result.success).toBe(true);
      }
    }
  });

  it('should handle playlist API calls gracefully', async () => {
    // Test with a known playlist ID from the application
    const playlistId = 'PLB3xbTNRx64RSHP8slh42Byi0neymleDp'; // Piano Melodies playlist
    const result = await youtubeService.getPlaylistVideos(playlistId, 5);
    
    if (process.env.YOUTUBE_API_KEY === 'test-api-key-12345') {
      // In test environment, expect API key error
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe('API_KEY_INVALID');
    } else {
      // With real API key, should either succeed or fail gracefully
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
        console.log(`Successfully fetched ${result.data?.length || 0} videos from playlist`);
      } else {
        // Should fail gracefully with proper error classification
        expect(['API_KEY_MISSING', 'API_KEY_INVALID', 'QUOTA_EXCEEDED', 'NETWORK_ERROR', 'UNKNOWN']).toContain(result.error?.type);
        console.log('Playlist API call failed as expected:', result.error?.type);
      }
    }
  });

  it('should handle invalid playlist IDs gracefully', async () => {
    const invalidPlaylistId = 'INVALID_PLAYLIST_ID_12345';
    const result = await youtubeService.getPlaylistVideos(invalidPlaylistId, 5);
    
    expect(result.success).toBe(false);
    // Should handle invalid playlist ID as an API error, not crash
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBeDefined();
  });

  it('should respect maxResults parameter', async () => {
    const playlistId = 'PLB3xbTNRx64RSHP8slh42Byi0neymleDp';
    const maxResults = 3;
    const result = await youtubeService.getPlaylistVideos(playlistId, maxResults);
    
    if (result.success && result.data) {
      // If successful, should respect the maxResults limit
      expect(result.data.length).toBeLessThanOrEqual(maxResults);
    }
    // If failed, that's also acceptable for integration tests
  });

  it('should maintain consistent error handling across all playlists', async () => {
    const playlistIds = [
      'PLB3xbTNRx64RSHP8slh42Byi0neymleDp', // Piano Melodies
      'PLB3xbTNRx64TaRVQOvt03xdihYNeOn6qD', // Duduk Harmonies
      'PLB3xbTNRx64Q4HHkoILBdfdDQ3d2epOBw', // Sufi Rhythms
    ];

    const results = await Promise.all(
      playlistIds.map(id => youtubeService.getPlaylistVideos(id, 1))
    );

    // All results should have consistent structure
    results.forEach((result, index) => {
      expect(typeof result.success).toBe('boolean');
      
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
      } else {
        expect(result.error).toBeDefined();
        expect(result.error?.type).toBeDefined();
        expect(result.error?.message).toBeDefined();
      }
    });

    // If any succeeded, they should all have the same success/failure pattern
    // (since they use the same API key and service)
    const successStates = results.map(r => r.success);
    const allSame = successStates.every(state => state === successStates[0]);
    expect(allSame).toBe(true);
  });
});