import fs from 'fs';
import path from 'path';
import type { BlogPost } from './types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

// Basic frontmatter parser
function parseFrontmatter(fileContent: string): { metadata: BlogPost['metadata']; content: string } {
  const match = fileContent.match(/^---\s*([\s\S]*?)\s*---/);
  
  const defaultMetadata: BlogPost['metadata'] = {
    title: 'Untitled Post',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
  };

  if (!match) {
    return { metadata: defaultMetadata, content: fileContent };
  }

  const frontmatter = match[1];
  const content = fileContent.substring(match[0].length).trim();
  
  const metadata = { ...defaultMetadata };

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^['"](.*)['"]$/, '$1'); // Remove surrounding quotes
      if (key.trim() === 'tags' && value) {
        (metadata as any)[key.trim()] = value.split(',').map(tag => tag.trim());
      } else {
        (metadata as any)[key.trim()] = value;
      }
    }
  });

  return { metadata: metadata as BlogPost['metadata'], content };
}


export function getSortedPostsData(): Omit<BlogPost, 'content'>[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { metadata } = parseFrontmatter(fileContents);
      return {
        slug,
        metadata,
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.metadata.date < b.metadata.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getPostData(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content } = parseFrontmatter(fileContents);

    // For simplicity, markdown content is returned as is.
    // In a real app, you'd convert markdown to HTML here (e.g., using 'remark' or 'unified').
    return {
      slug,
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}
