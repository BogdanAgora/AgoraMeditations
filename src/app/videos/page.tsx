
import type { Video } from '@/lib/types';
import VideoCard from '@/components/VideoCard';
import { Youtube, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { youtubeService, type YouTubeError } from '@/lib/youtube';

// This is the Channel ID for @AgoraMeditations
const YOUTUBE_CHANNEL_ID = "UCcCeTkWFuG5nCDhY6wMJiGw";

interface VideoResult {
  videos: Video[] | null;
  error: YouTubeError | null;
}

async function getVideos(): Promise<VideoResult> {
  try {
    const result = await youtubeService.getChannelVideos(YOUTUBE_CHANNEL_ID, 9);
    
    if (!result.success) {
      return {
        videos: null,
        error: result.error || null
      };
    }
    
    return {
      videos: result.data || [],
      error: null
    };
  } catch (error) {
    console.error('[Videos Page] Unexpected error:', error);
    return {
      videos: null,
      error: {
        type: 'UNKNOWN',
        message: 'An unexpected error occurred while fetching videos',
        details: error
      }
    };
  }
}

function getErrorMessage(error: YouTubeError): { title: string; message: string } {
  switch (error.type) {
    case 'API_KEY_MISSING':
      return {
        title: 'API Configuration Missing',
        message: 'YouTube API key is not configured. Please ensure the YOUTUBE_API_KEY environment variable is set and restart the server.'
      };
    case 'API_KEY_INVALID':
      return {
        title: 'API Key Invalid',
        message: 'The YouTube API key is invalid or restricted. Please check your API key configuration and ensure it has access to the YouTube Data API v3.'
      };
    case 'QUOTA_EXCEEDED':
      return {
        title: 'API Quota Exceeded',
        message: 'The YouTube API quota has been exceeded. Please try again later or check your API usage limits.'
      };
    case 'NETWORK_ERROR':
      return {
        title: 'Network Error',
        message: 'Unable to connect to YouTube API. Please check your internet connection and try again.'
      };
    default:
      return {
        title: 'Error Loading Videos',
        message: error.message || 'An unexpected error occurred while loading videos. Please try again later.'
      };
  }
}

export default async function VideosPage() {
  const { videos, error } = await getVideos();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Youtube className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-foreground">AgoraMeditations Videos</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
          Find guided meditations, calming nature scenes, and relaxing music to support your mindfulness practice.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {getErrorMessage(error).title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              {getErrorMessage(error).message}
            </p>
            {error.type === 'API_KEY_MISSING' && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>For developers:</strong> Create a .env.local file with YOUTUBE_API_KEY=your_api_key_here and restart the development server.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : !videos || videos.length === 0 ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Info className="mr-2 h-5 w-5 text-primary" />
              No Videos Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No videos are currently available. This could mean the YouTube channel has no public videos,
              or there might be a temporary issue fetching them.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If you are the site administrator, please check the server logs for any YouTube API errors or warnings.
              Ensure the API key is valid and has the necessary permissions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
