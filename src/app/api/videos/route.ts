import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const videos: Video[] = [
  {
    id: '1',
    title: 'Miracle Healing Frequencies | Sound Bath Meditation for Deep Sleep and Stress Relief | Solfeggio 528Hz',
    description: 'Experience the profound healing power of miracle frequencies with this sound bath meditation. Designed for deep sleep and stress relief, this session features the Solfeggio 528Hz frequency, known for its ability to repair DNA, promote transformation, and bring miracles.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual thumbnail
    youtubeVideoId: '_5oJYqRZxA8',
    thumbnailAiHint: 'sound bath healing',
  },
  {
    id: '2',
    title: 'Duduk Relaxing Music - Meditation, Sleep, Stress Relief Music - Armenian Soul',
    description: 'Immerse yourself in the soulful melodies of the Duduk with this relaxing music compilation. Perfect for meditation, deep sleep, and stress relief, these ancient Armenian tunes will transport you to a state of tranquility and peace.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual thumbnail
    youtubeVideoId: 'Y7n8T0LDXRI',
    thumbnailAiHint: 'duduk music relaxation',
  },
  {
    id: '3',
    title: 'Emotional Piano Music for Stress Relief & Deep Sleep | Beautiful Relaxing Music for Meditation & Study',
    description: 'Immerse yourself in this beautiful and emotional piano music, perfect for stress relief, deep sleep, meditation, and study. Let the soothing melodies wash over you, calming your mind and uplifting your spirit.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual thumbnail
    youtubeVideoId: 'h6A-ShLgDBM',
    thumbnailAiHint: 'piano emotional music',
  },
  {
    id: '4',
    title: 'Tibetan Singing Bowls Music For Meditation, Healing, Relaxation, Stress Relief | Agora Meditation',
    description: 'Experience the healing power of Tibetan singing bowls. Ideal for meditation, relaxation, and stress relief. From Agora Meditation.',
    thumbnailUrl: 'https://placehold.co/640x360.png', // Replace with actual thumbnail
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
