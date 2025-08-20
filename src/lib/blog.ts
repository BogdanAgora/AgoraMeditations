import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types';

// Use a more flexible approach for determining the posts directory
const postsDirectory = path.join(
  process.cwd(), 
  process.env.NODE_ENV === 'development' ? 'src/content/blogposts' : 'src/content/blogposts'
);

// Function to extract title from markdown content
function extractTitleFromContent(content: string): string | null {
  // Look for a line starting with \"**Blog Post Title:**\" or \"**Blog Post:**\"
  const titleMatch = content.match(/\*\*Blog Post(?: Title)?:\*\*\s*(.+?)(?:\n|$)/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // If not found, try to get the first heading
  const headingMatch = content.match(/^#\s+(.+?)(?:\n|$)/m);
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim();
  }
  
  return null;
}

export function getSortedPostsData(): Omit<BlogPost, 'content'>[] {
  const directories = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const allPostsData = directories.map(dir => {
    const fullPath = path.join(postsDirectory, dir);
    const files = fs.readdirSync(fullPath);

    const markdownFile = files.find(file => file.endsWith('.md') || file.endsWith('.mdx'));
    const imageFile = files.find(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));

    if (!markdownFile) {
      return null;
    }

    const slug = encodeURIComponent(dir);
    const markdownPath = path.join(fullPath, markdownFile);
    const fileContents = fs.readFileSync(markdownPath, 'utf8');
    
    // Get file creation time
    const fileStats = fs.statSync(markdownPath);
    const fileCreationDate = fileStats.birthtime;
    
    const { data, content } = matter(fileContents);
    
    // Extract title from content if not in frontmatter
    const title = data.title || extractTitleFromContent(content) || dir;
    
    // Use date from frontmatter or file creation date
    const date = data.date || fileCreationDate;

    // Create a proper URL path for the image
    const image = imageFile ? `/blogposts/${encodeURIComponent(dir)}/${encodeURIComponent(imageFile)}` : null;

    return {
      slug,
      metadata: { 
        ...data, 
        title,
        date,
        image 
      } as BlogPost['metadata'],
    };
  }).filter(post => post !== null) as Omit<BlogPost, 'content'>[];

  return allPostsData.sort((a, b) => {
    if (a.metadata.date < b.metadata.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  // For Vercel deployment, we need to handle this differently
  // We'll use a more robust approach that works in serverless environments
  
  // Check if we're in a serverless environment
  if (typeof window !== 'undefined') {
    // We're in the browser, return empty array
    return [];
  }
  
  try {
    const directories = fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return directories.map(dir => {
      return {
        params: {
          // Don't encode here, let Next.js handle it
          slug: dir,
        },
      };
    });
  } catch (error) {
    console.error('Error reading blog post directories:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  try {
    // For Vercel deployments, we need to be careful about encoding
    // The slug might already be decoded, or it might be encoded
    let decodedSlug = slug;
    
    // Try to decode it, but catch if it's already decoded
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch (e) {
      // If it fails, it's likely already decoded
      decodedSlug = slug;
    }
    
    // Create the path using the decoded slug for file system access
    const fullPath = path.join(postsDirectory, decodedSlug);
    
    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Blog post directory not found: ${fullPath}`);
      // Try with the original slug as well
      const altPath = path.join(postsDirectory, slug);
      if (!fs.existsSync(altPath)) {
        console.error(`Alternative blog post directory not found: ${altPath}`);
        return null;
      }
      // Use the alternative path
      console.log(`Using alternative path: ${altPath}`);
    }
    
    const finalPath = fs.existsSync(fullPath) ? fullPath : path.join(postsDirectory, slug);
    const files = fs.readdirSync(finalPath);

    const markdownFile = files.find(file => file.endsWith('.md') || file.endsWith('.mdx'));

    if (!markdownFile) {
      console.error(`No markdown file found in directory: ${finalPath}`);
      return null;
    }

    const markdownPath = path.join(finalPath, markdownFile);
    const fileContents = fs.readFileSync(markdownPath, 'utf8');
    
    // Get file creation time
    const fileStats = fs.statSync(markdownPath);
    const fileCreationDate = fileStats.birthtime;
    
    const { data, content } = matter(fileContents);
    
    // Extract title from content if not in frontmatter
    const title = data.title || extractTitleFromContent(content) || slug;
    
    // Use date from frontmatter or file creation date
    const date = data.date || fileCreationDate;

    const imageFile = files.find(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
    // Create a proper URL path for the image (still served from public directory)
    const image = imageFile ? `/blogposts/${slug}/${encodeURIComponent(imageFile)}` : null;

    // Process content to remove the title if it's at the beginning
    let processedContent = content;
    const titleFromContent = extractTitleFromContent(content);
    if (titleFromContent) {
      // Remove the title line from the content
      processedContent = content.replace(/\*\*Blog Post(?: Title)?:\*\*\s*.+/, '').trim();
    }

    return {
      slug,
      metadata: { 
        ...data, 
        title,
        date,
        image 
      } as BlogPost['metadata'],
      content: processedContent,
    };
  } catch (error) {
    console.error(`Error loading blog post with slug ${slug}:`, error);
    return null;
  }
}