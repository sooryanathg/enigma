import React from "react";

type Rule = { number: number; title: string; description: string };
type DiagonalLine = { left: number };

const LAYOUT = { desktop: { headerWidth: 1452, headerHeight: 104, headerLeft: 29.01, headerTop: 121, frameWidth: 1451, frameHeight: 248, frameGap: 20, firstFrameTop: 436 }, mobile: { framePadding: 16, frameGap: 16, firstFrameTop: 400 } } as const;
const DIAGONAL_LINES: DiagonalLine[] = [{ left: 153 }, { left: 853 }, { left: 1053 }, { left: 1253 }];
const RULES: Rule[] = [
  { number: 1, title: "Verification", description: "winners will have to prove they're real humans ( and real students ) before collecting their glory." },
  { number: 2, title: "Ranking", description: "It’s not just about solving — it’s about how fast you solve. The quickest minds rise to the top, no second chances with time." },
  { number: 3, title: "Hints", description: "We might drop a few hints here and there… or maybe not. Keep an eye on the question page; surprises happen when you least expect them." },
  { number: 4, title: "Timer", description: "The team holds every right to take action if things go sideways. Play clean, or watch your spot disappear like your last wrong guess." },
  { number: 5, title: "Fairplay", description: "The team holds every right to take action if things go sideways. Play clean, or watch your spot disappear like your last wrong guess." },
  { number: 6, title: "Use Your Tools", description: "Google’s your sidekick. Think like a coder, search like a detective. The answer’s always out there — somewhere between logic and luck." },
  { number: 7, title: "Hackers", description: "We see you. We like your confidence. But no — just no." },
];

interface DiagonalLineProps { left: number; className?: string; }
const DiagonalLine = ({ left, className = "" }: DiagonalLineProps) => (
  <div className={`absolute border border-white ${className}`} style={{ width: "128.46px", left: `${left}px`, top: "51px", transform: "rotate(-54.83deg)" }} />
);

interface RuleFrameProps { rule: Rule; index: number; isMobile: boolean; }

const RuleFrame = ({ rule, index, isMobile }: RuleFrameProps) => {
  if (isMobile) {
    return (
      <div className="relative w-full bg-black border border-white px-4 py-6 sm:px-6 sm:py-8">
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 font-whirly font-bold text-white text-3xl sm:text-4xl md:text-5xl leading-tight">{rule.number}</div>
        <div className="absolute top-4 sm:top-6 left-16 sm:left-20 md:left-24 font-whirly font-bold text-white text-lg sm:text-xl md:text-2xl leading-tight">{rule.title}</div>
        <div className="absolute left-0 right-0 top-16 sm:top-20 border-t border-white" />
        <div className="mt-20 sm:mt-24 font-poppins font-medium text-white text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">{rule.description}</div>
      </div>
    );
  }

  const topOffset = LAYOUT.desktop.firstFrameTop + index * (LAYOUT.desktop.frameHeight + LAYOUT.desktop.frameGap);

  return (
    <div className="relative box-border bg-black border border-white" style={{ width: `${LAYOUT.desktop.frameWidth}px`, height: `${LAYOUT.desktop.frameHeight}px`, left: `calc(50% - ${LAYOUT.desktop.frameWidth}px / 2)`, top: `${topOffset}px`, position: "absolute" }}>
      {DIAGONAL_LINES.map((line, i) => <DiagonalLine key={i} left={line.left} />)}
      <div className="absolute left-0 right-0 top-[104px] border-t border-white" />
      <div className="absolute font-whirly font-bold text-white flex items-center" style={{ width: "22px", height: "49px", left: "64px", top: "29px", fontSize: "48px", lineHeight: "49px", letterSpacing: "0.01em" }}>{rule.number}</div>
      <div className="absolute font-whirly font-bold text-white flex items-center" style={{ width: "266px", height: "49px", left: "282px", top: "29px", fontSize: "24px", lineHeight: "49px", letterSpacing: "0.01em" }}>{rule.title}</div>
      <div className="absolute font-poppins font-medium text-white flex items-center" style={{ width: "1189px", height: "78px", left: "64px", top: "134px", fontSize: "28px", lineHeight: "39px", letterSpacing: "0.01em" }}>{rule.description}</div>
    </div>
  );
};
// ========== MAIN COMPONENT ==========
const Rules = () => {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-[var(--page-bg,#f6efe6)]" data-rules-scroll>
      <div className="hidden lg:block">
        <div className="absolute bg-black" style={{ width: `${LAYOUT.desktop.headerWidth}px`, height: `${LAYOUT.desktop.headerHeight}px`, left: `${LAYOUT.desktop.headerLeft}px`, top: `${LAYOUT.desktop.headerTop}px` }} />
        <div className="absolute text-white font-whirly font-bold" style={{ width: "130px", height: "29px", left: "60.01px", top: "157px", fontSize: "24px", lineHeight: "29px" }}>RULES</div>
        <div className="absolute font-whirly font-bold text-center" style={{ width: "370px", height: "43px", left: "calc(50% - 370px/2)", top: "293px", fontSize: "36px", lineHeight: "43px", letterSpacing: "-0.02em", color: "#000000" }}>game rules</div>
        <div className="absolute font-poppins font-medium text-center flex items-center" style={{ width: "651px", height: "62px", left: "calc(50% - 651px/2 + 0.5px)", top: "334px", fontSize: "24px", lineHeight: "62px", letterSpacing: "0.01em", color: "#000000" }}>Master the challenge with these essential guidelines</div>
        {RULES.map((rule, index) => <RuleFrame key={index} rule={rule} index={index} isMobile={false} />)}
      </div>

      <div className="lg:hidden px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="bg-black px-4 sm:px-6 py-3 sm:py-4 mb-6 sm:mb-8">
            <h1 className="text-white font-whirly font-bold text-xl sm:text-2xl md:text-3xl">RULES</h1>
          </div>
          <h2 className="font-whirly font-bold text-center text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight mb-2 sm:mb-3">game rules</h2>
          <p className="font-poppins font-medium text-center text-black text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12">Master the challenge with these essential guidelines</p>
          <div className="space-y-4 sm:space-y-6">{RULES.map((rule, index) => <RuleFrame key={index} rule={rule} index={index} isMobile={true} />)}</div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
