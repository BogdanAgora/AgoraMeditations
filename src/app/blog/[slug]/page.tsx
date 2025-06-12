import { getPostData, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, UserCircle, Tag } from 'lucide-react';
import BlogSummarizer from '@/components/BlogSummarizer';
import { Badge } from '@/components/ui/badge';

// This function is needed for Next.js to know which slugs are available at build time.
export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map(p => ({ slug: p.params.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.metadata.title} | AgoraMeditation Blog`,
    description: post.metadata.excerpt,
  };
}

// Helper to convert basic markdown to HTML (very simplified)
function簡易MarkdownToHtml(markdown: string) {
  // Replace newlines with <br /> for paragraphs
  let html = markdown
    .split(/\n\s*\n/) // Split by double newlines (paragraphs)
    .map(paragraph => `<p class="mb-4 text-lg leading-relaxed">${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');

  // Replace ## headers
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed">## (.*?)<\/p>/g, '<h2 class="text-2xl font-headline font-semibold mt-6 mb-3">$1</h2>');
  // Replace ### headers
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed">### (.*?)<\/p>/g, '<h3 class="text-xl font-headline font-semibold mt-5 mb-2">$1</h3>');
  
  // Basic bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Basic lists (unordered)
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed">\s*-\s(.*?)(?:<br \/>|$)/gm, (match, item) => {
    // Check if it's part of a list or a standalone paragraph starting with '-'
    // This is tricky without proper parsing. This simplistic approach might misinterpret things.
    // For now, assume if it starts with '-' it's a list item.
    return `<li class="ml-5 list-disc mb-1">${item.trim()}</li>`;
  });
  // Wrap <li>s in <ul>, this is a hack and might not work correctly for complex structures
  html = html.replace(/(<li.*?>.*?<\/li>)+/gs, (match) => `<ul class="mb-4">${match}</ul>`);
  // Remove <p> tags around <ul>
  html = html.replace(/<p class="mb-4 text-lg leading-relaxed">(<ul class="mb-4">.*?<\/ul>)<\/p>/gs, '$1');


  return html;
}


export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = 簡易MarkdownToHtml(post.content);

  return (
    <article className="max-w-3xl mx-auto py-8">
      {post.metadata.image && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            width={800}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="blog hero image"
            priority
          />
        </div>
      )}
      
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">{post.metadata.title}</h1>
      
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        {post.metadata.author && (
          <div className="flex items-center gap-1">
            <UserCircle className="h-4 w-4" />
            <span>By {post.metadata.author}</span>
          </div>
        )}
      </div>

      {post.metadata.tags && post.metadata.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.metadata.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}
      
      <div className="prose prose-lg max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: htmlContent }} />

      <BlogSummarizer markdownContent={post.content} />
      
    </article>
  );
}
