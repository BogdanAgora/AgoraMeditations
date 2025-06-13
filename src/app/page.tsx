import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube, BookOpen, Sunrise, Music, ListMusic } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg shadow-lg">
        <div className="container mx-auto px-4">
          <Sunrise className="mx-auto h-24 w-24 text-primary mb-6" />
          <h1 className="text-5xl font-headline font-bold text-foreground mb-4">
            Welcome to AgoraMeditations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover a sanctuary for your mind. Explore guided meditations, soothing nature videos, and insightful articles to cultivate inner peace and mindfulness.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="smooth-transition bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/videos">
                <Youtube className="mr-2 h-5 w-5" />
                Explore Videos
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="smooth-transition border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                Read Our Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">
            Find Your Calm
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our curated collection of YouTube videos offers serene landscapes, calming music, and guided meditation sessions to help you relax, de-stress, and find focus.
          </p>
          <Button asChild className="smooth-transition">
            <Link href="/videos">
              Start Watching
            </Link>
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Calm scenery"
            data-ai-hint="calm scenery"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
         <div className="rounded-lg overflow-hidden shadow-xl md:order-last">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Person meditating"
            data-ai-hint="person meditating"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-headline font-semibold text-foreground mb-4">
            Nourish Your Mind
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our AgoraMeditations blog features articles on mindfulness practices, meditation benefits, and tips for integrating tranquility into your daily life. Content is crafted with care, supported by AI insights.
          </p>
          <Button asChild className="smooth-transition">
            <Link href="/blog">
              Explore Articles
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-headline font-semibold text-center text-foreground mb-8">
          Explore Our Playlists
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl smooth-transition">
            <CardHeader>
              <Music className="h-10 w-10 text-accent mb-2" />
              <CardTitle className="font-headline">Piano Melodies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Calming piano pieces for relaxation, focus, and peaceful moments.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl smooth-transition">
            <CardHeader>
              <Image src="https://placehold.co/48x48.png" alt="Duduk Playlist Icon" data-ai-hint="duduk instrument" width={40} height={40} className="mb-2 rounded-sm" />
              <CardTitle className="font-headline">Duduk Harmonies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Soulful and ancient duduk tunes for deep meditation and introspection.</CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl smooth-transition">
            <CardHeader>
              <ListMusic className="h-10 w-10 text-accent mb-2" />
              <CardTitle className="font-headline">Sufi Rhythms</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Mystical and uplifting Sufi music to elevate your spirit and connect.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
