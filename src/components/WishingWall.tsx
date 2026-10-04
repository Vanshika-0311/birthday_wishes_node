import React, { useState, useEffect } from 'react';
import { Heart, Send, Sparkles, MessageSquareHeart } from 'lucide-react';
import { BirthdayWish } from '../types';
import { soundFx } from '../utils/audio';
import { burstHeartsAt, burstConfettiAt } from '../utils/confetti';

const INITIAL_WISHES: BirthdayWish[] = [
  {
    id: 'w1',
    author: 'Deepa’s Bestie',
    text: 'Happy Birthday Kuchipu! Never stop romanticising your beautiful life. You bring so much sunshine wherever you go! 🌸💖',
    color: 'bg-rose-50 border-rose-200 text-rose-950',
    timestamp: 'Just now',
    hearts: 34,
  },
  {
    id: 'w2',
    author: 'Secret Admirer',
    text: 'Those silent eyes truly speak volumes. May your 24 December birthday be as radiant and mesmerizing as you are. ✨',
    color: 'bg-amber-50 border-amber-200 text-amber-950',
    timestamp: '1 hour ago',
    hearts: 48,
  },
  {
    id: 'w3',
    author: 'Soul Sister',
    text: 'To my forever partner in crime: may this year bring endless adventures, cozy vibes, and all the love you deserve. Happy Birthday! 🎂🥂',
    color: 'bg-purple-50 border-purple-200 text-purple-950',
    timestamp: '2 hours ago',
    hearts: 29,
  },
  {
    id: 'w4',
    author: 'Family With Love',
    text: 'Seeing you happy and laughing in your beautiful saree is our greatest joy. God bless you always, our dearest Kuchipu. ❤️',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    timestamp: 'Yesterday',
    hearts: 52,
  },
];

const NOTE_COLORS = [
  { id: 'rose', bg: 'bg-rose-50 border-rose-200 text-rose-950', label: 'Rose Pink' },
  { id: 'amber', bg: 'bg-amber-50 border-amber-200 text-amber-950', label: 'Warm Gold' },
  { id: 'purple', bg: 'bg-purple-50 border-purple-200 text-purple-950', label: 'Lavender' },
  { id: 'emerald', bg: 'bg-emerald-50 border-emerald-200 text-emerald-950', label: 'Fresh Mint' },
  { id: 'sky', bg: 'bg-sky-50 border-sky-200 text-sky-950', label: 'Sky Blue' },
];

export const WishingWall: React.FC = () => {
  const [wishes, setWishes] = useState<BirthdayWish[]>(() => {
    try {
      const saved = localStorage.getItem('kuchipu_wishing_wall');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_WISHES;
  });

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].bg);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('kuchipu_wishing_wall', JSON.stringify(wishes));
    } catch {
      // ignore
    }
  }, [wishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newWish: BirthdayWish = {
      id: `wish_${Date.now()}`,
      author: author.trim() || 'A Well-Wisher',
      text: text.trim(),
      color: selectedColor,
      timestamp: 'Just now',
      hearts: 1,
    };

    setWishes((prev) => [newWish, ...prev]);
    soundFx.playChime();
    burstConfettiAt(0.5, 0.5);

    setAuthor('');
    setText('');
  };

  const handleHeartWish = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (rect.left + rect.width / 2) / window.innerWidth;
    const yNorm = (rect.top + rect.height / 2) / window.innerHeight;

    burstHeartsAt(xNorm, yNorm);
    soundFx.playChime();

    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const isLiked = likedMap[id];
          return { ...w, hearts: isLiked ? w.hearts - 1 : w.hearts + 1 };
        }
        return w;
      })
    );
  };

  return (
    <section id="wishes" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 tracking-wider uppercase">
          <span>Community Warmth</span>
          <span aria-hidden="true">·</span>
          <span>Wishing Wall</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-display">
          Heartfelt Birthday Notes for Kuchipu
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Leave a sweet note, blessing, or happy memory on Kuchipu&apos;s digital birthday wall.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Composer */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageSquareHeart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-base font-display">
              Pin a Wish for Kuchipu
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Your Name / Nickname
              </label>
              <input
                type="text"
                placeholder="e.g. Secret Admirer, Bestie, Maya"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Your Birthday Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your wishes, blessings, or sweet memories for Kuchipu..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Note Color
              </label>
              <div className="flex gap-2">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.bg)}
                    className={`w-7 h-7 rounded-full border transition-all ${
                      selectedColor === c.bg ? 'ring-2 ring-slate-900 scale-110' : 'opacity-70 hover:opacity-100'
                    } ${c.bg}`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pin Note to Wall</span>
            </button>
          </form>
        </div>

        {/* Sticky Notes Wall Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishes.map((wish) => {
            const isLiked = likedMap[wish.id];
            return (
              <div
                key={wish.id}
                className={`p-5 rounded-2xl border shadow-xs transition-transform hover:-translate-y-1 relative flex flex-col justify-between space-y-3 ${wish.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs opacity-75 border-b border-current/15 pb-1.5">
                    <span className="font-semibold">{wish.author}</span>
                    <span>{wish.timestamp}</span>
                  </div>

                  <p className="font-handwritten text-lg leading-snug">
                    {wish.text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-current/15">
                  <span className="text-[11px] opacity-60">To Kuchipu on 24 Dec</span>

                  <button
                    type="button"
                    onClick={(e) => handleHeartWish(e, wish.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-100 opacity-80 transition-opacity"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-rose-600 text-rose-600' : 'text-current'
                      }`}
                    />
                    <span className="tabular-nums">{wish.hearts}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
