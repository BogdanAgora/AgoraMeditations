import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const videos: Video[] = [
  {
    id: '1',
    title: 'Instrumental Relaxing Music For Stress Relief, Sleep, Meditation, Spa, Study | Agora Meditation',
    description: 'Relaxing instrumental music to help you de-stress, sleep better, meditate deeply, enjoy a spa-like experience, or focus on your studies. Brought to you by Agora Meditation.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual: https://i.ytimg.com/vi/Z_PEWX6FPV8/hqdefault.jpg
    youtubeVideoId: 'Z_PEWX6FPV8',
    thumbnailAiHint: 'instrumental music relaxation',
  },
  {
    id: '2',
    title: 'Muzica De Relaxare Cu Sunete Din Natura Pentru Somn Linistititor Si Reducerea Stresului',
    description: 'Soothing relaxing music with nature sounds for restful sleep and stress reduction. Ideal for unwinding and finding peace.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual: https://i.ytimg.com/vi/xV72M7r7xWw/hqdefault.jpg
    youtubeVideoId: 'xV72M7r7xWw',
    thumbnailAiHint: 'nature sounds sleep',
  },
  {
    id: '3',
    title: 'Relaxing Music With Ocean Sounds For Deep Sleep, Stress Relief, Meditation | Agora Meditation',
    description: 'Calming music combined with ocean sounds, perfect for deep sleep, stress relief, and meditation. By Agora Meditation.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual: https://i.ytimg.com/vi/oAHT0CFuY3g/hqdefault.jpg
    youtubeVideoId: 'oAHT0CFuY3g',
    thumbnailAiHint: 'ocean waves meditation',
  },
  {
    id: '4',
    title: 'Tibetan Singing Bowls Music For Meditation, Healing, Relaxation, Stress Relief | Agora Meditation',
    description: 'Experience the healing power of Tibetan singing bowls. Ideal for meditation, relaxation, and stress relief. From Agora Meditation.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual: https://i.ytimg.com/vi/Q2pS-F3jS3E/hqdefault.jpg
    youtubeVideoId: 'Q2pS-F3jS3E',
    thumbnailAiHint: 'singing bowls healing',
  },
];

export async function GET() {
  try {
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ message: 'Failed to load videos' }, { status: 500 });
  }
}
