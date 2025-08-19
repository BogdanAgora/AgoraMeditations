import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PlaylistPage from '../[slug]/page';
import { youtubeService } from '@/lib/youtube';
import type { YouTubeApiResult } from '@/lib/youtube';

// Mock the YouTube service
vi.mock('@/lib/youtube', () => ({
  youtubeService: {
    getPlaylistVideos: vi.fn(),
  },
}));

// Mock Next.js components
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('Not Found');
  }),
}));

const mockYoutubeService = vi.mocked(youtubeService);

describe('PlaylistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockPlaylistVideos = [
    {
      snippet: {
        resourceId: { videoId: 'video1' },
        title: 'Peaceful Piano Meditation',
        publishedAt: '2024-01-15T10:00:00Z',
        thumbnails: {
          high: { url: 'https://i.ytimg.com/vi/video1/hqdefault.jpg' },
        },
      },
    },
    {
      snippet: {
        resourceId: { videoId: 'video2' },
        title: 'Calming Piano Music',
        publishedAt: '2024-01-10T10:00:00Z',
        thumbnails: {
          medium: { url: 'https://i.ytimg.com/vi/video2/mqdefault.jpg' },
        },
      },
    },
  ];

  it('should render playlist page with videos successfully', async () => {
    const successResult: YouTubeApiResult<any[]> = {
      success: true,
      data: mockPlaylistVideos,
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(successResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    // Check playlist title and description
    expect(screen.getByText('Piano Melodies')).toBeInTheDocument();
    expect(screen.getByText(/Calming piano pieces for relaxation/)).toBeInTheDocument();

    // Wait for videos to load
    await waitFor(() => {
      expect(screen.getByText('Peaceful Piano Meditation')).toBeInTheDocument();
      expect(screen.getByText('Calming Piano Music')).toBeInTheDocument();
    });

    // Verify YouTube service was called with correct parameters
    expect(mockYoutubeService.getPlaylistVideos).toHaveBeenCalledWith(
      'PLB3xbTNRx64RSHP8slh42Byi0neymleDp',
      50
    );
  });

  it('should handle API key missing error gracefully', async () => {
    const errorResult: YouTubeApiResult<any[]> = {
      success: false,
      error: {
        type: 'API_KEY_MISSING',
        message: 'YouTube API key is missing',
      },
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(errorResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/YouTube API configuration is missing/)).toBeInTheDocument();
      expect(screen.getByText(/If this problem persists, please contact support/)).toBeInTheDocument();
    });

    // Verify no videos are displayed
    expect(screen.queryByText('Peaceful Piano Meditation')).not.toBeInTheDocument();
  });

  it('should handle API key invalid error gracefully', async () => {
    const errorResult: YouTubeApiResult<any[]> = {
      success: false,
      error: {
        type: 'API_KEY_INVALID',
        message: 'YouTube API key is invalid',
      },
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(errorResult);

    const params = Promise.resolve({ slug: 'duduk-harmonies' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      expect(screen.getByText(/YouTube API key is invalid/)).toBeInTheDocument();
    });
  });

  it('should handle quota exceeded error gracefully', async () => {
    const errorResult: YouTubeApiResult<any[]> = {
      success: false,
      error: {
        type: 'QUOTA_EXCEEDED',
        message: 'Quota exceeded',
      },
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(errorResult);

    const params = Promise.resolve({ slug: 'sufi-rhythms' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      expect(screen.getByText(/YouTube API quota exceeded/)).toBeInTheDocument();
    });
  });

  it('should handle network error gracefully', async () => {
    const errorResult: YouTubeApiResult<any[]> = {
      success: false,
      error: {
        type: 'NETWORK_ERROR',
        message: 'Network error',
      },
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(errorResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      expect(screen.getByText(/Network error occurred/)).toBeInTheDocument();
    });
  });

  it('should handle unknown error gracefully', async () => {
    const errorResult: YouTubeApiResult<any[]> = {
      success: false,
      error: {
        type: 'UNKNOWN',
        message: 'Unknown error',
      },
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(errorResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      expect(screen.getByText(/Unable to load playlist videos/)).toBeInTheDocument();
    });
  });

  it('should display empty state when no videos are found', async () => {
    const successResult: YouTubeApiResult<any[]> = {
      success: true,
      data: [],
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(successResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      expect(screen.getByText(/No videos found in this playlist yet/)).toBeInTheDocument();
    });
  });

  it('should throw error for invalid playlist slug', async () => {
    const params = Promise.resolve({ slug: 'invalid-playlist' });
    
    await expect(async () => {
      render(await PlaylistPage({ params }));
    }).rejects.toThrow('Not Found');
  });

  it('should render correct playlist data for each valid slug', async () => {
    const successResult: YouTubeApiResult<any[]> = {
      success: true,
      data: mockPlaylistVideos,
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(successResult);

    // Test piano-melodies
    let params = Promise.resolve({ slug: 'piano-melodies' });
    const { unmount: unmount1 } = render(await PlaylistPage({ params }));
    expect(screen.getByText('Piano Melodies')).toBeInTheDocument();
    expect(mockYoutubeService.getPlaylistVideos).toHaveBeenLastCalledWith(
      'PLB3xbTNRx64RSHP8slh42Byi0neymleDp',
      50
    );
    unmount1();

    // Test duduk-harmonies
    params = Promise.resolve({ slug: 'duduk-harmonies' });
    const { unmount: unmount2 } = render(await PlaylistPage({ params }));
    expect(screen.getByText('Duduk Harmonies')).toBeInTheDocument();
    expect(mockYoutubeService.getPlaylistVideos).toHaveBeenLastCalledWith(
      'PLB3xbTNRx64TaRVQOvt03xdihYNeOn6qD',
      50
    );
    unmount2();

    // Test sufi-rhythms
    params = Promise.resolve({ slug: 'sufi-rhythms' });
    render(await PlaylistPage({ params }));
    expect(screen.getByText('Sufi Rhythms')).toBeInTheDocument();
    expect(mockYoutubeService.getPlaylistVideos).toHaveBeenLastCalledWith(
      'PLB3xbTNRx64Q4HHkoILBdfdDQ3d2epOBw',
      50
    );
  });

  it('should render video links correctly', async () => {
    const successResult: YouTubeApiResult<any[]> = {
      success: true,
      data: mockPlaylistVideos,
    };

    mockYoutubeService.getPlaylistVideos.mockResolvedValue(successResult);

    const params = Promise.resolve({ slug: 'piano-melodies' });
    render(await PlaylistPage({ params }));

    await waitFor(() => {
      const videoLinks = screen.getAllByRole('link');
      const youtubeLinks = videoLinks.filter(link => 
        link.getAttribute('href')?.includes('youtube.com/watch')
      );
      
      expect(youtubeLinks).toHaveLength(2);
      expect(youtubeLinks[0]).toHaveAttribute('href', 'https://www.youtube.com/watch?v=video1');
      expect(youtubeLinks[1]).toHaveAttribute('href', 'https://www.youtube.com/watch?v=video2');
      
      // Check that links open in new tab
      youtubeLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});