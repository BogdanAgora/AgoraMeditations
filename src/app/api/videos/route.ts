
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
  description:string;
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

// For search results, the 'id' is an object.
interface YouTubeSearchItemId {
  kind: string; // e.g., "youtube#video"
  videoId: string;
}

interface YouTubeSearchItem {
  kind: string; // e.g., "youtube#searchResult"
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
    console.error(`
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
[API Route Critical Error] YouTube API key is MISSING or NOT CONFIGURED.
Please ensure:
1. You have a .env.local file in the root of your project.
2. It contains the line: YOUTUBE_API_KEY=your_actual_api_key_here
3. You have restarted your Next.js development server after creating/modifying .env.local.
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    `);
    return NextResponse.json({ message: 'YouTube API key not configured on the server. Please check server logs for details.' }, { status: 500 });
  }
  
  console.log(`[API Route] Using YouTube API Key (first 5, last 5 chars): ${apiKey.substring(0,5)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`[API Route] Attempting to fetch videos for CHANNEL_ID: ${YOUTUBE_CHANNEL_ID}`);

  // Using search.list to get videos by channelId, ordered by date
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=9&order=date&type=video&key=${apiKey}`;
  console.log('[API Route] Requesting YouTube API URL:', YOUTUBE_API_URL);

  try {
    const response = await fetch(YOUTUBE_API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const responseText = await response.text();
    console.log(`[API Route] YouTube API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`[API Route Error] YouTube API request failed. Status: ${response.status} ${response.statusText}. Raw Response Body: ${responseText}`);
      try {
        const errorData: YouTubeAPIResponse = JSON.parse(responseText); // Attempt to parse error
        const errorMessage = errorData?.error?.errors?.[0]?.message || errorData?.error?.message || `YouTube API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        // If parsing fails, use the raw response text for the error or a generic message.
        const detail = responseText.length < 500 ? responseText : `Status ${response.status}`;
        throw new Error(`YouTube API request failed: ${detail}`);
      }
    }
    
    console.log(`[API Route] YouTube API Raw Response Body (Success - first 1000 chars): ${responseText.substring(0, 1000)}...`);
    const data: YouTubeAPIResponse = JSON.parse(responseText);

    if (data.error) {
      console.error('[API Route Error] YouTube API returned an error object. Parsed error data:', data.error);
      const detailedError = data.error.errors?.[0]?.message || data.error.message;
      throw new Error(detailedError);
    }
    
    if (!data.items || data.items.length === 0) {
      const reason = !data.items 
        ? "No 'items' field in response." 
        : (data.pageInfo && typeof data.pageInfo.totalResults === 'number' && data.pageInfo.totalResults === 0) 
          ? "'items' array is empty and 'pageInfo.totalResults' is 0."
          : "'items' array is empty.";
      
      console.warn(`[API Route Warning] No videos found. Reason: ${reason} This usually indicates an issue with the API key, channel ID, or the channel has no public videos matching the query. Full YouTube API response data:`, JSON.stringify(data, null, 2));
      return NextResponse.json([]);
    }

    const videos: Video[] = data.items.map((item) => ({
      id: item.id.videoId, // For search results, videoId is in item.id.videoId
      title: item.snippet.title,
      description: item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://placehold.co/480x360.png',
      youtubeVideoId: item.id.videoId,
      thumbnailAiHint: generateAiHint(item.snippet.title),
    }));

    console.log(`[API Route] Successfully mapped ${videos.length} videos.`);
    return NextResponse.json(videos);
  } catch (error) {
    console.error('[API Route Error] Error in GET /api/videos (outer catch block):', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load videos due to an unexpected error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
