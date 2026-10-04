import confetti from 'canvas-confetti';

export function burstConfettiAt(xNorm: number, yNorm: number) {
  confetti({
    particleCount: 45,
    spread: 70,
    origin: { x: xNorm, y: yNorm },
    colors: ['#ff4d79', '#ff9a3c', '#ffea79', '#5ce6a1', '#74b9ff', '#a29bfe', '#fd79a8'],
    ticks: 200,
    gravity: 1.1,
    scalar: 1.05,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true,
  });
}

export function burstHeartsAt(xNorm: number, yNorm: number) {
  const count = 30;
  confetti({
    particleCount: count,
    spread: 60,
    origin: { x: xNorm, y: yNorm },
    colors: ['#ff1744', '#f50057', '#d81b60', '#ff4081', '#f48fb1', '#ffcdd2'],
    ticks: 180,
    gravity: 0.9,
    scalar: 1.2,
    disableForReducedMotion: true,
  });
}

export function launchMassiveCelebration() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Left and right cannons
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#ff3366', '#ff9933', '#ffee33', '#33cc99', '#3399ff', '#9933ff'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff3366', '#ff9933', '#ffee33', '#33cc99', '#3399ff', '#9933ff'],
    });
  }, 250);
}
