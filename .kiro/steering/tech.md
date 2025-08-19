# Technology Stack

## Core Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

## AI Integration
- **Google Genkit** - AI framework for content generation
- **@genkit-ai/googleai** - Google AI integration
- **Gemini 2.0 Flash** - Default AI model

## UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Headless component primitives
- **Lucide React** - Icon library
- **tailwindcss-animate** - Animation utilities

## Development Tools
- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting (build errors ignored)
- **PostCSS** - CSS processing

## Common Commands

### Development
```bash
npm run dev          # Start development server on port 9002 with Turbopack
npm run genkit:dev   # Start Genkit AI development server
npm run genkit:watch # Start Genkit with file watching
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
```

## Configuration Notes
- TypeScript build errors are ignored in production builds
- ESLint errors are ignored during builds
- Remote images allowed from `dummyimage.com` and `i.ytimg.com`
- Custom port 9002 for development server