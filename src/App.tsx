import React, { useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroCountdown } from './components/HeroCountdown';
import { HoverBalloons } from './components/HoverBalloons';
import { PhotoGallery } from './components/PhotoGallery';
import { CardBuilder } from './components/CardBuilder';
import { VirtualCake } from './components/VirtualCake';
import { WishingWall } from './components/WishingWall';
import { Footer } from './components/Footer';
import { burstConfettiAt, launchMassiveCelebration } from './utils/confetti';

export default function App() {
  // Global click handler: "confetti bursts upon mouse clicks"
  const handleGlobalClick = useCallback((e: MouseEvent) => {
    // Avoid interfering if user is clicking inside an input or textarea
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('input') ||
        target.closest('textarea'))
    ) {
      return;
    }

    const xNorm = e.clientX / window.innerWidth;
    const yNorm = e.clientY / window.innerHeight;
    burstConfettiAt(xNorm, yNorm);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [handleGlobalClick]);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 relative selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onCelebrate={launchMassiveCelebration} />

      {/* Interactive Hoverable Floating Balloons that fly across screen on hover */}
      <HoverBalloons />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Dynamic Countdown & Hero */}
        <HeroCountdown />

        {/* Themed Section Divider: Soft celebratory gradient ribbon */}
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-300/50 to-transparent my-4" />

        {/* Personalized Photo Memories Gallery */}
        <PhotoGallery />

        {/* Themed Section Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent my-4" />

        {/* Interactive Digital Greeting Card Studio */}
        <CardBuilder />

        {/* Themed Section Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-pink-300/40 to-transparent my-4" />

        {/* Virtual 3D Birthday Cake & Candles */}
        <VirtualCake />

        {/* Themed Section Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-rose-300/40 to-transparent my-4" />

        {/* Community Wishing Wall */}
        <WishingWall />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
