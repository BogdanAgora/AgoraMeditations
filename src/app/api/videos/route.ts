
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const YOUTUBE_CHANNEL_ID = 'UCsA1nJUPR0P81A6kMmxRAgw'; // Agora Meditations Channel ID
const UPLOADS_PLAYLIST_ID = YOUTUBE_CHANNEL_ID.replace(/^UC/, 'UU'); // Derived from Channel ID for uploads

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
  id: string;
  snippet: YouTubePlaylistItemSnippet;
}

interface YouTubeAPIResponse {
  items: YouTubePlaylistItem[];
  error?: {
    message: string;
    errors?: Array<{
      message: string;
      domain: string;
      reason: string;
    }>
  };
}

function generateAiHint(title: string): string {
  return title.toLowerCase().split(' ').slice(0, 2).join(' ') || 'meditation video';
}

export async function GET() {
  let apiKey = process.env.YOUTUBE_API_KEY;

  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["'](.*)["']$/, '$1');
  }

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE' || apiKey.trim() === '') {
    console.error('YouTube API key is missing or not configured. Please set YOUTUBE_API_KEY in your .env.local file.');
    return NextResponse.json({ message: 'YouTube API key not configured on the server.' }, { status: 500 });
  }
  
  // For diagnostics, log parts of the key (DO NOT log the full key in production environments accessible by others)
  // For local development, logging the full key can help debug.
  // Consider only logging this in a non-production environment.
  console.log(`Using YouTube API Key (first 5, last 5 chars): ${apiKey.substring(0,5)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`Attempting to fetch videos for UPLOADS_PLAYLIST_ID: ${UPLOADS_PLAYLIST_ID}`);

  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=9&key=${apiKey}`;
  console.log('Requesting YouTube API URL:', YOUTUBE_API_URL);

  try {
    const response = await fetch(YOUTUBE_API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const responseText = await response.text(); // Get raw response text for logging
    console.log(`YouTube API Response Status: ${response.status} ${response.statusText}`);
    console.log(`YouTube API Raw Response Body: ${responseText}`);

    const data: YouTubeAPIResponse = JSON.parse(responseText); // Parse after logging

    if (!response.ok) {
      console.error('Failed to fetch videos from YouTube API. Parsed error data:', data);
      const errorMessage = data?.error?.errors?.[0]?.message || data?.error?.message || `YouTube API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }
    
    if (data.error) {
      console.error('YouTube API returned an error (after response.ok check). Parsed error data:', data.error);
      const detailedError = data.error.errors?.[0]?.message || data.error.message;
      throw new Error(detailedError);
    }
    
    if (!data.items) {
      console.warn('No video items returned from YouTube API. Full response data:', data);
      return NextResponse.json([]);
    }

    const videos: Video[] = data.items.map((item) => ({
      id: item.snippet.resourceId.videoId, 
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://placehold.co/480x360.png',
      youtubeVideoId: item.snippet.resourceId.videoId,
      thumbnailAiHint: generateAiHint(item.snippet.title),
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in GET /api/videos (outer catch block):', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load videos due to an unexpected error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
