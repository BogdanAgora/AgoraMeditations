
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

// This is the Channel ID for @AgoraMeditations
const YOUTUBE_CHANNEL_ID = 'UCsA1nJUPR0P81A6kMmxRAgw';

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

function generateAiHint(title?: string): string {
  if (typeof title !== 'string' || !title.trim()) {
    return 'meditation video'; // Default hint
  }
  const words = title.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0]} ${words[1]}`;
  } else if (words.length === 1) {
    return words[0];
  }
  return 'meditation video'; // Fallback if title is very short or unusual
}


export async function GET() {
  console.log('[API Route /api/videos] Received GET request.');
  let apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY_HERE' || apiKey.trim() === '') {
    const errorMsg = 'YouTube API key is MISSING or NOT CONFIGURED. Please ensure: 1. You have a .env.local file in the root of your project. 2. It contains the line: YOUTUBE_API_KEY=your_actual_api_key_here (NO quotes around the key itself). 3. You have RESTARTED your Next.js development server after creating/modifying .env.local.';
    console.error(`\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n[API Route Critical Error] ${errorMsg}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n`);
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
  
  apiKey = apiKey.trim().replace(/^["'](.*)["']$/, '$1');
  
  console.log(`[API Route] Using YouTube API Key (first 5, last 5 chars): ${apiKey.substring(0,5)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`[API Route] Attempting to fetch videos for CHANNEL_ID: ${YOUTUBE_CHANNEL_ID}`);

  // Using search.list to get videos by channelId, ordered by date
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=9&type=video&key=${apiKey}`;
  console.log('[API Route] Requesting YouTube API URL:', YOUTUBE_API_URL);

  try {
    const response = await fetch(YOUTUBE_API_URL, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    const responseText = await response.text(); // Get raw text first for robust logging
    console.log(`[API Route] YouTube API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.error(`[API Route Error] YouTube API request failed. Status: ${response.status} ${response.statusText}. Raw Response Body: ${responseText}`);
      try {
        const errorData: YouTubeAPIResponse = JSON.parse(responseText); 
        const errorMessage = errorData?.error?.errors?.[0]?.message || errorData?.error?.message || `YouTube API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        const detail = responseText.length < 500 ? responseText : `Status ${response.status}`;
        throw new Error(`YouTube API request failed: ${detail}`);
      }
    }
    
    console.log(`[API Route] YouTube API Raw Response Body (Success - first 1000 chars): ${responseText.substring(0, 1000)}...`);
    const data: YouTubeAPIResponse = JSON.parse(responseText);

    if (data.error) {
      console.error('[API Route Error] YouTube API returned an error object even with a successful HTTP status. Parsed error data:', JSON.stringify(data.error, null, 2));
      const detailedError = data.error.errors?.[0]?.message || data.error.message;
      throw new Error(detailedError);
    }
    
    if (!data.items || data.items.length === 0) {
      const reason = !data.items 
        ? "No 'items' field in response." 
        : (data.pageInfo && typeof data.pageInfo.totalResults === 'number' && data.pageInfo.totalResults === 0) 
          ? "'items' array is empty and 'pageInfo.totalResults' is 0."
          : "'items' array is empty.";
      
      console.warn(`[API Route Warning] No videos found. Reason: ${reason} This usually indicates an issue with the API key (e.g., not enabled for YouTube Data API v3, restricted, billing issue), an incorrect channel ID, or the channel has no public videos matching the query. Full YouTube API response data:`, JSON.stringify(data, null, 2));
      return NextResponse.json([]);
    }

    const videos: Video[] = data.items.map((item) => ({
      id: item.id.videoId, 
      title: item.snippet.title || 'Untitled Video',
      description: item.snippet.description ? (item.snippet.description.substring(0, 200) + (item.snippet.description.length > 200 ? '...' : '')) : 'No description available.',
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://placehold.co/480x360.png',
      youtubeVideoId: item.id.videoId,
      thumbnailAiHint: generateAiHint(item.snippet.title),
    }));

    console.log(`[API Route] Successfully mapped ${videos.length} videos.`);
    return NextResponse.json(videos);

  } catch (error: unknown) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('[API Route Error] An unexpected error occurred in GET /api/videos:');
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      if (error.stack) {
        console.error('Error Stack (condensed):', error.stack.substring(0, 1000) + (error.stack.length > 1000 ? '...' : ''));
      }
    } else {
      console.error('Unknown Error Type:', typeof error);
      console.error('Error Object (stringified):', String(error));
    }
    console.error('This could be due to an issue with the YouTube API request (e.g., invalid API key, quota exceeded, network issue) or a problem in the server-side code.');
    console.error('PLEASE CAREFULLY REVIEW THE FULL ERROR DETAILS ABOVE AND ANY PRECEDING YOUTUBE API RESPONSE LOGS.');
    console.error('Verify your YOUTUBE_API_KEY in .env.local, ensure it has YouTube Data API v3 enabled in Google Cloud Console, and check for any restrictions or billing issues.');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to load videos due to an unexpected server error. Check server logs for more details.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
