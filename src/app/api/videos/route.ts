
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const videos: Video[] = [
  {
    id: '1',
    title: 'Mystical Prayer in the Desert ✨ Sufi Ney Flute Meditation ✨ Timeless Tranquility & Inner Peace',
    description: 'Embark on a mystical journey with the enchanting sounds of the Sufi Ney flute. This meditation music is designed to evoke timeless tranquility and deep inner peace.',
    thumbnailUrl: 'https://i.ytimg.com/vi/f_a7yX9xPbk/hqdefault.jpg',
    youtubeVideoId: 'f_a7yX9xPbk',
    thumbnailAiHint: 'sufi ney flute',
  },
  {
    id: '2',
    title: 'Ocean Whisper 🌊 Beautiful Calming Piano Music & Sea Waves 🌅 Fall asleep, Deep Sleep, Meditation',
    description: 'Let the soothing sounds of ocean waves and calming piano melodies wash over you. This beautiful music is perfect for falling asleep, deep sleep, meditation, and stress relief.',
    thumbnailUrl: 'https://i.ytimg.com/vi/_5oJYqRZxA8/hqdefault.jpg',
    youtubeVideoId: '_5oJYqRZxA8',
    thumbnailAiHint: 'ocean piano music',
  },
  {
    id: '3',
    title: 'The Path of Surrender ✨Sufi Ney Flute Music for Peace ✨ Mystical Night Prayers & Meditation',
    description: 'Experience the profound peace of surrender with the mystical sounds of the Sufi Ney flute. This music is ideal for night prayers, meditation, and finding solace.',
    thumbnailUrl: 'https://i.ytimg.com/vi/Y7n8T0LDXRI/hqdefault.jpg',
    youtubeVideoId: 'Y7n8T0LDXRI',
    thumbnailAiHint: 'sufi meditation peace',
  },
  {
    id: '4',
    title: 'Peaceflow ✨ Relaxing Piano Music for Peaceful Moments 🌄 Sleep, Fall Asleep, Meditation',
    description: 'Find your peaceflow with this collection of relaxing piano music. Designed for peaceful moments, this selection will help you sleep, fall asleep faster, and enhance your meditation practice.',
    thumbnailUrl: 'https://i.ytimg.com/vi/h6A-ShLgDBM/hqdefault.jpg',
    youtubeVideoId: 'h6A-ShLgDBM',
    thumbnailAiHint: 'relaxing piano meditation',
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
