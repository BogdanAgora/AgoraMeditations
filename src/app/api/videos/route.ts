
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const YOUTUBE_CHANNEL_ID = 'UCsA1nJUPR0P81A6kMmxRAgw'; // Corrected Agora Meditations Channel ID
const UPLOADS_PLAYLIST_ID = 'UUsA1nJUPR0P81A6kMmxRAgw'; // Derived from Corrected Channel ID for uploads

interface YouTubePlaylistItemSnippet {
  title: string;
  description: string;
  thumbnails: {
    default?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  resourceId: {
    kind: string;
    videoId: string;
  };
  publishedAt: string;
}

interface YouTubePlaylistItem {
  id: string; // Playlist Item ID, not Video ID
  snippet: YouTubePlaylistItemSnippet;
}

interface YouTubeAPIResponse {
  items: YouTubePlaylistItem[];
  error?: {
    message: string;
  };
}

function generateAiHint(title: string): string {
  return title.toLowerCase().split(' ').slice(0, 2).join(' ') || 'meditation video';
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.error('YouTube API key is missing or not configured. Please set YOUTUBE_API_KEY in your .env.local file.');
    // Return an empty list or a predefined placeholder list if the API key is missing
    // For now, returning an error to make it clear.
    return NextResponse.json({ message: 'YouTube API key not configured on the server.' }, { status: 500 });
  }

  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=9&key=${apiKey}&order=date`;

  try {
    const response = await fetch(YOUTUBE_API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch videos from YouTube API:', errorData);
      throw new Error(errorData?.error?.message || `YouTube API request failed with status ${response.status}`);
    }

    const data: YouTubeAPIResponse = await response.json();

    if (data.error) {
      console.error('YouTube API returned an error:', data.error.message);
      throw new Error(data.error.message);
    }
    
    if (!data.items) {
      console.warn('No video items returned from YouTube API.');
      return NextResponse.json([]);
    }

    const videos: Video[] = data.items.map((item) => ({
      id: item.snippet.resourceId.videoId, // Use videoId as the primary ID
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''), // Truncate description
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://placehold.co/480x360.png',
      youtubeVideoId: item.snippet.resourceId.videoId,
      thumbnailAiHint: generateAiHint(item.snippet.title),
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in GET /api/videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load videos due to an unexpected error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

