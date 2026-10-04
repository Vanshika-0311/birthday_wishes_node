import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import { burstConfettiAt } from '../utils/confetti';

interface BalloonItem {
  id: number;
  x: number;          // percent of screen width (0 to 100)
  y: number;          // percent of screen height
  color: string;      // gradient or hex
  glow: string;
  size: number;       // px
  floatSpeed: number; // s
  delay: number;
  isFlyingAway: boolean;
  isPopped: boolean;
  angle: number;
}

const BALLOON_COLORS = [
  { bg: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.4)', text: '💖' },
  { bg: 'from-amber-400 to-yellow-500', glow: 'rgba(251,191,36,0.4)', text: '✨' },
  { bg: 'from-purple-500 to-indigo-600', glow: 'rgba(168,85,247,0.4)', text: '🎂' },
  { bg: 'from-emerald-400 to-teal-500', glow: 'rgba(52,211,153,0.4)', text: '🌸' },
  { bg: 'from-sky-400 to-blue-500', glow: 'rgba(56,189,248,0.4)', text: '🎈' },
  { bg: 'from-orange-400 to-rose-500', glow: 'rgba(251,146,60,0.4)', text: '👑' },
  { bg: 'from-fuchsia-500 to-pink-500', glow: 'rgba(217,70,239,0.4)', text: '⭐' },
];

export const HoverBalloons: React.FC = () => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  // Spawn initial set of balloons
  const spawnInitialBalloons = () => {
    const initial: BalloonItem[] = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const colorScheme = BALLOON_COLORS[i % BALLOON_COLORS.length];
      initial.push({
        id: Date.now() + i,
        x: 6 + (i * 9) + (Math.random() * 4 - 2),
        y: 18 + (i % 3) * 22 + (Math.random() * 8),
        color: colorScheme.bg,
        glow: colorScheme.glow,
        size: 58 + Math.floor(Math.random() * 24),
        floatSpeed: 4 + Math.random() * 3,
        delay: Math.random() * 2,
        isFlyingAway: false,
        isPopped: false,
        angle: (Math.random() - 0.5) * 40,
      });
    }
    setBalloons(initial);
  };

  useEffect(() => {
    spawnInitialBalloons();
  }, []);

  // When hovered, the balloon flies across the screen!
  const handleBalloonHover = (id: number) => {
    setBalloons((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.isFlyingAway && !b.isPopped) {
          // Play subtle buoyant swoosh
          soundFx.playChime();
          return {
            ...b,
            isFlyingAway: true,
            angle: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40),
          };
        }
        return b;
      })
    );

    // Respawn this balloon after 4 seconds so screen doesn't stay empty
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            const colorScheme = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
            return {
              ...b,
              y: 85 + Math.random() * 10,
              x: 5 + Math.random() * 90,
              isFlyingAway: false,
              isPopped: false,
              color: colorScheme.bg,
            };
          }
          return b;
        })
      );
    }, 4500);
  };

  // When clicked, the balloon pops with sound and confetti!
  const handleBalloonClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (rect.left + rect.width / 2) / window.innerWidth;
    const yNorm = (rect.top + rect.height / 2) / window.innerHeight;

    soundFx.playBalloonPop();
    burstConfettiAt(xNorm, yNorm);

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPopped: true } : b))
    );

    // Respawn after 3.5s
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            return {
              ...b,
              isPopped: false,
              isFlyingAway: false,
              x: 10 + Math.random() * 80,
              y: 70 + Math.random() * 20,
            };
          }
          return b;
        })
      );
    }, 3500);
  };

  const releaseMoreBalloons = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playChime();
    const newBatch: BalloonItem[] = [];
    for (let i = 0; i < 8; i++) {
      const colorScheme = BALLOON_COLORS[(i + 2) % BALLOON_COLORS.length];
      newBatch.push({
        id: Date.now() + Math.random() * 1000,
        x: 10 + i * 11 + (Math.random() * 6 - 3),
        y: 85 + Math.random() * 15,
        color: colorScheme.bg,
        glow: colorScheme.glow,
        size: 54 + Math.floor(Math.random() * 20),
        floatSpeed: 3 + Math.random() * 2,
        delay: Math.random() * 1.5,
        isFlyingAway: false,
        isPopped: false,
        angle: (Math.random() - 0.5) * 30,
      });
    }
    setBalloons((prev) => [...prev, ...newBatch]);
  };

  return (
    <>
      {/* Floating balloons container */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {balloons.map((balloon) => {
          if (balloon.isPopped) return null;

          return (
            <div
              key={balloon.id}
              onMouseEnter={() => handleBalloonHover(balloon.id)}
              onClick={(e) => handleBalloonClick(e, balloon.id)}
              className="absolute pointer-events-auto cursor-pointer select-none transition-transform"
              style={{
                left: `${balloon.x}%`,
                top: `${balloon.y}%`,
                transform: balloon.isFlyingAway
                  ? `translate(${balloon.angle * 8}px, -140vh) rotate(${balloon.angle * 1.5}deg) scale(0.9)`
                  : undefined,
                transition: balloon.isFlyingAway
                  ? 'transform 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 3.2s ease-in'
                  : 'transform 0.4s ease-out',
                opacity: balloon.isFlyingAway ? 0.3 : 0.95,
              }}
            >
              <div
                className="relative group animate-float-gentle"
                style={{
                  animationDuration: `${balloon.floatSpeed}s`,
                  animationDelay: `${balloon.delay}s`,
                }}
              >
                {/* Balloon body with 3D gradient highlight */}
                <div
                  className={`rounded-full bg-gradient-to-br ${balloon.color} shadow-lg relative flex items-center justify-center transform transition-transform group-hover:scale-115 active:scale-95`}
                  style={{
                    width: `${balloon.size}px`,
                    height: `${Math.round(balloon.size * 1.25)}px`,
                    boxShadow: `0 10px 25px -5px ${balloon.glow}, inset -4px -6px 12px rgba(0,0,0,0.2), inset 6px 8px 12px rgba(255,255,255,0.4)`,
                  }}
                >
                  {/* Subtle shine glint on upper-left */}
                  <div className="absolute top-2 left-2.5 w-3 h-4 bg-white/60 rounded-full blur-[0.5px] transform -rotate-45" />

                  {/* Gentle hover hint */}
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity font-bold drop-shadow">
                    Pop!
                  </span>

                  {/* Balloon knot */}
                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-gradient-to-r ${balloon.color} rounded-b-xs`}
                  />
                </div>

                {/* Balloon string with subtle wavy path */}
                <svg
                  className="w-4 h-14 -mt-0.5 mx-auto text-rose-300/70"
                  viewBox="0 0 20 60"
                  fill="none"
                >
                  <path
                    d="M10 0 C 14 15, 6 30, 10 45 C 12 52, 9 58, 10 60"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Balloon Launcher Button */}
      <button
        onClick={releaseMoreBalloons}
        title="Release more floating balloons across the screen"
        className="fixed bottom-6 right-6 z-40 bg-white/95 text-rose-600 border border-rose-200 shadow-md hover:shadow-lg rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 backdrop-blur-xs"
      >
        <span className="text-base">🎈</span>
        <span className="hidden sm:inline">Release Balloons</span>
      </button>
    </>
  );
};
