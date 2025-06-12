import Link from 'next/link';
import Image from 'next/image';
import { Youtube, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 smooth-transition">
          <Image 
            src="/Agora_logo_bkg_negru.png" 
            alt="AgoraMeditation Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8"
            data-ai-hint="logo" 
          />
          <h1 className="text-2xl font-headline font-bold text-foreground">
            AgoraMeditation
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild className="smooth-transition">
            <Link href="/videos" className="flex items-center gap-1">
              <Youtube className="h-5 w-5" />
              Videos
            </Link>
          </Button>
          <Button variant="ghost" asChild className="smooth-transition">
            <Link href="/blog" className="flex items-center gap-1">
              <BookOpen className="h-5 w-5" />
              Blog
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
