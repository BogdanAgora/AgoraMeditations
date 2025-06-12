import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <AlertTriangle className="h-20 w-20 text-destructive mb-6" />
      <h1 className="text-4xl font-headline font-bold text-foreground mb-3">Blog Post Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the blog post you were looking for. It might have been moved or deleted.
      </p>
      <div className="flex gap-4">
        <Button asChild className="smooth-transition">
          <Link href="/blog">Back to Blog</Link>
        </Button>
        <Button asChild variant="outline" className="smooth-transition">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
