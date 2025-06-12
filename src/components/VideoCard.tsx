import type { Video } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Youtube } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl smooth-transition flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image 
            src={video.thumbnailUrl} 
            alt={video.title} 
            layout="fill"
            objectFit="cover"
            data-ai-hint="youtube thumbnail"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">{video.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">
          {video.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <a
          href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition w-full"
        >
          <Youtube className="mr-2 h-5 w-5" />
          Watch on YouTube
        </a>
      </CardFooter>
    </Card>
  );
}
