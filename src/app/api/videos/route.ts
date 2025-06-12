import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

// Placeholder video data. In a real application, this might come from a database or external API.
const videos: Video[] = [
  {
    id: '1',
    title: '10 Minute Guided Morning Meditation',
    description: 'Start your day with peace and clarity. This 10-minute guided meditation will help you set a positive intention for the day ahead.',
    thumbnailUrl: 'https://placehold.co/640x360.png',
    youtubeVideoId: 'VIDEO_ID_1', 
  },
  {
    id: '2',
    title: 'Relaxing Nature Sounds for Sleep & Stress Relief',
    description: 'Immerse yourself in the calming sounds of nature. Perfect for falling asleep, reducing stress, or finding focus during work or study.',
    thumbnailUrl: 'https://placehold.co/640x360.png',
    youtubeVideoId: 'VIDEO_ID_2', 
  },
  {
    id: '3',
    title: 'Mindfulness Meditation for Beginners',
    description: 'New to meditation? This guided session will introduce you to the basics of mindfulness and help you cultivate present moment awareness.',
    thumbnailUrl: 'https://placehold.co/640x360.png',
    youtubeVideoId: 'VIDEO_ID_3', 
  },
  {
    id: '4',
    title: 'Calming Ambient Music for Deep Relaxation',
    description: 'Unwind with this soothing ambient music, designed to promote deep relaxation and tranquility. Ideal for meditation, yoga, or simply unwinding.',
    thumbnailUrl: 'https://placehold.co/640x360.png',
    youtubeVideoId: 'VIDEO_ID_4', 
  },
];

export async function GET() {
  try {
    // In a real app, you might fetch this data from a database or external service
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ message: 'Failed to load videos' }, { status: 500 });
  }
}
