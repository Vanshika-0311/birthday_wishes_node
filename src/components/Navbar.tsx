import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { launchMassiveCelebration } from '../utils/confetti';

interface NavbarProps {
  onCelebrate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCelebrate }) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    const playing = soundFx.toggleHappyBirthdayMelody(() => {
      setIsPlayingMusic(false);
    });
    setIsPlayingMusic(playing);
    if (playing) {
      launchMassiveCelebration();
    }
  };

  const toggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (muted && isPlayingMusic) {
      setIsPlayingMusic(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-rose-100/80 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#top"
          className="text-lg md:text-xl font-bold tracking-tight text-rose-950 font-display hover:text-rose-600 transition-colors whitespace-nowrap"
        >
          Kuchipu's 24 Dec Birthday
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
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
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleMusic}
            title={isPlayingMusic ? 'Pause Birthday Music' : 'Play Birthday Song'}
            className={`p-2 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
              isPlayingMusic
                ? 'bg-rose-500 text-white border-rose-400 shadow-sm animate-pulse'
                : 'bg-white/90 text-rose-800 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">
              {isPlayingMusic ? 'Playing Melody' : 'Play Tune'}
            </span>
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute Sounds'}
            className="p-2 rounded-full bg-white/90 border border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              onCelebrate();
              soundFx.playChime();
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate!</span>
          </button>
        </div>
      </div>
    </header>
  );
};
