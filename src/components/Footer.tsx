import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { launchMassiveCelebration } from '../utils/confetti';
import { soundFx } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-rose-100 bg-white/70 backdrop-blur-xs py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-base font-bold font-display text-rose-950">
            Happy Birthday, Kuchipu!
          </div>
          <p className="text-xs text-slate-500">
            Celebrating 24 December with all our warmest memories and blessings.
          </p>
        </div>

        {/* Clean nav links */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <a href="#countdown" className="hover:text-rose-600 transition-colors">
            Countdown
          </a>
          <a href="#memories" className="hover:text-rose-600 transition-colors">
            Photo Memories
          </a>
          <a href="#greeting-card" className="hover:text-rose-600 transition-colors">
            Card Studio
          </a>
          <a href="#virtual-cake" className="hover:text-rose-600 transition-colors">
            Birthday Cake
          </a>
          <a href="#wishes" className="hover:text-rose-600 transition-colors">
            Wishing Wall
          </a>
        </div>

        {/* Final celebration action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playChime();
              launchMassiveCelebration();
            }}
            className="px-4 py-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Star Shower</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <span>Crafted with endless love & laughter for Kuchipu</span>
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        <span>· 24 December Edition</span>
      </div>
    </footer>
  );
};
