import React from "react";
import EnigmaLogo from "@/assets/circular logo.webp";
import Enigma3D from "@/assets/enig-anim-org.webm";
import InventoLogo from "@/assets/invento.webp";
import Invento3D from "@/assets/invento.webm";
import { CircularText } from "@/components/ui/circular-text";
import { VideoPlayer } from "@/components/ui/video-player";

type GridLine = { type: "horizontal" | "vertical"; width?: number; height?: number; left: number; top: number; };
type ContentSection = { title: string; intro: string; paragraphs: string[]; cta: string; logo: string; logoAlt: string; videoSrc: string; staticImageSrc: string; staticImageAlt: string; };

const CIRCULAR_TEXT_CONFIG = { ENIGMA: { word: "ENIGMA ", repetitions: 5, radius: 52, centerX: 50, centerY: 50, letterSpacing: 0.85, useTranslate: true, startAngleOffset: 0 }, INVENTO: { word: "INVENTO", repetitions: 5, radius: 52, centerX: 50, centerY: 50, letterSpacing: 0.85, useTranslate: true, startAngleOffset: 0 } } as const;
const DESKTOP_LAYOUT = { sectionWidth: 1444, sectionHeight: 804, sectionLeft: 34, enigmaTop: 0, inventoTop: 0 } as const;
const GRID_LINES: GridLine[] = [
  { type: "horizontal", width: 799, left: 0, top: 322 }, { type: "horizontal", width: 1444, left: 0, top: 482 }, { type: "horizontal", width: 643, left: 0, top: 642 }, { type: "horizontal", width: 477, left: 322, top: 157 },
  { type: "vertical", height: 322, left: 322.5, top: 0 }, { type: "vertical", height: 164, left: 322.5, top: 642 }, { type: "vertical", height: 157, left: 483.5, top: 0 }, { type: "vertical", height: 157, left: 483.5, top: 642 }, { type: "vertical", height: 157, left: 643.5, top: 0 }, { type: "vertical", height: 322, left: 643.5, top: 482 }, { type: "vertical", height: 482, left: 795.5, top: 0 },
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

const CircularTextEnigma = () => <CircularText config={{ ...CIRCULAR_TEXT_CONFIG.ENIGMA, radius: { mobile: 58, desktop: 52 }, letterSpacing: { mobile: 1.1, desktop: 1.0 }, textSize: { mobile: "text-[11px]", desktop: "md:text-[18.5px]" }, lineHeight: { mobile: "leading-[14px]", desktop: "md:leading-[22px]" }, className: "" }} />;
const CircularTextInvento = () => <CircularText config={{ ...CIRCULAR_TEXT_CONFIG.INVENTO, radius: { mobile: 58, desktop: 52 }, textSize: { mobile: "text-[11px]", desktop: "md:text-[15px]" }, lineHeight: { mobile: "leading-[14px]", desktop: "md:leading-[18px]" }, className: "font-medium tracking-tight" }} />;

const GridLines = () => (
  <>
    {GRID_LINES.map((line, index) => {
      const isHorizontal = line.type === "horizontal";
      return <div key={`grid-${line.type}-${index}`} className={`absolute border border-white ${isHorizontal ? "border-t" : "border-l"}`} style={{ ...(isHorizontal ? { width: `${line.width}px`, height: "0px" } : { width: "0px", height: `${line.height}px` }), left: `${line.left}px`, top: `${line.top}px` }} />;
    })}
  </>
);

interface TextBlockProps { children: React.ReactNode; className?: string; }
const TextBlock = ({ children, className = "" }: TextBlockProps) => <p className={`font-poppins text-sm sm:text-base md:text-lg lg:text-xl xl:text-[20px] font-normal leading-tight sm:leading-normal md:leading-relaxed lg:leading-[26px] tracking-[-0.02em] text-white antialiased ${className}`}>{children}</p>;

interface DesktopSectionProps { content: ContentSection; top: number; CircularTextComponent: React.ComponentType; logoSize: { width: string; height: string; top: string; left: string }; }

const DesktopSection = ({ content, top, CircularTextComponent, logoSize }: DesktopSectionProps) => (
  <section className="absolute bg-black relative w-full " style={{ height: `${DESKTOP_LAYOUT.sectionHeight}px`, top: `${top}px`, left: `0px`, minHeight: '100vh' }}>
    <GridLines />
    <div className="absolute top-[9%] left-[5%] w-[15%] max-w-[214px] aspect-square min-w-[150px]">
      <CircularTextComponent />
      <img src={content.logo} alt={content.logoAlt} className={`absolute object-contain ${logoSize.top === "50%" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" : ""}`} style={{ width: logoSize.width, height: logoSize.height === "auto" ? "auto" : logoSize.height, ...(logoSize.top !== "50%" && { top: logoSize.top, left: logoSize.left }) }} />
    </div>
    <TextBlock className="absolute w-[32%] max-w-[458px] h-auto top-[22%] left-[24%]">{content.intro}</TextBlock>
    <TextBlock className="absolute w-[50%] max-w-[729px] top-[42%] left-[1.5%]">{content.paragraphs[0]}</TextBlock>
    <TextBlock className="absolute w-[39%] max-w-[567px] top-[64%] left-[1.5%]">{content.paragraphs[1]}</TextBlock>
    {content.cta && <TextBlock className="absolute w-[18%] max-w-[258px] top-[84%] left-[1.5%] text-xl 2xl:text-[30px] font-semibold leading-tight 2xl:leading-[34px]">{content.cta}</TextBlock>}
    <p className="absolute w-[34%] max-w-[489px] top-[75%] left-[55%] font-whirlyBirdie text-4xl xl:text-6xl 2xl:text-[80px] font-bold leading-tight xl:leading-[80px] tracking-[-0.02em] text-center text-white antialiased">{content.title}</p>
    <div className="absolute w-[45%] max-w-[650px] h-[60%] max-h-[486px] top-0 left-[55%] mix-blend-screen overflow-hidden">
      <VideoPlayer src={content.videoSrc} staticImageSrc={content.staticImageSrc} staticImageAlt={content.staticImageAlt} className="w-full h-full" />
    </div>
  </section>
);

interface MobileSectionProps { content: ContentSection; CircularTextComponent: React.ComponentType; showVerticalTitle?: boolean; isFirst?: boolean; }

const MobileSection = ({ content, CircularTextComponent, showVerticalTitle = false, isFirst = false }: MobileSectionProps) => (
  <section className={`relative bg-black text-white px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-6 xs:py-7 sm:py-8 md:py-10 lg:py-12 overflow-hidden ${isFirst ? 'rounded-t-lg' : 'rounded-b-lg'}`}>
    {/* Header: Logo + Intro + Vertical Title */}
    <div className={`flex flex-col xs:flex-row items-center xs:items-start gap-4 xs:gap-5 sm:gap-6 md:gap-8 ${!showVerticalTitle ? 'mt-4 xs:mt-5 sm:mt-6 md:mt-8' : ''}`}>
      {/* Logo Container - responsive sizing */}
      <div className={`relative shrink-0 ${showVerticalTitle 
        ? "w-[90px] h-[90px] xs:w-[100px] xs:h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px] mb-4 xs:mb-5 sm:mb-6 md:mb-7" 
        : "w-[100px] h-[100px] xs:w-[110px] xs:h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] mb-4 xs:mb-5 sm:mb-6 md:mb-7"}`}>
        <CircularTextComponent />
        <img 
          src={content.logo} 
          alt={content.logoAlt} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain w-[55%] h-auto" 
        />
      </div>
      
      {showVerticalTitle ? (
        <div className="flex-1 flex flex-col xs:flex-row items-center xs:items-start gap-4 xs:gap-5 sm:gap-6 w-full">
          {/* Intro text */}
          <div className="flex-1 text-[13px] xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-center xs:text-left">
            <p>{content.intro}</p>
          </div>
          {/* Vertical title - horizontal on mobile, vertical on larger */}
          <div className="flex flex-row xs:flex-col items-center justify-center gap-1 xs:gap-0.5 sm:gap-1">
            {content.title.split("").map((char, idx) => (
              <span 
                key={`${char}-${idx}`} 
                className="font-whirlyBirdie text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none tracking-wide"
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden xs:block flex-1 text-[13px] xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-7">
          <p>{content.intro}</p>
        </div>
      )}
    </div>
    
    {/* Content paragraphs */}
    <div className={`leading-relaxed space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 ${showVerticalTitle ? "mt-7 xs:mt-8 sm:mt-10 md:mt-12" : "mt-5 xs:mt-6 sm:mt-8"}`}>
      {/* Show intro on smallest screens only for non-vertical title variant */}
      {!showVerticalTitle && (
        <p className="xs:hidden text-[13px] leading-relaxed text-center mb-4">{content.intro}</p>
      )}
      {content.paragraphs.map((paragraph, index) => (
        <p 
          key={`para-${index}`} 
          className="text-[13px] xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
      {content.cta && (
        <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mt-3 xs:mt-4 sm:mt-5">
          {content.cta}
        </p>
      )}
    </div>
    
    {/* Video/Media Section */}
    {showVerticalTitle ? (
      <div className="mt-5 xs:mt-6 sm:mt-8 md:mt-10 w-full aspect-video xs:aspect-[4/3] sm:aspect-video overflow-hidden rounded-lg bg-black relative">
        <div className="absolute inset-0 w-full h-full mix-blend-screen" style={{ transform: 'scale(1.15)', transformOrigin: 'center center' }}>
          <VideoPlayer 
            src={content.videoSrc} 
            staticImageSrc={content.staticImageSrc} 
            staticImageAlt={content.staticImageAlt} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    ) : (
      <div className="mt-5 xs:mt-6 sm:mt-8 md:mt-10 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
        <div className="w-full aspect-video xs:aspect-[4/3] sm:aspect-video overflow-hidden rounded-lg bg-black relative">
          <div className="absolute inset-0 w-full h-full mix-blend-screen" style={{ transform: 'scale(1.15)', transformOrigin: 'center center' }}>
            <VideoPlayer 
              src={content.videoSrc} 
              staticImageSrc={content.staticImageSrc} 
              staticImageAlt={content.staticImageAlt} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        <p className="font-whirlyBirdie text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-[0.15em] sm:tracking-[0.2em]">
          {content.title}
        </p>
      </div>
    )}
  </section>
);

const AboutUs = () => {
  const [scaleFactor, setScaleFactor] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth >= 1280) {
        const baseContentWidth = DESKTOP_LAYOUT.sectionWidth;
        const viewportWidth = window.innerWidth;
        const scale = Math.min(viewportWidth / baseContentWidth, 1.5);
        setScaleFactor(scale);
      } else {
        setScaleFactor(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
  
  const desktopMinHeight = (DESKTOP_LAYOUT.inventoTop + DESKTOP_LAYOUT.sectionHeight + 100) * scaleFactor;

  // Hide the main page scrollbar visually while on the About Us page,
  // but still allow scrolling with the mouse/trackpad.
  React.useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    body.classList.add("no-main-scrollbar");
    html.classList.add("no-main-scrollbar");
    return () => {
      body.classList.remove("no-main-scrollbar");
      html.classList.remove("no-main-scrollbar");
    };
  }, []);
  
  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden" data-about-us-scroll>
      <div ref={containerRef} className="hidden xl:block relative" style={{ width: '100%', height: '100%' }}>
        <div style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left', width: `${DESKTOP_LAYOUT.sectionWidth}px`, minHeight: `${desktopMinHeight / scaleFactor}px`, marginLeft: `0px`, marginRight: `0px`, position: 'relative' }}>
          <DesktopSection content={CONTENT.enigma} top={DESKTOP_LAYOUT.enigmaTop} CircularTextComponent={CircularTextEnigma} logoSize={{ width: "100.55px", height: "63px", top: "75px", left: "57px" }} />
          <div className="absolute border-t border-white" style={{ width: `${DESKTOP_LAYOUT.sectionWidth}px`, height: "0px", left: "0px", top: `${DESKTOP_LAYOUT.sectionHeight}px`, zIndex: 100, pointerEvents: 'none' }} />
          <DesktopSection content={CONTENT.invento} top={DESKTOP_LAYOUT.inventoTop} CircularTextComponent={CircularTextInvento} logoSize={{ width: "90px", height: "auto", top: "50%", left: "50%" }} />
        </div>
      </div>
      <div className="xl:hidden bg-[var(--page-bg,#f6efe6)] min-h-screen pt-10">
        <div className="w-full">
          <MobileSection 
            content={CONTENT.enigma} 
            CircularTextComponent={CircularTextEnigma} 
            showVerticalTitle={true} 
            isFirst={true} 
          />
          <div className="h-px bg-white/20 mx-4 xs:mx-0" />
          <MobileSection 
            content={CONTENT.invento} 
            CircularTextComponent={CircularTextInvento} 
            showVerticalTitle={false} 
            isFirst={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
