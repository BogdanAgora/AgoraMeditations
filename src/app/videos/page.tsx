import type { Video } from '@/lib/types';
import VideoCard from '@/components/VideoCard';
import { Youtube, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getVideos(): Promise<Video[] | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/videos`, {
      cache: 'no-store', // Or configure revalidation as needed
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.statusText}`);
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
            <p className="text-destructive">We couldn't load the videos at this time. Please try again later.</p>
          </CardContent>
        </Card>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No videos available at the moment. Please check back later.</p>
      )}
    </div>
  );
}
