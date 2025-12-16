
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlay } from '../hooks/usePlay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import leftArrow from '@/assets/left-arrow.svg';
import { calculateGridLayout, ImageSquare } from '@/components/play/ImageGrid';

import alchemist from '@/assets/alchemist.png';
import rumi from '@/assets/rumi.png';
import sand_storm from '@/assets/sand_storm.png';
import pyramid from '@/assets/pyramid.png';
import hawkings from '@/assets/hawkings.png';

const TUTORIAL_SLIDES = [
  {
    image: alchemist,
    title: "QUESTION",
    text: "I speak without words, guide without maps, and only those who listen with their heart understand me. I am the actual treasure hunt... Discover where I hide!!"
  },
  {
    image: rumi,
    text: "1. Clue of poet Rumi : The novel is deeply influenced by Sufi philosophy and closely resembles the teachings of Jalaluddin Rumi, the 13th century Sufi poet. Both The Alchemist and Rumi emphasize \" The Universe helps you when you follow your true path\""
  },
  {
    image: sand_storm,
    text: "2. Clue of Sand Storm: There are several scenes of Sand storm in The Alchemist also the protagonist himself turns into sandstorm wind"
  },
  {
    image: pyramid,
    text: "3. Clue of Pyramid : The pyramids are the final destination of Santiago, the protagonist."
  },
  {
    image: hawkings,
    text: "4. Clue of Stephen Hawking : His famous book \"The Brief History of Time\" is also released in the year 1988, the same year Paulo Coelho published \"The Alchemist\""
  },
  {
    image: null,
    title: "CONCLUSION",
    text: "Each clue converges on The Alchemist: the novel is steeped in Sufi-like wisdom (Rumi-style guidance about following your true path), contains vivid desert imagery and a literal sandstorm sequence, culminates at the Egyptian pyramids (Santiago's final destination), and was first published in 1988 — the same year Hawking's A Brief History of Time came out, giving a neat date-based cross-clue. Put those together and there's only one book that fits all four hints.",
    answer: "ALCHEMIST"
  }
];

const DayBox = ({ day, left, top, dayTop, statusTop, isCompleted, isAccessible, isDateUnlocked }: { day: number; left: string; top: string; dayTop: string; statusTop: string; isCompleted?: boolean; isAccessible?: boolean; isDateUnlocked?: boolean }) => {
  // Determine background color: completed > available > locked
  let bgColor = 'bg-gray-400'; // default for locked
  let textColor = 'text-white';
  
  if (isCompleted) {
    bgColor = 'bg-[#f6efe6]'; // beige for completed
    textColor = 'text-black';
  } else if (isAccessible && isDateUnlocked !== false) {
    bgColor = 'bg-white'; // white for available/unlocked
    textColor = 'text-black';
  }
  
  return (
    <>
      <div className={`absolute ${bgColor} w-[126.08px] h-[94px]`} style={{ left, top }} />
      <div className={`absolute font-whirlyBirdie font-bold ${textColor} text-center w-[89px] h-[24px] text-[20px] leading-[24px] whitespace-nowrap`} style={{ left: `${parseFloat(left) + 18}px`, top: dayTop }}>day {day}</div>
      <div className={`absolute font-poppins font-medium ${textColor} text-center w-[105px] h-[24px] text-[16px] leading-[24px]`} style={{ left: `${parseFloat(left) + 10}px`, top: statusTop }}>{isCompleted ? "Completed" : "In Progress"}</div>
    </>
  );
};

const DAY_BOXES = [
  { day: 1, left: "24.99px", top: "114px", dayTop: "139px", statusTop: "161px" },
  { day: 2, left: "171.07px", top: "114px", dayTop: "139px", statusTop: "161px" },
  { day: 3, left: "317.15px", top: "114px", dayTop: "139px", statusTop: "161px" },
  { day: 4, left: "24.99px", top: "228px", dayTop: "253px", statusTop: "275px" },
  { day: 5, left: "171.07px", top: "228px", dayTop: "253px", statusTop: "275px" }
];

function PlayPage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showFinalCongrats, setShowFinalCongrats] = useState(false);
  const [squareImagesLoaded, setSquareImagesLoaded] = useState<boolean[]>([]);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);

  const { displayDay, question, progress, cooldownSeconds, initialize, fetchQuestion, submitAnswer } = usePlay(currentUser);

  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth >= 1024) {
        const baseWidth = 1510;
        const baseHeight = 900;
        setScaleX(Math.max(window.innerWidth / baseWidth, 0.7));
        setScaleY(Math.max((window.innerHeight - 64) / baseHeight, 0.7));
      } else {
        setScaleX(1);
        setScaleY(1);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Reset slide when opening
  useEffect(() => {
    if (isOpen) setCurrentSlide(0);
  }, [isOpen]);

  // Get actual images array from question
  const getQuestionImages = (): string[] => {
    if (!question?.image) return [];
    if (Array.isArray(question.image)) {
      return question.image;
    }
    // If string, return as single element array (backward compatibility)
    return [question.image];
  };

  const questionImages = getQuestionImages();

  // Calculate grid layout for desktop
  const desktopImageLayout = calculateGridLayout(
    questionImages.length,
    918.03, // container width
    414.5,  // available height (528 - 113.5 for question area)
    362.5,  // start top (after divider line)
    29      // start left (container left)
  );

  useEffect(() => {
    // Reset loaded state when images change
    setSquareImagesLoaded(new Array(questionImages.length).fill(false));
  }, [questionImages.length]);

  useEffect(() => {
    if (currentUser) initialize();
  }, [currentUser, initialize]);

  useEffect(() => {
    if (question?.isCompleted && displayDay === progress?.progress.length) {
      setShowFinalCongrats(true);
    }
  }, [question, displayDay, progress]);

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (message && (message.includes('Correct') || message.includes('Success') || message.includes('🎉'))) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setMessage('Please enter an answer');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await submitAnswer(answer.trim());
      if (!res.ok) {
        setMessage(res.message || (res.data && res.data.result) || 'Submission failed');
      } else {
        setMessage(res.data?.result || 'Submitted');
        if (res.data?.correct) {
          setAnswer('');
          await fetchQuestion(displayDay);
        }
      }
    } catch {
      setMessage('Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide < TUTORIAL_SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="min-h-screen bg-transparent relative overflow-y-auto" ref={containerRef}>
      {/* Desktop Layout */}
      <div
        className="font-orbitron absolute top-0 left-0 hidden lg:block origin-top-left"
        style={{
          transform: `scale(${scaleX}, ${scaleY})`,
          width: `${100 / scaleX}%`,
          height: `${100 / scaleY}%`
        }}
      >
        {/* Top Rectangle */}
        <div className="absolute bg-black w-[1452px] h-[104px] left-[29.01px] top-[121px]">
          <button onClick={() => navigate(-1)} className="absolute flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity left-[4.03%] top-[34.62%] w-[30px] h-[30px] bg-transparent border-none">
            <img src={leftArrow} alt="Left arrow" className="w-full h-full object-contain brightness-0 invert" />
          </button>
        </div>

        {/* Day X Of Y Text */}
        <div className="absolute font-whirlyBirdie font-bold text-white text-center w-[210px] h-[29px] left-[130.01px] top-[157px] text-[24px] leading-[29px] whitespace-nowrap">
          Day {displayDay} Of {progress?.progress.length || 10}
        </div>

        {/* Tutorial Button */}
        <button onClick={() => setIsOpen(true)} className="absolute bg-black text-white border border-white px-4 py-2 rounded hover:bg-gray-800 transition-colors w-[138px] h-[45px] left-[1321px] top-[150px]">Tutorial</button>

        {/* Left Rectangle */}
        <div className="absolute bg-black border border-black w-[918.03px] h-[528px] left-[29px] top-[249px]">
          <div className="absolute font-whirlyBirdie font-bold text-white w-[733px] h-[60px] left-[calc(50%-733px/2-50px)] top-0 pt-[20px] text-[20px] leading-[30px]">
            {question?.question || "I hold two people inside me forever, but i'm not a home. What am i ?"}
          </div>
          <div className="absolute w-[918.03px] h-0 left-0 top-[113.5px] border border-white" />
        </div>

        {/* Image Squares - Dynamic Grid */}
        {questionImages.map((image, i) => (
          desktopImageLayout[i] && (
            <ImageSquare
              key={i}
              index={i}
              position={desktopImageLayout[i]}
              image={image}
              loaded={squareImagesLoaded[i] || false}
              onLoad={() => setSquareImagesLoaded(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              })}
            />
          )
        ))}

        {/* ANSWER Text */}
        <div className="absolute font-whirlyBirdie font-bold text-black text-center w-[191px] h-[29px] left-[29px] top-[808px] text-[24px] leading-[29px]">ANSWER :</div>

        {/* Answer Input */}
        <div className="absolute w-[701px] h-[73px] left-[29.01px] top-[851px]">
          <Input id="answer-input" placeholder="" value={answer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)} disabled={cooldownSeconds > 0 || submitting} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmit()} className="w-full h-full" />
        </div>

        {/* Placeholder Text */}
        {!answer && <div className="absolute pointer-events-none font-poppins font-medium w-[218px] h-[36px] left-[60px] top-[872px] text-[24px] leading-[36px] text-[#6B6B6B]">Enter Your Answer</div>}

        {/* Submit Button */}
        <div className="absolute w-[216px] h-[73px] left-[731px] top-[851px]">
          <Button onClick={handleSubmit} disabled={submitting || cooldownSeconds > 0} className="w-full h-full bg-black text-white font-whirlyBirdie font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center text-[24px] leading-[29px]">
            {submitting ? 'Submitting...' : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'SUBMIT'}
          </Button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`absolute font-poppins text-base font-medium left-[29px] top-[940px] max-w-[900px] ${message.includes('Correct') || message.includes('Success') || message.includes('🎉') ? "text-[#10b981]" : "text-[#ef4444]"}`}
          >
            {message}
          </div>
        )}

        {/* Right Rectangle */}
        <div className="absolute bg-black w-[514px] h-[675px] left-[968.02px] top-[249px]">
          <div className="absolute font-whirlyBirdie font-bold text-white text-center w-[332px] h-[29px] left-[25px] top-[55px] text-[24px] leading-[29px]">Your progress</div>

          {/* Day Boxes */}
          {DAY_BOXES.map(({ day, left, top, dayTop, statusTop }, idx) => {
            const dayProgress = progress?.progress[idx];
            return (
              <DayBox 
                key={day} 
                day={day} 
                left={left} 
                top={top} 
                dayTop={dayTop} 
                statusTop={statusTop} 
                isCompleted={dayProgress?.isCompleted} 
                isAccessible={dayProgress?.isAccessible}
                isDateUnlocked={dayProgress?.isDateUnlocked}
              />
            );
          })}

          {/* Progress Bar */}
          <div className="absolute bg-white w-[15px] h-[523px] left-[473.99px] top-[114px]" />
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden px-4 py-6 space-y-6 pb-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-black text-white p-4 rounded-lg">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8">
            <img src={leftArrow} alt="Back" className="w-full h-full object-contain brightness-0 invert" />
          </button>
          <div className="font-whirlyBirdie font-bold text-lg whitespace-nowrap">
            Day {displayDay} Of {progress?.progress.length || 10}
          </div>
          <button onClick={() => setIsOpen(true)} className="bg-transparent border border-white px-3 py-1.5 rounded text-sm hover:bg-gray-800 transition-colors">
            Tutorial
          </button>
        </div>

        {/* Question Section */}
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="font-whirlyBirdie font-bold text-lg mb-3">
            {question?.question || "I hold two people inside me forever, but i'm not a home. What am i ?"}
          </div>
          <div className="w-full h-px bg-white my-3" />

          {/* Image Grid - Dynamic */}
          <div
            className="mt-4"
            style={{
              display: 'grid',
              gridTemplateColumns: questionImages.length === 1
                ? '1fr'
                : questionImages.length === 2
                  ? 'repeat(2, 1fr)'
                  : questionImages.length === 3
                    ? 'repeat(2, 1fr)'
                    : questionImages.length <= 4
                      ? 'repeat(2, 1fr)'
                      : 'repeat(3, 1fr)',
              gap: '8px'
            }}
          >
            {questionImages.map((image, i) => (
              <div
                key={i}
                className="relative aspect-square border border-white rounded overflow-hidden bg-black"
                style={questionImages.length === 1 ? { maxWidth: '300px', margin: '0 auto' } : {}}
              >
                {image && (
                  <img
                    src={image}
                    alt={`Question image ${i + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${squareImagesLoaded[i] ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => setSquareImagesLoaded(prev => {
                      const newState = [...prev];
                      newState[i] = true;
                      return newState;
                    })}
                    onError={() => setSquareImagesLoaded(prev => {
                      const newState = [...prev];
                      newState[i] = true;
                      return newState;
                    })}
                  />
                )}
                {!squareImagesLoaded[i] && image && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Section */}
        <div className="space-y-3">
          <div className="font-whirlyBirdie font-bold text-black text-lg">ANSWER :</div>
          <div className="relative">
            <Input
              id="answer-input-mobile"
              placeholder="Enter Your Answer"
              value={answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswer(e.target.value)}
              disabled={cooldownSeconds > 0 || submitting}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSubmit()}
              className="w-full h-12 text-base"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting || cooldownSeconds > 0}
            className="w-full bg-black text-white font-whirlyBirdie font-bold hover:bg-gray-800 disabled:opacity-50 h-12 text-base"
          >
            {submitting ? 'Submitting...' : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'SUBMIT'}
          </Button>
          {message && (
            <div
              className={`font-poppins text-sm font-medium p-3 rounded ${message.includes('Correct') || message.includes('Success') || message.includes('🎉')
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="font-whirlyBirdie font-bold text-lg mb-4 text-center">Your progress</div>
          <div className="grid grid-cols-3 gap-3">
            {DAY_BOXES.map(({ day }, idx) => {
              const dayProgress = progress?.progress[idx];
              const isCompleted = dayProgress?.isCompleted;
              const isAvailable = dayProgress?.isAccessible && dayProgress?.isDateUnlocked !== false;
              
              // Determine background color: completed > available > locked
              let bgColor = 'bg-gray-400'; // default for locked
              let textColor = 'text-white';
              
              if (isCompleted) {
                bgColor = 'bg-[#f6efe6]'; // beige for completed
                textColor = 'text-black';
              } else if (isAvailable) {
                bgColor = 'bg-white'; // white for available/unlocked
                textColor = 'text-black';
              }
              
              return (
                <div key={day} className={`${bgColor} rounded p-3 text-center`}>
                  <div className={`font-whirlyBirdie font-bold ${textColor} text-sm mb-1 whitespace-nowrap`}>day {day}</div>
                  <div className={`font-poppins font-medium ${textColor} text-xs`}>
                    {isCompleted ? "Completed" : "In Progress"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tutorial Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-black border border-white w-full max-w-[340px] md:max-w-[500px] h-[500px] md:h-[600px] shadow-2xl flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Grid */}
              <div className="grid grid-cols-[1fr_2fr_1fr] h-[60px] md:h-[70px] border-b border-white shrink-0">
                <div className="border-r border-white"></div>
                <div className="flex items-center justify-center font-whirlyBirdie font-bold text-white text-xl md:text-2xl tracking-wider">
                  TUTORIAL
                </div>
                <div className="border-l border-white">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full h-full flex items-center justify-center font-whirlyBirdie font-bold text-[#ef4444] text-xl md:text-2xl hover:bg-[#ef4444] hover:text-white transition-colors"
                  >
                    X
                  </button>
                </div>
              </div>

              {/* Slide Content */}
              <div className="p-4 md:p-6 flex flex-col items-center grow overflow-hidden">
                {/* Title (e.g. QUESTION, CONCLUSION) */}
                {(TUTORIAL_SLIDES[currentSlide] as any).title && (
                  <div className="text-xs md:text-sm text-gray-400 mb-4 tracking-widest font-whirlyBirdie font-bold">
                    {(TUTORIAL_SLIDES[currentSlide] as any).title}
                  </div>
                )}

                {/* Image Area - Hide for conclusion */}
                {!(TUTORIAL_SLIDES[currentSlide] as any).title || (TUTORIAL_SLIDES[currentSlide] as any).title !== 'CONCLUSION' ? (
                  /* Logic to show image if it exists, or placeholder if not conclusion (though currently all non-conclusion have images) */
                  /* Wait, my previous logic was: hide if title exists? No, hide if title is present AND it's the conclusion? 
                     The user wants 'QUESTION' title AND image.
                     The previous logic '!(...title)' hid image for Conclusion. 
                     Now 'Question' also has title.
                     I need to specifically hide image ONLY for Conclusion slide, or based on image presence.
                     Slide 6 has image: null. Slide 1 has image: alchemist.
                     The easiest check is: if (image) show image.
                  */
                  (TUTORIAL_SLIDES[currentSlide] as any).image ? (
                    <div className="w-full flex justify-center mb-4 md:mb-6 h-[160px] md:h-[200px] shrink-0 relative">
                      <div className="border border-white p-1.5 md:p-2 h-full aspect-square">
                        <img
                          src={(TUTORIAL_SLIDES[currentSlide] as any).image}
                          alt={`Slide ${currentSlide + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (TUTORIAL_SLIDES[currentSlide] as any).title !== 'CONCLUSION' && (
                    <div className="w-full flex justify-center mb-4 md:mb-6 h-[160px] md:h-[200px] shrink-0 relative">
                      <div className="flex items-center justify-center h-full text-white font-orbitron text-4xl">
                        🧩
                      </div>
                    </div>
                  )
                ) : null}

                {/* Text Content */}
                <div className="text-center font-whirlyBirdie font-bold text-white text-[11px] md:text-sm leading-relaxed uppercase max-w-sm tracking-wide grow overflow-y-auto w-full scrollbar-hide pt-2 flex flex-col items-center">

                  <div className="mb-4">
                    {TUTORIAL_SLIDES[currentSlide].text.includes(":") ? (
                      (() => {
                        const parts = TUTORIAL_SLIDES[currentSlide].text.split(":");
                        const prefix = parts[0];
                        const rest = parts.slice(1).join(":");
                        return (
                          <span>
                            <span className="text-gray-400 font-bold">{prefix} :</span>
                            {rest}
                          </span>
                        );
                      })()
                    ) : (
                      TUTORIAL_SLIDES[currentSlide].text
                    )}
                  </div>

                  {/* Optional Answer Display */}
                  {(TUTORIAL_SLIDES[currentSlide] as any).answer && (
                    <div className="mt-2">
                      <div className="text-xs md:text-sm text-gray-400 mb-1">ANSWER :</div>
                      <div className="text-xl md:text-2xl tracking-widest text-[#10b981]">
                        {(TUTORIAL_SLIDES[currentSlide] as any).answer}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="border-t border-white h-[60px] flex items-center justify-between px-6 shrink-0">
                {/* Back Button */}
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className={`font-whirlyBirdie font-bold text-white text-sm md:text-base hover:text-gray-300 transition-colors uppercase tracking-wider ${currentSlide === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                >
                  &lt; BACK
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {TUTORIAL_SLIDES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full border border-white transition-all duration-300 ${idx === currentSlide ? 'bg-white' : 'bg-transparent'}`}
                    />
                  ))}
                </div>

                {/* Next/Close Button */}
                {/* Next/Close Button */}
                {currentSlide === TUTORIAL_SLIDES.length - 1 ? (
                  <div className="w-[60px] md:w-[70px]" />
                ) : (
                  <button
                    onClick={nextSlide}
                    className="font-whirlyBirdie font-bold text-white text-sm md:text-base hover:text-gray-300 transition-colors uppercase tracking-wider"
                  >
                    NEXT &gt;
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Congratulations Popup */}
      <AnimatePresence>
        {showFinalCongrats && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-2xl p-6 max-w-md w-full mx-4 text-center bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-semibold text-white mb-4 tracking-wide">🎉 Congratulations! 🎉</h2>
              <p className="text-gray-200 leading-relaxed">You've completed all available challenges!<br />Absolute legend energy.</p>
              <div className="mt-6">
                <button onClick={() => setShowFinalCongrats(false)} className="px-6 py-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors border border-white/30">Awesome!</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PlayPage;
