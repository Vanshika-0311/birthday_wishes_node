export interface PhotoMemory {
  id: string;
  url: string;
  title: string;
  caption: string;
  instagramTag?: string;
  dateStr: string;
  likes: number;
  category: 'portrait' | 'aesthetic' | 'memories' | 'festive';
}

export interface CardTheme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  envelopeColor: string;
}

export interface GreetingCardData {
  themeId: string;
  title: string;
  recipient: string;
  message: string;
  signature: string;
  stickers: string[];
  fontFamily: 'serif' | 'cursive' | 'sans';
}

export interface BirthdayWish {
  id: string;
  author: string;
  text: string;
  color: string;
  timestamp: string;
  hearts: number;
}
