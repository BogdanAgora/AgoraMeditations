import { notFound } from "next/navigation";
import { getPostData, getAllPostSlugs } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import BlogSummarizer from "@/components/BlogSummarizer";
import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import remarkParse from 'remark-parse';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map(path => ({ slug: path.params.slug }));
}

// Function to add alt attributes to images that don't have them
function addImageAltAttributes() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'image' && !node.alt) {
        // Use the filename as alt text, or a generic description
        const urlParts = node.url.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        node.alt = filename || 'Blog image';
      }
      
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    
    visit(tree);
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Ensure params is properly awaited
  const awaitedParams = await Promise.resolve(params);
  const post = await getPostData(awaitedParams.slug);

  if (!post) {
    return notFound();
  }

  // Process markdown content to HTML with alt attribute handling
  const processedContent = await remark()
    .use(remarkParse)
    .use(addImageAltAttributes)
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();

  // Format the date for display
  const dateString = typeof post.metadata.date === 'string' 
    ? new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : post.metadata.date instanceof Date
    ? post.metadata.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <article className="prose prose-lg dark:prose-invert">
          <h1>{post.metadata.title}</h1>
          <p className="text-muted-foreground text-lg">
            {post.metadata.excerpt}
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <span>{dateString}</span>
          </div>
          {post.metadata.image && (
            <Image
              src={post.metadata.image}
              alt={post.metadata.title || 'Blog post image'}
              width={800}
              height={400}
              className="w-full h-auto object-cover rounded-lg my-8"
            />
          )}
          <div 
            className="mt-8 blog-content prose prose-lg dark:prose-invert prose-headings:mt-8 prose-headings:mb-6 prose-p:mt-4 prose-p:mb-4"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
        <div className="mt-12 pt-8 border-t flex justify-center">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              ← Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}