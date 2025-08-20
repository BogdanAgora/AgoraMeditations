import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, UserCircle } from 'lucide-react';

interface BlogPostCardProps {
  post: Omit<BlogPost, 'content'>;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Ensure date is a string or convert it to a string
  const dateString = typeof post.metadata.date === 'string' 
    ? new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : post.metadata.date instanceof Date
    ? post.metadata.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl smooth-transition">
      {post.metadata.image && (
        <Link href={`/blog/${post.slug}`} className="block aspect-video relative">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title || 'Blog post image'}
              layout="fill"
              objectFit="cover"
            />
        </Link>
      )}
      <CardHeader>
        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="text-2xl font-headline hover:text-primary smooth-transition line-clamp-2">
            {post.metadata.title}
          </CardTitle>
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            <span>{dateString}</span>
          </div>
          {post.metadata.author && (
            <div className="flex items-center gap-1">
              <UserCircle className="h-3 w-3" />
              <span>{post.metadata.author}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{post.metadata.excerpt}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 text-primary hover:text-primary/80 smooth-transition">
          <Link href={`/blog/${post.slug}`}>Read More &rarr;</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
