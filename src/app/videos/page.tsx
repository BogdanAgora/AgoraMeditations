import type { Video } from '@/lib/types';
import VideoCard from '@/components/VideoCard';
import { Youtube } from 'lucide-react';

// Placeholder video data. Replace with actual data fetching logic.
const videos: Video[] = [
  {
    id: '1',
    title: '10 Minute Guided Morning Meditation',
    description: 'Start your day with peace and clarity. This 10-minute guided meditation will help you set a positive intention for the day ahead.',
    thumbnailUrl: 'https://placehold.co/640x360.png?text=Morning+Meditation',
    youtubeVideoId: 'VIDEO_ID_1', // Replace with actual YouTube Video ID
  },
  {
    id: '2',
    title: 'Relaxing Nature Sounds for Sleep & Stress Relief',
    description: 'Immerse yourself in the calming sounds of nature. Perfect for falling asleep, reducing stress, or finding focus during work or study.',
    thumbnailUrl: 'https://placehold.co/640x360.png?text=Nature+Sounds',
    youtubeVideoId: 'VIDEO_ID_2', // Replace with actual YouTube Video ID
  },
  {
    id: '3',
    title: 'Mindfulness Meditation for Beginners',
    description: 'New to meditation? This guided session will introduce you to the basics of mindfulness and help you cultivate present moment awareness.',
    thumbnailUrl: 'https://placehold.co/640x360.png?text=Beginner+Meditation',
    youtubeVideoId: 'VIDEO_ID_3', // Replace with actual YouTube Video ID
  },
  {
    id: '4',
    title: 'Calming Ambient Music for Deep Relaxation',
    description: 'Unwind with this soothing ambient music, designed to promote deep relaxation and tranquility. Ideal for meditation, yoga, or simply unwinding.',
    thumbnailUrl: 'https://placehold.co/640x360.png?text=Ambient+Music',
    youtubeVideoId: 'VIDEO_ID_4', // Replace with actual YouTube Video ID
  },
];

export default function VideosPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Youtube className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-foreground">Meditation Videos</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
          Find guided meditations, calming nature scenes, and relaxing music to support your mindfulness practice.
        </p>
      </div>

      {videos.length > 0 ? (
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
