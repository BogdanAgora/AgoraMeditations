import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from './types';

const postsDirectory = path.join(process.cwd(), 'public', 'blogposts');

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
  const directories = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  return directories.map(dir => {
    return {
      params: {
        slug: encodeURIComponent(dir),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  // Decode the slug to handle spaces and special characters
  const decodedSlug = decodeURIComponent(slug);
  // Create the path using the decoded slug for file system access
  const fullPath = path.join(postsDirectory, decodedSlug);
  
  // Check if directory exists
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const files = fs.readdirSync(fullPath);

  const markdownFile = files.find(file => file.endsWith('.md') || file.endsWith('.mdx'));

  if (!markdownFile) {
    return null;
  }

  const markdownPath = path.join(fullPath, markdownFile);
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
  // Create a proper URL path for the image
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
}