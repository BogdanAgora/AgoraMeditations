
import type { Video } from '@/lib/types';
import { NextResponse } from 'next/server';

const videos: Video[] = [
  {
    id: '1',
    title: 'Eternal OM CHANT for Deep Meditation, Positive Energy, Stress Relief and Inner Peace',
    description: 'Immerse yourself in the sacred sound of the OM chant, a timeless mantra renowned for its profound healing and spiritual benefits. This eternal OM chant is meticulously crafted to guide you into deep meditation, cultivate positive energy, alleviate stress, and foster inner peace.',
    thumbnailUrl: 'https://i.ytimg.com/vi/CtlQRv_Xmb0/hqdefault.jpg',
    youtubeVideoId: 'CtlQRv_Xmb0',
    thumbnailAiHint: 'om chant meditation',
  },
  {
    id: '2',
    title: 'Ocean Whisper 🌊 Beautiful Calming Piano Music & Sea Waves 🌅 Fall asleep, Deep Sleep, Meditation',
    description: 'Let the soothing sounds of ocean waves and calming piano melodies wash over you. This beautiful music is perfect for falling asleep, deep sleep, meditation, and stress relief.',
    thumbnailUrl: 'https://i.ytimg.com/vi/_5oJYqRZxA8/hqdefault.jpg',
    youtubeVideoId: '_5oJYqRZxA8',
    thumbnailAiHint: 'ocean piano waves',
  },
  {
    id: '3',
    title: 'The Path of Surrender ✨Sufi Ney Flute Music for Peace ✨ Mystical Night Prayers & Meditation',
    description: 'Experience the profound peace of surrender with the mystical sounds of the Sufi Ney flute. This music is ideal for night prayers, meditation, and finding solace.',
    thumbnailUrl: 'https://i.ytimg.com/vi/Y7n8T0LDXRI/hqdefault.jpg',
    youtubeVideoId: 'Y7n8T0LDXRI',
    thumbnailAiHint: 'sufi flute peace',
  },
  {
    id: '4',
    title: 'Peaceflow ✨ Relaxing Piano Music for Peaceful Moments 🌄 Sleep, Fall Asleep, Meditation',
    description: 'Find your peaceflow with this collection of relaxing piano music. Designed for peaceful moments, this selection will help you sleep, fall asleep faster, and enhance your meditation practice.',
    thumbnailUrl: 'https://i.ytimg.com/vi/h6A-ShLgDBM/hqdefault.jpg',
    youtubeVideoId: 'h6A-ShLgDBM',
    thumbnailAiHint: 'relaxing piano peaceful',
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

