
import type { Video } from '@/lib/types';
import VideoCard from '@/components/VideoCard';
import { Youtube, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getVideos(): Promise<Video[] | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/videos`;
    const res = await fetch(apiUrl, {
    });

    if (!res.ok) {
      let errorMessage = `API request failed with status ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (jsonError) {
        console.warn('Could not parse error response as JSON:', jsonError);
      }
      throw new Error(`Failed to fetch videos: ${errorMessage}`);
    }
    return res.json();
  } catch (error) {
    console.error(error); 
    return null;
  }
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Youtube className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-foreground">Meditation Videos</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
          Find guided meditations, calming nature scenes, and relaxing music to support your mindfulness practice.
        </p>
      </div>

      {!videos ? (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error Loading Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              We couldn't load the videos at this time. This might be due to an issue with the YouTube API connection (e.g., invalid API key, quota exceeded) or a server-side problem. 
              Please ensure the YOUTUBE_API_KEY is correctly set in your server environment. Check the server console logs for more specific error details.
            </p>
          </CardContent>
        </Card>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
