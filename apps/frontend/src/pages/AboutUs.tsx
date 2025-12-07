import React from "react";
import EnigmaLogo from "@/assets/circular logo.webp";
import Enigma3D from "@/assets/enig-anim-org.webm";
import InventoLogo from "@/assets/invento.webp";
import Invento3D from "@/assets/invento.webm";
import { CircularText } from "@/components/ui/circular-text";

// ========== TYPES ==========

type GridLine = {
  type: "horizontal" | "vertical";
  width?: number;
  height?: number;
  left: number;
  top: number;
};

type ContentSection = {
  title: string;
  intro: string;
  paragraphs: string[];
  cta: string;
  logo: string;
  logoAlt: string;
  videoSrc: string;
  staticImageSrc: string;
  staticImageAlt: string;
};

// ========== CONSTANTS ==========
const CIRCULAR_TEXT_CONFIG = {
  ENIGMA: { word: "ENIGMA ", repetitions: 5, radius: 52, centerX: 50, centerY: 50, letterSpacing: 0.85, useTranslate: true, startAngleOffset: 0 },
  INVENTO: { word: "INVENTO", repetitions: 5, radius: 52, centerX: 50, centerY: 50, letterSpacing: 0.85, useTranslate: true, startAngleOffset: 0 },
} as const;

const DESKTOP_LAYOUT = { sectionWidth: 1444, sectionHeight: 804, sectionLeft: 34, enigmaTop: 0, inventoTop: 0 } as const;

const GRID_LINES: GridLine[] = [
  // Horizontal lines
  { type: "horizontal", width: 799, left: 0, top: 322 },
  { type: "horizontal", width: 1444, left: 0, top: 482 },
  { type: "horizontal", width: 643, left: 0, top: 642 },
  { type: "horizontal", width: 477, left: 322, top: 157 },
  // Vertical lines
  { type: "vertical", height: 322, left: 322.5, top: 0 },
  { type: "vertical", height: 164, left: 322.5, top: 642 },
  { type: "vertical", height: 157, left: 483.5, top: 0 },
  { type: "vertical", height: 157, left: 483.5, top: 642 },
  { type: "vertical", height: 157, left: 643.5, top: 0 },
  { type: "vertical", height: 322, left: 643.5, top: 482 },
  { type: "vertical", height: 482, left: 795.5, top: 0 },
];


const CONTENT: Record<"enigma" | "invento", ContentSection> = {
  enigma: {
    title: "ENIGMA",
    intro:
      "Enigma is the ultimate puzzle hunter under Invento, GEC Palakkad — a game where curiosity meets chaos and logic meets imagination.",
    paragraphs: [
      "Each day brings a single, mind-bending question — it could be an image, a waveform, a phrase, or even a mysterious sound clip. The challenge? Decode the hidden meaning behind each clue and connect them all to uncover the final answer.",
      "It's not just a quiz — it's a journey through riddles, symbols, and subtle hints that test your observation, reasoning, and creativity.",
    ],
    cta: "So, ready to dive into the mystery?",
    logo: EnigmaLogo,
    logoAlt: "Enigma Logo",
    videoSrc: Enigma3D,
    staticImageSrc: "/src/assets/enigma-static.webp",
    staticImageAlt: "Enigma static",
  },
  invento: {
    title: "INVENTO",
    intro:
      "Invento, the annual techno-cultural fest of Government Engineering College, Palakkad, is where innovation, creativity, and collaboration collide.",
    paragraphs: [
      "With a vibrant mix of events ranging from hackathons and workshops to cultural nights and intellectual games, Invento celebrates the spirit of learning, building, and exploring beyond classrooms.",
      "It brings together students from all departments and colleges to showcase their technical skills, creative ideas, and passion for discovery.",
    ],
    cta: "",
    logo: InventoLogo,
    logoAlt: "Invento Logo",
    videoSrc: Invento3D,
    staticImageSrc: "/src/assets/inventologo.webp",
    staticImageAlt: "Invento static",
  },
};

// ========== COMPONENTS ==========

/**
 * Renders rotating "ENIGMA" text ring around the Enigma logo
 */
const CircularTextEnigma = () => (
  <CircularText config={{ ...CIRCULAR_TEXT_CONFIG.ENIGMA, radius: { mobile: 58, desktop: 52 }, letterSpacing: { mobile: 1.1, desktop: 0.85 }, textSize: { mobile: "text-[11px]", desktop: "md:text-[18.5px]" }, lineHeight: { mobile: "leading-[14px]", desktop: "md:leading-[22px]" }, className: "" }} />
);

/**
 * Renders rotating "INVENTO" text ring around the Invento logo
 */
const CircularTextInvento = () => (
  <CircularText config={{ ...CIRCULAR_TEXT_CONFIG.INVENTO, radius: { mobile: 58, desktop: 52 }, textSize: { mobile: "text-[11px]", desktop: "md:text-[15px]" }, lineHeight: { mobile: "leading-[14px]", desktop: "md:leading-[18px]" }, className: "font-medium tracking-tight" }} />
);

/**
 * Grid lines component for desktop layout
 */
const GridLines = () => {
  return (
    <>
      {GRID_LINES.map((line, index) => {
        const isHorizontal = line.type === "horizontal";
        return (
          <div
            key={`grid-${line.type}-${index}`}
            className={`absolute border border-white ${
              isHorizontal ? "border-t" : "border-l"
            }`}
            style={{ ...(isHorizontal ? { width: `${line.width}px`, height: "0px" } : { width: "0px", height: `${line.height}px` }), left: `${line.left}px`, top: `${line.top}px` }}
          />
        );
      })}
    </>
  );
};

/**
 * Video player component with hover effects and enhanced quality
 */
interface VideoPlayerProps {
  src: string;
  staticImageSrc: string;
  staticImageAlt: string;
  className?: string;
}

const VideoPlayer = ({
  src,
  staticImageSrc,
  staticImageAlt,
  className = "",
}: VideoPlayerProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const animationFrameRef = React.useRef<number | null>(null);
  const isHoveringRef = React.useRef<boolean>(false);
  const NORMAL_PLAYBACK_RATE = 1.0;
  const FAST_PLAYBACK_RATE = 5.0; // 5x the normal rate
  const targetRateRef = React.useRef<number>(NORMAL_PLAYBACK_RATE);

  // Smooth playback rate transition
  const transitionPlaybackRate = React.useCallback(
    (targetRate: number) => {
      if (!videoRef.current) return;

      targetRateRef.current = targetRate;
      const video = videoRef.current;
      const startRate = video.playbackRate;
      const rateDifference = targetRate - startRate;
      const duration = 200; // Transition duration in ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        if (!videoRef.current) return;

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out function for smooth transition
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

      // Cancel any existing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    []
  );

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.style.opacity = "1";
    video.playbackRate = NORMAL_PLAYBACK_RATE;
    // Ensure video plays
    video.play().catch((err) => {
      console.warn("Video autoplay failed:", err);
    });
  };

  const handleCanPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.style.opacity = "1";
    video.playbackRate = NORMAL_PLAYBACK_RATE;
    // Ensure video plays
    video.play().catch((err) => {
      console.warn("Video autoplay failed:", err);
    });
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e.currentTarget.error);
    e.currentTarget.style.display = "none";
  };

  // Minimal time update - only ensure video is playing, let browser handle rate
  const handleTimeUpdate = React.useCallback(() => {
    if (!videoRef.current) return;
    
    // Only ensure video is playing - don't constantly check rate to avoid lag
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Handle seeking events (happens during loop transitions)
  const handleSeeking = React.useCallback(() => {
    if (!videoRef.current) return;
    
    // Maintain the target rate during seek
    const targetRate = targetRateRef.current;
    videoRef.current.playbackRate = targetRate;
  }, []);

  // Handle when seek completes - ensure smooth loop
  const handleSeeked = React.useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const targetRate = targetRateRef.current;
    
    // Restore target rate after seek
    video.playbackRate = targetRate;
    
    // Ensure video keeps playing
    if (video.paused) {
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseEnter = (_e: React.MouseEvent<HTMLVideoElement>) => {
    isHoveringRef.current = true;
    transitionPlaybackRate(FAST_PLAYBACK_RATE);
  };

  const handleMouseLeave = (_e: React.MouseEvent<HTMLVideoElement>) => {
    isHoveringRef.current = false;
    transitionPlaybackRate(NORMAL_PLAYBACK_RATE);
  };

  const handleTouchStart = (_e: React.TouchEvent<HTMLVideoElement>) => {
    isHoveringRef.current = true;
    transitionPlaybackRate(FAST_PLAYBACK_RATE);
  };

  const handleTouchEnd = (_e: React.TouchEvent<HTMLVideoElement>) => {
    isHoveringRef.current = false;
    transitionPlaybackRate(NORMAL_PLAYBACK_RATE);
  };

  // Ensure video plays when component mounts
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = NORMAL_PLAYBACK_RATE;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay failed on mount:", err);
      });
    }
  }, []);

  // Cleanup animation frame on unmount
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`overflow-hidden ${className}`} style={{ imageRendering: "crisp-edges" as const, transform: "translateZ(0)" }}>
      <img src={staticImageSrc} alt={staticImageAlt} className="w-full h-full object-cover absolute top-0 left-0" style={{ imageRendering: "auto" as const, transform: "scale(1.02)", transformOrigin: "center" }} loading="eager" />
      <video ref={videoRef} src={src} autoPlay loop={true} muted playsInline preload="auto" className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 z-10" style={{ willChange: "opacity", transform: "translateZ(0) scale(1.02)", transformOrigin: "center", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", imageRendering: "auto" as const }} onLoadedData={handleLoadedData} onCanPlay={handleCanPlay} onError={handleError} onTimeUpdate={handleTimeUpdate} onSeeking={handleSeeking} onSeeked={handleSeeked} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
    </div>
  );
};

/**
 * Text block component for consistent styling
 */
interface TextBlockProps {
  children: React.ReactNode;
  className?: string;
}

const TextBlock = ({ children, className = "" }: TextBlockProps) => (
  <p className={`font-poppins text-sm sm:text-base md:text-lg lg:text-xl xl:text-[20px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[26px] tracking-[-0.02em] text-white antialiased ${className}`}>{children}</p>
);

/**
 * Desktop section component
 */
interface DesktopSectionProps {
  content: ContentSection;
  top: number;
  CircularTextComponent: React.ComponentType;
  logoSize: { width: string; height: string; top: string; left: string };
}

const DesktopSection = ({
  content,
  top,
  CircularTextComponent,
  logoSize,
}: DesktopSectionProps) => {
  return (
    <section className="absolute bg-black relative w-full" style={{ height: `${DESKTOP_LAYOUT.sectionHeight}px`, top: `${top}px`, left: `0px`, minHeight: '100vh' }}>
      <GridLines />

      <div className="absolute top-[9%] left-[5%] w-[15%] max-w-[214px] aspect-square min-w-[150px]">
        <CircularTextComponent />
        <img src={content.logo} alt={content.logoAlt} className={`absolute object-contain ${logoSize.top === "50%" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : ""}`} style={{ width: logoSize.width, height: logoSize.height === "auto" ? "auto" : logoSize.height, ...(logoSize.top !== "50%" && { top: logoSize.top, left: logoSize.left }) }} />
      </div>

      <TextBlock className="absolute w-[32%] max-w-[458px] h-auto top-[22%] left-[24%]">{content.intro}</TextBlock>
      <TextBlock className="absolute w-[50%] max-w-[729px] top-[42%] left-[1.5%]">{content.paragraphs[0]}</TextBlock>
      <TextBlock className="absolute w-[39%] max-w-[567px] top-[64%] left-[1.5%]">{content.paragraphs[1]}</TextBlock>
      {content.cta && <TextBlock className="absolute w-[18%] max-w-[258px] top-[84%] left-[1.5%] text-xl 2xl:text-[30px] font-semibold leading-tight 2xl:leading-[34px]">{content.cta}</TextBlock>}
      <p className="absolute w-[34%] max-w-[489px] top-[75%] left-[55%] font-whirly text-4xl xl:text-6xl 2xl:text-[80px] font-bold leading-tight xl:leading-[80px] tracking-[-0.02em] text-center text-white antialiased">{content.title}</p>
      <div className="absolute w-[45%] max-w-[650px] h-[60%] max-h-[486px] top-0 left-[55%] mix-blend-screen overflow-hidden">
        <VideoPlayer src={content.videoSrc} staticImageSrc={content.staticImageSrc} staticImageAlt={content.staticImageAlt} className="w-full h-full" />
      </div>
        </section>
  );
};

/**
 * Mobile section component - Responsive for all screen sizes
 */
interface MobileSectionProps {
  content: ContentSection;
  CircularTextComponent: React.ComponentType;
  showVerticalTitle?: boolean;
  logoSize?: { width: string; height: string };
  isFirst?: boolean;
}

const MobileSection = ({
  content,
  CircularTextComponent,
  showVerticalTitle = false,
  logoSize = { width: "70px", height: "auto" },
  isFirst = false,
}: MobileSectionProps) => {
  return (
    <section className={`relative bg-black text-white px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-7 md:py-9 lg:py-10 overflow-hidden ${isFirst ? 'rounded-t-lg' : 'rounded-b-lg'}`}>
      {/* Top Row: Logo, Intro, Optional Vertical Title */}
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Logo Container */}
        <div
          className={`relative shrink-0 mx-auto sm:mx-0 ${
            showVerticalTitle
              ? "w-[80px] h-[80px] xs:w-[90px] xs:h-[90px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] lg:w-[130px] lg:h-[130px]"
              : "w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px]"
          }`}
        >
          <CircularTextComponent />
          <img
            src={content.logo}
            alt={content.logoAlt}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
            style={{ width: logoSize.width, height: logoSize.height }}
          />
        </div>

        {/* Intro Text and Vertical Title */}
        {showVerticalTitle ? (
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto">
            <div className="flex-1 text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed">
              <p>{content.intro}</p>
            </div>
            <div className="flex flex-row sm:flex-col items-center justify-center gap-0.5 sm:gap-1 md:gap-0 mx-auto sm:mx-0">
              {content.title.split("").map((char) => (
                <span
                  key={char}
                  className="font-whirly text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-[0.15em] sm:tracking-[0.2em]"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden sm:block flex-1 text-xs sm:text-sm md:text-base leading-relaxed">
            <p className="mb-2 sm:mb-3">{content.intro}</p>
          </div>
        )}
      </div>

      {/* Paragraphs */}
      <div
        className={`text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed space-y-2.5 sm:space-y-3 md:space-y-4 ${
          showVerticalTitle ? "mt-4 sm:mt-5 md:mt-6" : "mt-4 sm:mt-5"
        }`}
      >
        {!showVerticalTitle && (
          <p className="sm:hidden text-[11px] xs:text-xs leading-relaxed">
            {content.intro}
          </p>
        )}
        {content.paragraphs.map((paragraph, index) => (
          <p
            key={`para-${index}`}
            className="text-[11px] xs:text-xs sm:text-sm md:text-base"
          >
            {paragraph}
          </p>
        ))}
        {content.cta && (
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-2 sm:mt-2.5 md:mt-3">
            {content.cta}
          </p>
        )}
      </div>

      {/* Video and Title */}
      {showVerticalTitle ? (
        <div className="mt-4 sm:mt-5 md:mt-6 w-full aspect-[4/3] overflow-hidden sm:rounded-lg bg-black relative">
          <div className="absolute inset-0 w-full h-full sm:mix-blend-screen">
            <VideoPlayer src={content.videoSrc} staticImageSrc={content.staticImageSrc} staticImageAlt={content.staticImageAlt} className="w-full h-full" />
          </div>
        </div>
      ) : (
        <div className="mt-4 sm:mt-5 md:mt-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          <div className="w-full aspect-[4/3] overflow-hidden sm:rounded-lg bg-black relative">
            <div className="absolute inset-0 w-full h-full sm:mix-blend-screen">
              <VideoPlayer
                src={content.videoSrc}
                staticImageSrc={content.staticImageSrc}
                staticImageAlt={content.staticImageAlt}
                className="w-full h-full"
              />
            </div>
          </div>
          <p className="font-whirly text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[0.15em] sm:tracking-[0.2em]">
            {content.title}
          </p>
        </div>
      )}
    </section>
  );
};

// ========== MAIN COMPONENT ==========
const AboutUs = () => {
  // Calculate scale factor to fill screen - base width is 1444px, we want to use ~95% of viewport width
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth >= 1280) {
        // Use full viewport width, base design is 1444px content
        // Scale to fill the entire screen with no padding
        const baseContentWidth = DESKTOP_LAYOUT.sectionWidth; // 1444px
        const viewportWidth = window.innerWidth;
        
        // Scale to fill full viewport width
        const scale = Math.min(viewportWidth / baseContentWidth, 1.5); // Cap at 1.5x
        setScaleFactor(scale);
      } else {
        setScaleFactor(1);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
  
  // Calculate minimum height for desktop: Invento section top (250px) + section height (804px) + padding
  const desktopMinHeight = (DESKTOP_LAYOUT.inventoTop + DESKTOP_LAYOUT.sectionHeight + 100) * scaleFactor;
  
  // Hide main scrollbar and make this container scrollable
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden" data-about-us-scroll>
      {/* Desktop Layout - XL screens and above (1280px+) */}
      <div ref={containerRef} className="hidden xl:block relative" style={{ width: '100%', height: '100%' }}>
        <div style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left', width: `${DESKTOP_LAYOUT.sectionWidth}px`, minHeight: `${desktopMinHeight / scaleFactor}px`, marginLeft: `0px`, marginRight: `0px`, position: 'relative' }}>
        <DesktopSection content={CONTENT.enigma} top={DESKTOP_LAYOUT.enigmaTop} CircularTextComponent={CircularTextEnigma} logoSize={{ width: "100.55px", height: "63px", top: "75px", left: "57px" }} />

        <div className="absolute border-t border-white" style={{ width: `${DESKTOP_LAYOUT.sectionWidth}px`, height: "0px", left: "0px", top: `${DESKTOP_LAYOUT.sectionHeight}px`, zIndex: 100, pointerEvents: 'none' }} />

        <DesktopSection content={CONTENT.invento} top={DESKTOP_LAYOUT.inventoTop} CircularTextComponent={CircularTextInvento} logoSize={{ width: "90px", height: "auto", top: "50%", left: "50%" }} />
        </div>
      </div>

      {/* Mobile/Tablet Layout - Below XL screens (0-1279px) */}
      <div className="xl:hidden bg-[var(--page-bg,#f6efe6)]">
        <div className="w-full max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] mx-auto">
          <MobileSection content={CONTENT.enigma} CircularTextComponent={CircularTextEnigma} showVerticalTitle={true} logoSize={{ width: "60px", height: "auto" }} isFirst={true} />
          <MobileSection content={CONTENT.invento} CircularTextComponent={CircularTextInvento} showVerticalTitle={false} logoSize={{ width: "70px", height: "auto" }} isFirst={false} />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
