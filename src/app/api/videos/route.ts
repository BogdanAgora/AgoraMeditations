
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const YOUTUBE_CHANNEL_ID = 'UCsA1nJUPR0P81A6kMmxRAgw'; // Agora Meditations Channel ID

interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

interface YouTubeSearchItemId {
  kind: string;
  videoId: string;
}

interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: YouTubeSearchItemId;
  snippet: YouTubeSnippet;
}

interface YouTubeAPIResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
  error?: {
    code: number;
    message: string;
    errors?: Array<{
      message: string;
      domain: string;
      reason: string;
    }>
  };
}

function generateAiHint(title: string): string {
  // Create a hint from the first two words of the title, or a default
  const words = title.toLowerCase().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  } else if (words.length === 1 && words[0]) {
    return words[0];
  }
  return 'meditation video';
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
  
  console.log(`Using YouTube API Key (first 5, last 5 chars): ${apiKey.substring(0,5)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`Attempting to fetch videos for CHANNEL_ID: ${YOUTUBE_CHANNEL_ID}`);

  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=9&order=date&type=video&key=${apiKey}`;
  console.log('Requesting YouTube API URL:', YOUTUBE_API_URL);

  try {
    const response = await fetch(YOUTUBE_API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const responseText = await response.text(); // Get raw response text for logging
    console.log(`YouTube API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`YouTube API request failed. Raw Response Body: ${responseText}`);
      // Try to parse as JSON to get a structured error, but fall back to raw text
      try {
        const errorData: YouTubeAPIResponse = JSON.parse(responseText);
        const errorMessage = errorData?.error?.errors?.[0]?.message || errorData?.error?.message || `YouTube API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      } catch (parseError) {
         // If JSON parsing fails, use the status text or a generic message based on raw response
        const detail = responseText.length < 500 ? responseText : `Status ${response.status}`; // Avoid logging huge HTML pages
        throw new Error(`YouTube API request failed: ${detail}`);
      }
    }
    
    console.log(`YouTube API Raw Response Body (Success): ${responseText.substring(0, 1000)}...`); // Log only a part if successful
    const data: YouTubeAPIResponse = JSON.parse(responseText); // Parse after logging

    if (data.error) {
      console.error('YouTube API returned an error object. Parsed error data:', data.error);
      const detailedError = data.error.errors?.[0]?.message || data.error.message;
      throw new Error(detailedError);
    }
    
    if (!data.items) {
      console.warn('No video items returned from YouTube API (search.list). Full response data:', data);
      return NextResponse.json([]);
    }

    const videos: Video[] = data.items.map((item) => ({
      id: item.id.videoId, 
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://placehold.co/480x360.png',
      youtubeVideoId: item.id.videoId,
      thumbnailAiHint: generateAiHint(item.snippet.title),
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in GET /api/videos (outer catch block):', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load videos due to an unexpected error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

