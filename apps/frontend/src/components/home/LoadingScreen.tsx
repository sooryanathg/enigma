import { useEffect, useRef, useState, type FC } from "react";

import "./home.css";

interface TypingTextProps {
  text: string;
  speed?: number;
}

interface RotatingCanvasTextProps {
  duration?: number;
}

interface LoadingScreenProps {
  loadingDelay?: number;
  onComplete: () => void;
}

export default function TypingText({ text, speed = 100 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <h1 className="text-black font-bold font-whirlyBirdie text-5xl lg:text-9xl">
      {displayedText}
    </h1>
  );
}

export const RotatingCanvasText: FC<RotatingCanvasTextProps> = ({
  duration = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    const text = " ENIGMA ENIGMA ENIGMA ENIGMA ENIGMA ";
    const radius = 100;

    ctx.font = "300 18.5px sans-serif";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";

    ctx.translate(canvas.width / 2, canvas.height / 2);
    const angleStep = (2 * Math.PI) / text.length;
    const spacing = 1.025;

    for (let i = 0; i < text.length; i++) {
      ctx.rotate(angleStep * spacing);
      ctx.save();
      ctx.translate(0, -radius);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-Out cubic (slows down near end)
      const eased = 1 - Math.pow(1 - progress, 3);

      setPercent(Math.floor(eased * 100));

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [duration]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {duration > 0 && (
        <h1 className="font-whirlyBirdie text-4xl font-bold">{percent}%</h1>
      )}

      <canvas ref={canvasRef} className="animate-spin-slow" />

      <img src="/enigma-logo.svg" alt="logo" className="absolute w-28 h-28" />
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingDelay = 2000,
  onComplete,
}) => {
  const MAX_TYPING_TIME = 800;
  const typingDuration = Math.min(MAX_TYPING_TIME, loadingDelay);
  const rotatingDuration = loadingDelay - typingDuration;

  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);

      setTimeout(() => {
        onComplete?.();
      }, typingDuration + 100);
    }, rotatingDuration);

    return () => clearTimeout(timer);
  }, [rotatingDuration, typingDuration, onComplete]);

  return (
    <section className="flex bg-[var(--background)] min-h-screen justify-center items-center">
      {showTyping ? (
        <TypingText text="ENIGMA" speed={typingDuration / 10} />
      ) : (
        <RotatingCanvasText duration={rotatingDuration} />
      )}
    </section>
  );
};
