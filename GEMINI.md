# Project Overview

This is a Next.js project that serves as a web application for AgoraMeditations. It integrates with the YouTube API to display videos and playlists, and it uses a generative AI model to create blog posts from video transcripts.

## Key Technologies

*   **Next.js:** A React framework for building server-side rendered and statically generated web applications.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **Genkit:** A framework for building AI-powered applications.
*   **YouTube API:** Used to fetch video and playlist data from the AgoraMeditations YouTube channel.

## Architecture

The application is structured as a standard Next.js project.

*   `src/app`: Contains the main application pages, including the home page, blog pages, video pages, and playlist pages.
*   `src/components`: Contains reusable React components used throughout the application.
*   `src/lib`: Contains utility functions and services, including the `youtube.ts` service for interacting with the YouTube API.
*   `src/ai`: Contains the AI-related code, including the Genkit configuration and flows.
*   `public`: Contains static assets, such as images and fonts.

# Building and Running

## Prerequisites

*   Node.js (version 20 or higher)
*   npm

## Installation

1.  Install the dependencies:

    ```bash
    npm install
    ```

2.  Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    YOUTUBE_API_KEY=your_youtube_api_key
    ```

## Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
```

## Running Tests

```bash
npm run test
```

# Development Conventions

*   **Coding Style:** The project uses the default Next.js coding style, with TypeScript and Prettier for code formatting.
*   **Testing:** The project uses Vitest for unit and integration tests. Test files are located in the `__tests__` directories alongside the files they test.
*   **Commits:** Commit messages should follow the Conventional Commits specification.
