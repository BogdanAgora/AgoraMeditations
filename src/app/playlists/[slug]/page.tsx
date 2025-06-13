import Image from "next/image";
import { notFound } from "next/navigation";
import { Sunrise } from "lucide-react";
import { PiPianoKeysFill } from "react-icons/pi";
import { GiFlute } from "react-icons/gi";
import { FaPrayingHands } from "react-icons/fa";

// Define our playlist data
const playlists = {
  "piano-melodies": {
    title: "Piano Melodies",
    description:
      "Calming piano pieces for relaxation, focus, and peaceful moments.",
    icon: PiPianoKeysFill,
    playlistId: "PLB3xbTNRx64RSHP8slh42Byi0neymleDp",
    videos: async (YOUTUBE_API_KEY: string) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=PLB3xbTNRx64RSHP8slh42Byi0neymleDp&part=snippet,contentDetails&maxResults=50`,
      );
      const data = await response.json();
      const items = data.items || [];
      return items.sort(
        (a: any, b: any) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );
    },
  },
  "duduk-harmonies": {
    title: "Duduk Harmonies",
    description:
      "Soulful and ancient duduk tunes for deep meditation and introspection.",
    icon: GiFlute,
    playlistId: "PLB3xbTNRx64TaRVQOvt03xdihYNeOn6qD",
    videos: async (YOUTUBE_API_KEY: string) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=PLB3xbTNRx64TaRVQOvt03xdihYNeOn6qD&part=snippet,contentDetails&maxResults=50`,
      );
      const data = await response.json();
      const items = data.items || [];
      return items.sort(
        (a: any, b: any) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );
    },
  },
  "sufi-rhythms": {
    title: "Sufi Rhythms",
    description:
      "Mystical and uplifting Sufi music to elevate your spirit and connect.",
    icon: FaPrayingHands,
    playlistId: "PLB3xbTNRx64Q4HHkoILBdfdDQ3d2epOBw",
    videos: async (YOUTUBE_API_KEY: string) => {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=PLB3xbTNRx64Q4HHkoILBdfdDQ3d2epOBw&part=snippet,contentDetails&maxResults=50`,
      );
      const data = await response.json();
      const items = data.items || [];
      return items.sort(
        (a: any, b: any) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );
    },
  },
};

// Validate slug parameter
async function validateSlug(slug: string) {
  if (!Object.keys(playlists).includes(slug)) {
    return null;
  }
  return playlists[slug as keyof typeof playlists];
}

export async function generateStaticParams() {
  return Object.keys(playlists).map((slug) => ({
    slug,
  }));
}

export default async function PlaylistPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const playlist = playlists[slug as keyof typeof playlists];
  if (!playlist) notFound();

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
  const videos = await playlist.videos(YOUTUBE_API_KEY);

  const Icon = playlist.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="mb-4">
          <Icon size={64} className="text-accent mx-auto" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-4">
          {playlist.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {playlist.description}
        </p>
      </div>
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Sunrise className="mx-auto h-16 w-16 text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            No videos found in this playlist yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <a
              key={video.snippet.resourceId.videoId}
              href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-video">
                  <Image
                    src={
                      video.snippet.thumbnails.high?.url ||
                      video.snippet.thumbnails.medium?.url ||
                      video.snippet.thumbnails.default?.url
                    }
                    alt={video.snippet.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-headline font-semibold group-hover:text-primary transition-colors duration-200">
                    {video.snippet.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
