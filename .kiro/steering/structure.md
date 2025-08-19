# Project Structure

## Root Directory
- **src/** - Main application source code
- **public/** - Static assets (images, icons)
- **docs/** - Project documentation
- **.kiro/** - Kiro AI assistant configuration
- **node_modules/** - Dependencies

## Source Code Organization (`src/`)

### Application Routes (`src/app/`)
- **page.tsx** - Homepage
- **layout.tsx** - Root layout component
- **globals.css** - Global styles
- **blog/** - Blog-related pages and routes
  - **[slug]/page.tsx** - Dynamic blog post pages
  - **page.tsx** - Blog listing page
- **videos/** - Video content pages
- **playlists/** - Playlist pages with dynamic routes
- **api/** - API routes (Next.js App Router)

### AI Integration (`src/ai/`)
- **genkit.ts** - Genkit AI configuration and setup
- **dev.ts** - Development AI server entry point
- **flows/** - AI workflow definitions
  - **generate-blog-from-yt-transcript.ts** - YouTube to blog conversion
  - **summarize-blog-post.ts** - Blog summarization

### Components (`src/components/`)
- **ui/** - shadcn/ui component library
- **BlogPostCard.tsx** - Blog post display component
- **BlogSummarizer.tsx** - AI-powered blog summarization
- **VideoCard.tsx** - Video content display
- **Header.tsx** / **Footer.tsx** - Layout components

### Content (`src/content/`)
- **blog/** - Markdown blog posts with frontmatter metadata

### Utilities (`src/lib/`)
- **types.ts** - TypeScript type definitions
- **utils.ts** - Utility functions
- **blog.ts** - Blog-related helper functions

### Hooks (`src/hooks/`)
- **use-mobile.tsx** - Mobile detection hook
- **use-toast.ts** - Toast notification hook

## Key Conventions
- Use TypeScript for all source files
- Components use `.tsx` extension
- Utilities and configs use `.ts` extension
- Blog content stored as Markdown with frontmatter
- AI flows organized by functionality
- shadcn/ui components in dedicated `ui/` folder
- Path aliases configured: `@/` maps to `src/`