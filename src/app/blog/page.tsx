import { getSortedPostsData } from '@/lib/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { BookOpen } from 'lucide-react';

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-foreground">AgoraMeditations Blog</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
          Insights, tips, and reflections on mindfulness, meditation, and well-being.
        </p>
      </div>

      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No blog posts found. Check back soon!</p>
      )}
    </div>
  );
}
