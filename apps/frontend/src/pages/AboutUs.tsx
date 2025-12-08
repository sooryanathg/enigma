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

const CircularTextEnigma = () => <CircularText config={{ ...CIRCULAR_TEXT_CONFIG.ENIGMA, radius: { mobile: 58, desktop: 52 }, letterSpacing: { mobile: 1.1, desktop: 0.85 }, textSize: { mobile: "text-[11px]", desktop: "md:text-[18.5px]" }, lineHeight: { mobile: "leading-[14px]", desktop: "md:leading-[22px]" }, className: "" }} />;
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

interface MobileSectionProps { content: ContentSection; CircularTextComponent: React.ComponentType; showVerticalTitle?: boolean; logoSize?: { width: string; height: string }; isFirst?: boolean; }

const MobileSection = ({ content, CircularTextComponent, showVerticalTitle = false, logoSize = { width: "70px", height: "auto" }, isFirst = false }: MobileSectionProps) => (
  <section className={`relative bg-black text-white px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-7 md:py-9 lg:py-10 overflow-hidden ${isFirst ? 'rounded-t-lg' : 'rounded-b-lg'}`}>
    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      <div className={`relative shrink-0 mx-auto sm:mx-0 ${showVerticalTitle ? "w-[80px] h-[80px] xs:w-[90px] xs:h-[90px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] lg:w-[130px] lg:h-[130px]" : "w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[160px] lg:h-[160px]"}`}>
        <CircularTextComponent />
        <img src={content.logo} alt={content.logoAlt} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain" style={{ width: logoSize.width, height: logoSize.height }} />
      </div>
      {showVerticalTitle ? (
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto">
          <div className="flex-1 text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed"><p>{content.intro}</p></div>
          <div className="flex flex-row sm:flex-col items-center justify-center gap-0.5 sm:gap-1 md:gap-0 mx-auto sm:mx-0">
            {content.title.split("").map((char) => <span key={char} className="font-whirly text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-[0.15em] sm:tracking-[0.2em]">{char}</span>)}
          </div>
        </div>
      ) : (
        <div className="hidden sm:block flex-1 text-xs sm:text-sm md:text-base leading-relaxed"><p className="mb-2 sm:mb-3">{content.intro}</p></div>
      )}
    </div>
    <div className={`text-[11px] xs:text-xs sm:text-sm md:text-base leading-relaxed space-y-2.5 sm:space-y-3 md:space-y-4 ${showVerticalTitle ? "mt-4 sm:mt-5 md:mt-6" : "mt-4 sm:mt-5"}`}>
      {!showVerticalTitle && <p className="sm:hidden text-[11px] xs:text-xs leading-relaxed">{content.intro}</p>}
      {content.paragraphs.map((paragraph, index) => <p key={`para-${index}`} className="text-[11px] xs:text-xs sm:text-sm md:text-base">{paragraph}</p>)}
      {content.cta && <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mt-2 sm:mt-2.5 md:mt-3">{content.cta}</p>}
    </div>
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
            <VideoPlayer src={content.videoSrc} staticImageSrc={content.staticImageSrc} staticImageAlt={content.staticImageAlt} className="w-full h-full" />
          </div>
        </div>
        <p className="font-whirly text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-[0.15em] sm:tracking-[0.2em]">{content.title}</p>
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
  
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
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
