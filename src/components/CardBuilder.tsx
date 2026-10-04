import React, { useState } from 'react';
import { Sparkles, Heart, Gift, RotateCw, Copy, Check, Palette, Type, Smile, Send } from 'lucide-react';
import { CardTheme, GreetingCardData } from '../types';
import { soundFx } from '../utils/audio';
import { burstConfettiAt } from '../utils/confetti';

const CARD_THEMES: CardTheme[] = [
  {
    id: 'rose-gold',
    name: 'Rose Romance',
    bgGradient: 'from-rose-500 via-pink-500 to-rose-600',
    cardBg: 'bg-gradient-to-br from-rose-50 via-white to-pink-50',
    textColor: 'text-rose-950',
    accentColor: '#e11d48',
    borderStyle: 'border-rose-200',
    envelopeColor: 'bg-rose-500',
  },
  {
    id: 'golden-glitter',
    name: 'Royal Gold',
    bgGradient: 'from-amber-400 via-yellow-500 to-amber-600',
    cardBg: 'bg-gradient-to-br from-amber-50 via-yellow-50/50 to-white',
    textColor: 'text-amber-950',
    accentColor: '#d97706',
    borderStyle: 'border-amber-200',
    envelopeColor: 'bg-amber-500',
  },
  {
    id: 'midnight-starlight',
    name: 'Starry Twilight',
    bgGradient: 'from-slate-900 via-indigo-950 to-purple-900',
    cardBg: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-indigo-100',
    textColor: 'text-indigo-100',
    accentColor: '#818cf8',
    borderStyle: 'border-indigo-800',
    envelopeColor: 'bg-indigo-900',
  },
  {
    id: 'pastel-bliss',
    name: 'Pastel Dream',
    bgGradient: 'from-pink-300 via-purple-300 to-indigo-300',
    cardBg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50',
    textColor: 'text-slate-800',
    accentColor: '#a855f7',
    borderStyle: 'border-purple-200',
    envelopeColor: 'bg-purple-400',
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Grace',
    bgGradient: 'from-teal-600 via-emerald-600 to-teal-800',
    cardBg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white',
    textColor: 'text-emerald-950',
    accentColor: '#059669',
    borderStyle: 'border-emerald-200',
    envelopeColor: 'bg-teal-600',
  },
];

const AVAILABLE_STICKERS = ['🎂', '💖', '🎈', '👑', '✨', '🌸', '🥂', '🎁', '🕊️', '💐', '🌟'];

const PRESET_MESSAGES = [
  "Wishing the most wonderful person in the world a day as dazzling, sweet, and unforgettable as you are! May all your heartfelt wishes come true this year.",
  "Happy Birthday Kuchipu! Thank you for blessing everyone around you with your bright smiles, infectious laughter, and that gentle grace you carry everywhere.",
  "To the one whose eyes hold so much kindness and whose heart is full of gold. May your 24 December birthday be filled with endless magic and sweet surprises!",
  "Here’s to another chapter of romanticising life, chasing big dreams, wearing your favorite colors, and smiling through every second. Have the happiest birthday!",
];

export const CardBuilder: React.FC = () => {
  const [themeId, setThemeId] = useState('rose-gold');
  const [recipient, setRecipient] = useState('Kuchipu');
  const [title, setTitle] = useState('Happy Birthday, Kuchipu!');
  const [message, setMessage] = useState(PRESET_MESSAGES[0]);
  const [signature, setSignature] = useState('With all our love & blessings ✨');
  const [stickers, setStickers] = useState<string[]>(['🎂', '💖', '✨']);
  const [fontFamily, setFontFamily] = useState<'cursive' | 'serif' | 'sans'>('cursive');

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const activeTheme = CARD_THEMES.find((t) => t.id === themeId) || CARD_THEMES[0];

  const handleToggleOpen = () => {
    soundFx.playChime();
    setIsOpen(!isOpen);
    if (!isOpen) {
      burstConfettiAt(0.5, 0.4);
    }
  };

  const handleAddSticker = (sticker: string) => {
    if (stickers.length >= 8) return;
    setStickers((prev) => [...prev, sticker]);
    soundFx.playChime();
  };

  const handleRemoveSticker = (index: number) => {
    setStickers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyWish = () => {
    const textToCopy = `${title}\n\nDear ${recipient},\n\n${message}\n\n${signature}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    soundFx.playChime();
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getFontClass = () => {
    if (fontFamily === 'cursive') return 'font-handwritten text-lg sm:text-xl leading-relaxed';
    if (fontFamily === 'serif') return 'font-display text-base sm:text-lg leading-relaxed';
    return 'font-sans text-sm sm:text-base leading-relaxed';
  };

  return (
    <section id="greeting-card" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 tracking-wider uppercase">
          <span>Creative Studio</span>
          <span aria-hidden="true">·</span>
          <span>Digital Greeting Card</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-display">
          Personalized Digital Greeting Card
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Design and personalize a keepsake card for Kuchipu. Choose colors, fonts, stickers, and heartfelt words, then preview the 3D envelope reveal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Live 3D Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gradient-to-b from-rose-50/60 to-amber-50/40 rounded-3xl p-6 sm:p-10 border border-rose-100 min-h-[540px]">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {isOpen ? 'Card Unfolded & Opened' : 'Tap Card or Button to Open'}
            </span>
            <button
              onClick={handleToggleOpen}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Close Card' : 'Open Envelope'}</span>
            </button>
          </div>

          {/* Interactive Envelope / 3D Card Stage */}
          <div
            onClick={handleToggleOpen}
            className="relative w-full max-w-md aspect-4/5 cursor-pointer perspective-1000 group select-none"
          >
            {/* The Greeting Card */}
            <div
              className={`w-full h-full rounded-2xl shadow-xl border ${activeTheme.borderStyle} ${activeTheme.cardBg} ${activeTheme.textColor} p-6 sm:p-8 flex flex-col justify-between transition-all duration-700 relative overflow-hidden transform ${
                isOpen
                  ? 'scale-100 translate-y-0 rotate-0 shadow-2xl'
                  : 'scale-95 translate-y-2 hover:scale-98 shadow-md'
              }`}
            >
              {/* Card Header & Decorative Border */}
              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between border-b border-current/15 pb-2">
                  <span className="text-[11px] uppercase tracking-widest font-semibold opacity-75">
                    December 24 · Special Edition
                  </span>
                  <div className="flex gap-1">
                    {stickers.slice(0, 3).map((stk, idx) => (
                      <span key={idx} className="text-lg animate-bounce" style={{ animationDelay: `${idx * 0.15}s` }}>
                        {stk}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight pt-1">
                  {title}
                </h3>
              </div>

              {/* Card Body & Handwritten Message */}
              <div className="my-auto py-4 relative z-10 space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold opacity-60">
                  Dearest {recipient},
                </p>
                <p className={`${getFontClass()} opacity-90`}>
                  {message}
                </p>
              </div>

              {/* Card Footer & Signature */}
              <div className="border-t border-current/15 pt-4 flex items-end justify-between relative z-10">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase tracking-wider opacity-60">Forever With Love</div>
                  <div className="font-handwritten text-lg sm:text-xl font-bold">{signature}</div>
                </div>

                {/* Additional Stickers placed on bottom right */}
                <div className="flex -space-x-1">
                  {stickers.slice(3).map((stk, idx) => (
                    <span key={idx} className="text-xl">
                      {stk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background ambient watermarks or corner flourishes */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-current opacity-5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-current opacity-5 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Quick Actions Under Preview */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleToggleOpen}
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>{isOpen ? 'Fold Card' : 'Open Envelope & Play Chime'}</span>
            </button>

            <button
              onClick={handleCopyWish}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Wish Text'}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Card Customizer Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Palette className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-lg font-display">
              Card Customizer
            </h3>
          </div>

          {/* 1. Theme Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              1. Theme Palette
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CARD_THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    setThemeId(th.id);
                    soundFx.playChime();
                  }}
                  className={`h-10 rounded-xl bg-gradient-to-br ${th.bgGradient} p-1 transition-all ${
                    themeId === th.id
                      ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 shadow-sm'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  title={th.name}
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Selected: {activeTheme.name}</p>
          </div>

          {/* 2. Typography Choice */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>2. Handwriting Style</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFontFamily('cursive')}
                className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                  fontFamily === 'cursive'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Cursive Script
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                  fontFamily === 'serif'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Classic Serif
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                  fontFamily === 'sans'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Modern Sans
              </button>
            </div>
          </div>

          {/* 3. Text Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Recipient
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Card Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Birthday Message
                </label>
                <div className="flex gap-1 text-[11px] text-rose-600 font-medium">
                  {PRESET_MESSAGES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMessage(PRESET_MESSAGES[i])}
                      className="hover:underline px-1 cursor-pointer"
                    >
                      Idea {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                From / Signature
              </label>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          {/* 4. Stickers Drawer */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5" />
                <span>3. Add Festive Stickers</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {stickers.length}/8 active
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STICKERS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => handleAddSticker(stk)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all text-lg flex items-center justify-center border border-slate-200/60"
                >
                  {stk}
                </button>
              ))}
            </div>

            {stickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {stickers.map((stk, idx) => (
                  <span
                    key={idx}
                    onClick={() => handleRemoveSticker(idx)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md text-xs cursor-pointer hover:bg-rose-100"
                    title="Click to remove sticker"
                  >
                    <span>{stk}</span>
                    <span className="text-[10px] text-slate-400">×</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
