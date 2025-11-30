import { useEffect, useRef, useState } from "react";

import './home.css'

interface TypingTextProps {
  text: string;
  speed?: number;
}

interface LoadingScreenProps {
  loadingDelay?: number;
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
    <h1 className="text-black font-bold font-whirlyBirdie text-9xl">
      {displayedText}
    </h1>
  );
}


const RotatingCanvasText = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} className="animate-spin-slow" />

      <img
        src="/enigma-logo.svg"
        alt="logo"
        className="absolute w-28 h-28"
      />
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ loadingDelay = 2000 }) => {
  const MAX_TYPING_TIME = 800;
  const typingDuration = Math.min(MAX_TYPING_TIME, loadingDelay);

  const rotatingDuration = loadingDelay - typingDuration;

  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, rotatingDuration);

    return () => clearTimeout(timer);
  }, [rotatingDuration]);

  return (
    <section
      id="loading-screen"
      className="flex bg-[var(--background)] flex-1 min-h-screen min-w-max z-50 justify-center items-center"
    >
      {showTyping ? (
        <TypingText text="ENIGMA" speed={typingDuration / 6} />
      ) : (
        <RotatingCanvasText />
      )}
    </section>
  );
};
