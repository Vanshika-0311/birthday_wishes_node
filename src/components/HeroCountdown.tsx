import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Heart, Gift, ArrowDown } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { launchMassiveCelebration } from '../utils/confetti';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
}

export const HeroCountdown: React.FC = () => {
  const [forceCelebrationMode, setForceCelebrationMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // December is month 11 (0-indexed)
      let targetDate = new Date(currentYear, 11, 24, 0, 0, 0);

      // Check if today is December 24
      const isTodayDec24 = now.getMonth() === 11 && now.getDate() === 24;

      if (!isTodayDec24 && now.getTime() > targetDate.getTime()) {
        // If Dec 24 has passed this year, countdown to next year
        targetDate = new Date(currentYear + 1, 11, 24, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();

      if (isTodayDec24 || diff <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: true,
        };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isToday: false };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isBirthdayNow = timeLeft.isToday || forceCelebrationMode;

  const handleTriggerParty = () => {
    setForceCelebrationMode(true);
    soundFx.playChime();
    launchMassiveCelebration();
  };

  return (
    <section
      id="countdown"
      className="relative min-h-[92vh] flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-rose-50/70 via-amber-50/40 to-white"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-16 right-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle celebratory metadata line (anti-slop: unboxed, clean typography) */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-rose-800/80 mb-4 tracking-wide uppercase">
        <span>Celebration for Kuchipu</span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1 font-semibold text-rose-600">
          <Calendar className="w-3.5 h-3.5" /> 24 December
        </span>
        <span aria-hidden="true">·</span>
        <span>A Special Day</span>
      </div>

      {/* Main Hero Title */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 font-display leading-[1.12]">
          Happieee Wala Birthday,{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent underline decoration-rose-300 decoration-wavy decoration-2">
            Kuchipu!
          </span>
        </h1>
        <p className="text-base sm:text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed pt-2">
          Wishing you a magical year filled with endless laughter, boundless love, and all the happiness
          your heart can hold.
        </p>
      </div>

      {/* Dynamic Countdown Section or Celebration Banner */}
      <div className="w-full max-w-3xl mt-10 mb-8">
        {isBirthdayNow ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-xl text-center space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <Gift className="w-48 h-48" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" /> It&apos;s 24 December!
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display">
              🎉 Today is Kuchipu&apos;s Special Birthday! 🎉
            </h2>
            <p className="text-white/95 max-w-xl mx-auto text-sm sm:text-base">
              The wait is over! Today we celebrate every smile, every grace, and every moment of joy you bring into the world.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  launchMassiveCelebration();
                  soundFx.playChime();
                }}
                className="px-6 py-2.5 bg-white text-rose-600 font-bold rounded-full text-sm shadow hover:bg-rose-50 transition-transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Fire Birthday Confetti!
              </button>
              {forceCelebrationMode && !timeLeft.isToday && (
                <button
                  onClick={() => setForceCelebrationMode(false)}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Return to Live Countdown
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-2 text-slate-800">
                <Clock className="w-5 h-5 text-rose-500" />
                <span className="font-semibold text-sm sm:text-base">Countdown to 24 December</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Until midnight begins</span>
            </div>

            {/* 4-digit timer blocks */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
              <div className="p-3 sm:p-5 rounded-xl bg-rose-50/80 border border-rose-100/60">
                <div className="text-3xl sm:text-5xl font-extrabold text-rose-600 font-mono tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Days
                </div>
              </div>

              <div className="p-3 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-100/60">
                <div className="text-3xl sm:text-5xl font-extrabold text-amber-600 font-mono tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Hours
                </div>
              </div>

              <div className="p-3 sm:p-5 rounded-xl bg-pink-50/80 border border-pink-100/60">
                <div className="text-3xl sm:text-5xl font-extrabold text-pink-600 font-mono tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Minutes
                </div>
              </div>

              <div className="p-3 sm:p-5 rounded-xl bg-purple-50/80 border border-purple-100/60">
                <div className="text-3xl sm:text-5xl font-extrabold text-purple-600 font-mono tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Seconds
                </div>
              </div>
            </div>

            {/* Instant Celebration Simulator Toggle */}
            <div className="mt-6 pt-4 border-t border-rose-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Special moments are counting down for Kuchipu.
              </span>
              <button
                onClick={handleTriggerParty}
                className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                Preview Birthday Day (Dec 24 Mode)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Jump Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
        <a
          href="#memories"
          className="px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2"
        >
          <span>View Photo Gallery</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>
        <a
          href="#greeting-card"
          className="px-5 py-2.5 rounded-full bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors flex items-center gap-2"
        >
          <span>Build Greeting Card</span>
        </a>
        <a
          href="#virtual-cake"
          className="px-5 py-2.5 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors flex items-center gap-2"
        >
          <span>Blow Out Candles</span>
        </a>
      </div>
    </section>
  );
};
