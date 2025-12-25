import React from "react";

interface VideoPlayerProps { src: string; staticImageSrc: string; staticImageAlt: string; className?: string; overflowVisible?: boolean; objectFit?: "cover" | "contain"; }

const VideoPlayer = ({ src, staticImageSrc, staticImageAlt, className = "", overflowVisible = false, objectFit = "cover" }: VideoPlayerProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const isHoveringRef = React.useRef<boolean>(false);
  const NORMAL_PLAYBACK_RATE = 1.0;
  const FAST_PLAYBACK_RATE = 5.0;
  const targetRateRef = React.useRef<number>(NORMAL_PLAYBACK_RATE);

  const transitionPlaybackRate = React.useCallback((targetRate: number) => {
    if (!videoRef.current) return;
    targetRateRef.current = targetRate;
    const video = videoRef.current;
    const startRate = video.playbackRate;
    const rateDifference = targetRate - startRate;
    const duration = 200;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      if (!videoRef.current) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRate = startRate + rateDifference * easeOut;
      videoRef.current.playbackRate = currentRate;
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        videoRef.current.playbackRate = targetRate;
        animationFrameRef.current = null;
      }
    };
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.style.opacity = "1";
    video.playbackRate = NORMAL_PLAYBACK_RATE;
    video.play().catch((err) => console.warn("Video autoplay failed:", err));
  };

  const handleCanPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.style.opacity = "1";
    video.playbackRate = NORMAL_PLAYBACK_RATE;
    video.play().catch((err) => console.warn("Video autoplay failed:", err));
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e.currentTarget.error);
    e.currentTarget.style.display = "none";
  };

  const handleTimeUpdate = React.useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeeking = React.useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = targetRateRef.current;
  }, []);

  const handleSeeked = React.useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.playbackRate = targetRateRef.current;
    if (video.paused) video.play().catch(() => { });
  }, []);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    transitionPlaybackRate(FAST_PLAYBACK_RATE);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    transitionPlaybackRate(NORMAL_PLAYBACK_RATE);
  };

  const handleTouchStart = () => {
    isHoveringRef.current = true;
    transitionPlaybackRate(FAST_PLAYBACK_RATE);
  };

  const handleTouchEnd = () => {
    isHoveringRef.current = false;
    transitionPlaybackRate(NORMAL_PLAYBACK_RATE);
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = NORMAL_PLAYBACK_RATE;
      videoRef.current.play().catch((err) => console.warn("Video autoplay failed on mount:", err));
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className={`${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} ${className}`} style={{ imageRendering: "crisp-edges" as const, transform: "translateZ(0)" }}>
      <img src={staticImageSrc} alt={staticImageAlt} className="w-full h-full absolute top-0 left-0" style={{ imageRendering: "auto" as const, transform: "scale(1.02)", transformOrigin: "center", objectFit: objectFit }} loading="eager" />
      <video ref={videoRef} src={src} autoPlay loop={true} muted playsInline preload="auto" className="w-full h-full absolute inset-0 opacity-0 transition-opacity duration-500 z-10" style={{ willChange: "opacity", transform: "translateZ(0) scale(1.02)", transformOrigin: "center", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", imageRendering: "auto" as const, objectFit: objectFit }} onLoadedData={handleLoadedData} onCanPlay={handleCanPlay} onError={handleError} onTimeUpdate={handleTimeUpdate} onSeeking={handleSeeking} onSeeked={handleSeeked} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
    </div>
  );
};

export { VideoPlayer, type VideoPlayerProps };

