
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeVideoId: string;
}

export interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    date: string;
    excerpt: string;
    author?: string;
    image?: string; // Optional: path to cover image for the blog post
    tags?: string[];
  };
  content: string;
}
