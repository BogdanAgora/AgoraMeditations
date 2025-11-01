import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Youtube, BookOpen, Sunrise } from "lucide-react";
import { PiPianoKeysFill } from "react-icons/pi";
import { GiFlute } from "react-icons/gi";
import { FaPrayingHands } from "react-icons/fa";
import { youtubeService } from "@/lib/youtube";

async function getLatestVideos() {
  const CHANNEL_ID = "UCcCeTkWFuG5nCDhY6wMJiGw";
  
  const result = await youtubeService.getChannelVideos(CHANNEL_ID, 2);
  
  if (!result.success) {
    // Log the error but return empty array to maintain existing behavior
    console.error("Error fetching YouTube videos:", result.error?.message);
    return [];
  }

  // Transform the Video[] data to match the expected format for the homepage
  return (result.data || []).map((video) => ({
    id: video.youtubeVideoId,
    title: video.title,
    thumbnail: video.thumbnailUrl,
    description: video.description,
    publishedAt: video.publishedAt || new Date().toISOString(),
  }));
}

export default async function Home() {
  return (
    <div className="space-y-12">
      <section 
        className="text-center py-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg shadow-lg bg-cover bg-center relative"
        style={{ backgroundImage: "url('/fundal.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 rounded-lg"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Sunrise className="mx-auto h-24 w-24 text-black mb-6" />
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Welcome to AgoraMeditations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover a sanctuary for your mind. Explore guided meditations,
            soothing nature videos, and insightful articles to cultivate inner
            peace and mindfulness.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="smooth-transition bg-black text-white hover:bg-gray-800"
            >
              <Link href="/videos">
                <Youtube className="mr-2 h-5 w-5" />
                Explore Videos
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="smooth-transition bg-black text-white hover:bg-gray-800"
            >
              <Link href="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Our Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {await getLatestVideos().then((videos) => (
        <>
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">
                Find Your Calm
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our curated collection of YouTube videos offers serene landscapes and calming music to help you relax, de-stress, and find focus.
                We blend ancient sounds and modern healing vibes using instruments like the Armenian Duduk, Sufi Ney, Native and Tibetan flutes, and piano — inspired by Sufi wisdom, Rumi's poetry, and timeless traditions.
              </p>
              <Button asChild className="smooth-transition bg-black text-white hover:bg-gray-800">
                <Link href="/videos">Start Watching</Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              {videos[0] && (
                <Image
                  src={videos[0].thumbnail}
                  alt={videos[0].title}
                  data-ai-hint="duduk meditation"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl md:order-last">
              {videos[1] && (
                <Image
                  src={videos[1].thumbnail}
                  alt={videos[1].title}
                  data-ai-hint="deep meditation music"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">
                Nourish Your Mind
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AgoraMeditations blog features articles on mindfulness practices, meditation benefits, the positive effects of music on mental health and tips for integrating tranquility into your daily life. Content is crafted with care, supported by AI insights.
              </p>
              <Button asChild className="smooth-transition bg-black text-white hover:bg-gray-800">
                <Link href="/blog">Explore Articles</Link>
              </Button>
            </div>
          </section>
        </>
      ))}

      <section className="py-12">
        <h2 className="text-3xl font-headline font-semibold text-center text-foreground mb-8">
          Explore Our Playlists
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/playlists/armenian-duduk-meditation-music">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <GiFlute className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Armenian Duduk Meditation Music</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A soul-soothing collection of meditation and calming music featuring the Armenian Duduk, blending ancient melancholy with serene harmonies to guide you into deep inner peace and reflection.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/sufi-ney-meditation-music">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <GiFlute className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Sufi Ney Meditation Music</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A transcendent collection of Sufi Ney flute meditation music, weaving mystical melodies and sacred stillness to awaken the soul and invite profound inner peace.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/echoes-of-rumi">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <FaPrayingHands className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Echoes of Rumi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Echoes of Rumi is a soulful journey of meditation and calm, inspired by the timeless poetry of Rumi, where every note whispers love, unity, and the divine rhythm of the heart.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/totem-native-american-flute">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <GiFlute className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Totem – Native American Flute</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Totem – Native America Flute is a meditative sound journey inspired by ancient Native American music, where the flute's sacred voice connects the spirit to the earth, the wind, and timeless wisdom
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/piano-echoes-of-serenity">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <PiPianoKeysFill className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Piano Echoes of Serenity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A gentle collection of relaxing piano melodies designed to calm the mind, enhance focus while reading or studying, and lull you into peaceful sleep
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
