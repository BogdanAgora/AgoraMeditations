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
      <section className="text-center py-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          <Sunrise className="mx-auto h-24 w-24 text-primary mb-6" />
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
              className="smooth-transition bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/videos">
                <Youtube className="mr-2 h-5 w-5" />
                Explore Videos
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="smooth-transition border-primary text-primary hover:bg-primary/10"
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
                Our curated collection of YouTube videos offers serene
                landscapes, calming music, and guided meditation sessions to
                help you relax, de-stress, and find focus.
              </p>
              <Button asChild className="smooth-transition">
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
                Our AgoraMeditations blog features articles on mindfulness
                practices, meditation benefits, and tips for integrating
                tranquility into your daily life. Content is crafted with care,
                supported by AI insights.
              </p>
              <Button asChild className="smooth-transition">
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
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/playlists/piano-melodies">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <PiPianoKeysFill className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Piano Melodies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Calming piano pieces for relaxation, focus, and peaceful
                  moments.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/duduk-harmonies">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <GiFlute className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Duduk Harmonies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Soulful and ancient duduk tunes for deep meditation and
                  introspection.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
          <Link href="/playlists/sufi-rhythms">
            <Card className="shadow-lg hover:shadow-xl smooth-transition cursor-pointer">
              <CardHeader>
                <FaPrayingHands className="h-10 w-10 text-accent mb-2" />
                <CardTitle className="font-headline">Sufi Rhythms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mystical and uplifting Sufi music to elevate your spirit and
                  connect.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
