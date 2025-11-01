import Image from "next/image";
import { notFound } from "next/navigation";
import { Sunrise } from "lucide-react";
import { PiPianoKeysFill } from "react-icons/pi";
import { GiFlute, GiDervishSwords, GiLotusFlower, GiPrayerBeads } from "react-icons/gi";
import { FaPrayingHands } from "react-icons/fa";
import { FaMountain } from "react-icons/fa";
import { youtubeService } from "@/lib/youtube";

// Define our playlist data
const playlists = {
  "armenian-duduk-meditation-music": {
    title: "Armenian Duduk Meditation Music",
    description:
      "A soul-soothing collection of meditation and calming music featuring the Armenian Duduk, blending ancient melancholy with serene harmonies to guide you into deep inner peace and reflection.",
    icon: GiFlute,
    playlistId: "PLB3xbTNRx64Spv824QbZPmdivugVo71tK",
  },
  "sufi-ney-meditation-music": {
    title: "Sufi Ney Meditation Music",
    description:
      "A transcendent collection of Sufi Ney flute meditation music, weaving mystical melodies and sacred stillness to awaken the soul and invite profound inner peace.",
    icon: GiDervishSwords,
    playlistId: "PLB3xbTNRx64Q4HHkoILBdfdDQ3d2epOBw",
  },
  "echoes-of-rumi": {
    title: "Echoes of Rumi",
    description:
      "Echoes of Rumi is a soulful journey of meditation and calm, inspired by the timeless poetry of Rumi, where every note whispers love, unity, and the divine rhythm of the heart.",
    icon: FaPrayingHands,
    playlistId: "PLB3xbTNRx64SYYvrsEfa2uYOFSep1a0Dq",
  },
  "totem-native-american-flute": {
    title: "Totem – Native American Flute",
    description:
      "Totem – Native America Flute is a meditative sound journey inspired by ancient Native American music, where the flute's sacred voice connects the spirit to the earth, the wind, and timeless wisdom",
    icon: FaMountain,
    playlistId: "PLB3xbTNRx64TozF1vwgcRx5s7rUwwx_R7",
  },
  "piano-echoes-of-serenity": {
    title: "Piano Echoes of Serenity",
    description:
      "A gentle collection of relaxing piano melodies designed to calm the mind, enhance focus while reading or studying, and lull you into peaceful sleep",
    icon: PiPianoKeysFill,
    playlistId: "PLB3xbTNRx64RSHP8slh42Byi0neymleDp",
  },
  "satori-tibetan-mind": {
    title: "Satori – Tibetan Mind – Soothing Music",
    description:
      "Satori – Tibetan Mind – Soothing Music is a serene collection of meditative soundscapes inspired by Tibetan wisdom, guiding you toward inner stillness, mindfulness, and spiritual awakening.",
    icon: GiLotusFlower,
    playlistId: "PLB3xbTNRx64RKim9NdGMMMQa1rMGlKvCY",
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

  // Use shared YouTube service to get playlist videos
  const result = await youtubeService.getPlaylistVideos(playlist.playlistId, 50);
  
  let videos: any[] = [];
  let errorMessage: string | null = null;

  if (result.success) {
    videos = result.data || [];
  } else {
    // Handle errors gracefully with user-friendly messages
    switch (result.error?.type) {
      case 'API_KEY_MISSING':
        errorMessage = 'YouTube API configuration is missing. Please check the server configuration.';
        break;
      case 'API_KEY_INVALID':
        errorMessage = 'YouTube API key is invalid. Please check the server configuration.';
        break;
      case 'QUOTA_EXCEEDED':
        errorMessage = 'YouTube API quota exceeded. Please try again later.';
        break;
      case 'NETWORK_ERROR':
        errorMessage = 'Network error occurred. Please check your connection and try again.';
        break;
      default:
        errorMessage = 'Unable to load playlist videos. Please try again later.';
    }
    console.error(`[Playlist ${slug}] YouTube API Error:`, result.error);
  }

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
      {errorMessage ? (
        <div className="text-center py-12">
          <Sunrise className="mx-auto h-16 w-16 text-destructive mb-4" />
          <p className="text-lg text-muted-foreground mb-2">
            {errorMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact support.
          </p>
        </div>
      ) : videos.length === 0 ? (
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
