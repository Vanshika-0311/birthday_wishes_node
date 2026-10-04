import React, { useState } from 'react';
import { Flame, Sparkles, RotateCw, Heart } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { launchMassiveCelebration } from '../utils/confetti';

interface Candle {
  id: number;
  isLit: boolean;
  color: string;
}

export const VirtualCake: React.FC = () => {
  const [candles, setCandles] = useState<Candle[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      isLit: true,
      color: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ef4444'][i % 7],
    }))
  );

  const [wishMade, setWishMade] = useState(false);
  const allBlownOut = candles.every((c) => !c.isLit);

  const blowOutCandle = (id: number) => {
    soundFx.playCandleBlow();
    setCandles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isLit: false } : c))
    );
  };

  const blowOutAllCandles = () => {
    soundFx.playCandleBlow();
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: false })));
    setWishMade(true);

    setTimeout(() => {
      soundFx.playChime();
      launchMassiveCelebration();
    }, 400);
  };

  const relightCandles = () => {
    soundFx.playChime();
    setCandles((prev) => prev.map((c) => ({ ...c, isLit: true })));
    setWishMade(false);
  };

  return (
    <section id="virtual-cake" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-b from-amber-50/50 via-rose-50/40 to-white rounded-3xl p-8 sm:p-14 border border-rose-100/80 shadow-xs relative overflow-hidden">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 tracking-wider uppercase">
            <span>Special Tradition</span>
            <span aria-hidden="true">·</span>
            <span>Make a Birthday Wish</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 font-display">
            Kuchipu&apos;s Celebration Cake
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Close your eyes, make the sweetest wish for the year ahead, and blow out the candles!
          </p>
        </div>

        {/* 3D Tiered Cake Stage */}
        <div className="flex flex-col items-center justify-center py-6">
          {/* Cake Platform */}
          <div className="relative flex flex-col items-center">
            {/* Candles Row */}
            <div className="flex items-end justify-center gap-4 sm:gap-6 mb-1 z-20">
              {candles.map((candle) => (
                <div
                  key={candle.id}
                  onClick={() => blowOutCandle(candle.id)}
                  className="flex flex-col items-center cursor-pointer group"
                  title="Click to blow out this candle"
                >
                  {/* Flame or Smoke */}
                  {candle.isLit ? (
                    <div className="relative mb-1 flex flex-col items-center">
                      {/* Flickering glow */}
                      <div className="w-5 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full blur-[1px] animate-flame shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                      <div className="absolute top-1 w-2.5 h-4 bg-white/90 rounded-full blur-[0.5px]" />
                    </div>
                  ) : (
                    <div className="h-8 flex items-center justify-center">
                      {/* Smoke puff */}
                      <div className="w-1.5 h-6 bg-slate-300/60 rounded-full blur-xs animate-pulse" />
                    </div>
                  )}

                  {/* Wick */}
                  <div className="w-0.5 h-2 bg-slate-800" />

                  {/* Candle Wax Cylinder */}
                  <div
                    className="w-3.5 sm:w-4 h-12 sm:h-14 rounded-t-xs shadow-xs relative overflow-hidden group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: candle.color }}
                  >
                    {/* Candle spiral stripes */}
                    <div className="absolute inset-0 bg-white/20 transform -skew-y-12" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Top Tier */}
            <div className="w-56 sm:w-68 h-20 bg-gradient-to-r from-rose-100 via-pink-100 to-rose-200 rounded-2xl shadow-md border-b-4 border-rose-300 relative flex items-center justify-center z-10">
              {/* Frosting dripping edges */}
              <div className="absolute -top-2 inset-x-2 flex justify-around">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-4 bg-white rounded-full shadow-xs -mt-1"
                  />
                ))}
              </div>

              {/* Decorative Strawberries and Pearls */}
              <div className="flex gap-4">
                <span>🍓</span>
                <span>✨</span>
                <span>🍓</span>
                <span>✨</span>
                <span>🍓</span>
              </div>
            </div>

            {/* Cake Base Tier */}
            <div className="w-72 sm:w-92 h-26 bg-gradient-to-r from-amber-100 via-rose-50 to-pink-100 rounded-3xl shadow-lg border-b-6 border-rose-200/90 relative -mt-3 flex items-center justify-center">
              {/* Sugar pearls decorative border */}
              <div className="absolute -top-2 inset-x-4 flex justify-around">
                {Array.from({ length: 13 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-4 bg-white rounded-full shadow-xs -mt-1"
                  />
                ))}
              </div>

              <span className="font-handwritten text-2xl sm:text-3xl font-bold text-rose-700/80 tracking-wide">
                Happy Birthday Kuchipu · 24 Dec
              </span>
            </div>

            {/* Cake Stand Plate */}
            <div className="w-80 sm:w-104 h-6 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full shadow-xl border-t border-slate-300 -mt-2" />
            <div className="w-32 h-6 bg-gradient-to-r from-slate-300 to-slate-400 rounded-b-xl shadow-md" />
          </div>
        </div>

        {/* Wish Feedback & Actions */}
        <div className="mt-8 text-center space-y-4 max-w-md mx-auto">
          {wishMade && allBlownOut ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-fadeIn space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-rose-600 font-bold text-sm">
                <Heart className="w-4 h-4 fill-current" />
                <span>Your wish has been cast into the stars for Kuchipu!</span>
              </div>
              <p className="text-xs text-slate-600">
                May the universe conspire to fulfill every single desire of your heart this coming year.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Click individual candles to blow them out one by one, or blow all at once!
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            {!allBlownOut ? (
              <button
                onClick={blowOutAllCandles}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-yellow-200" />
                <span>Make a Wish & Blow Out All Candles!</span>
              </button>
            ) : (
              <button
                onClick={relightCandles}
                className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs shadow-xs transition-colors flex items-center gap-2 hover:bg-slate-50"
              >
                <RotateCw className="w-3.5 h-3.5 text-rose-500" />
                <span>Relight Candles</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
