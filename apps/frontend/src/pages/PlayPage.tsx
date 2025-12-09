import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlay } from '../hooks/usePlay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import tutor1 from '@/assets/tutor1.jpeg';
import tutor2 from '@/assets/tutor2.jpeg';
import leftArrow from '@/assets/left-arrow.svg';

// Calculate optimal grid layout based on number of images
const calculateGridLayout = (imageCount: number, containerWidth: number, containerHeight: number, startTop: number, startLeft: number) => {
  if (imageCount === 0) return [];
  
  if (imageCount === 1) {
    // Single large square, centered
    const size = Math.min(400, containerWidth - 100, containerHeight - 150);
    const left = startLeft + (containerWidth - size) / 2;
    const top = startTop + 50;
    return [{ left, top, width: size, height: size }];
  }
  
  if (imageCount === 2) {
    // Two squares side by side
    const gap = 20;
    const size = Math.min(200, (containerWidth - gap - 40) / 2);
    const totalWidth = size * 2 + gap;
    const leftStart = startLeft + (containerWidth - totalWidth) / 2;
    const top = startTop + 50;
    return [
      { left: leftStart, top, width: size, height: size },
      { left: leftStart + size + gap, top, width: size, height: size }
    ];
  }
  
  if (imageCount === 3) {
    // Two on top, one below (centered)
    const gap = 20;
    const size = Math.min(180, (containerWidth - gap - 40) / 2);
    const topRowLeft = startLeft + (containerWidth - (size * 2 + gap)) / 2;
    const bottomLeft = startLeft + (containerWidth - size) / 2;
    return [
      { left: topRowLeft, top: startTop + 50, width: size, height: size },
      { left: topRowLeft + size + gap, top: startTop + 50, width: size, height: size },
      { left: bottomLeft, top: startTop + 50 + size + gap, width: size, height: size }
    ];
  }
  
  // For 4+ images, calculate optimal grid
  const gap = 15;
  let cols = 2;
  let rows = Math.ceil(imageCount / cols);
  
  // Optimize column count for better layout
  if (imageCount >= 6) cols = 3;
  if (imageCount >= 9) cols = 3;
  if (imageCount >= 12) cols = 4;
  
  rows = Math.ceil(imageCount / cols);
  
  const maxSize = Math.min(
    200,
    (containerWidth - (cols - 1) * gap - 40) / cols,
    (containerHeight - (rows - 1) * gap - 100) / rows
  );
  
  const totalWidth = cols * maxSize + (cols - 1) * gap;
  const leftStart = startLeft + (containerWidth - totalWidth) / 2;
  const topStart = startTop + 50;
  
  const positions = [];
  for (let i = 0; i < imageCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    positions.push({
      left: leftStart + col * (maxSize + gap),
      top: topStart + row * (maxSize + gap),
      width: maxSize,
      height: maxSize
    });
  }
  
  return positions;
};

const ImageSquare = ({ position, image, loaded, onLoad, index }: { position: { left: number; top: number; width: number; height: number }; image?: string; loaded: boolean; onLoad: () => void; index: number }) => {
  return (
    <div className="absolute box-border overflow-hidden" style={{ left: `${position.left}px`, top: `${position.top}px`, width: `${position.width}px`, height: `${position.height}px`, border: "1px solid #FFFFFF" }}>
      {image && <img src={image} onLoad={onLoad} onError={onLoad} className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} alt={`Question image ${index + 1}`} />}
      {!loaded && image && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>}
    </div>
  );
};

const DayBox = ({ day, left, top, dayTop, statusTop, isCompleted }: { day: number; left: string; top: string; dayTop: string; statusTop: string; isCompleted?: boolean }) => (
  <>
    <div className="absolute bg-white" style={{ width: "126.08px", height: "94px", left, top }} />
    <div className="absolute font-whirlyBirdie font-bold text-black text-center" style={{ width: "89px", height: "24px", left: `${parseFloat(left) + 18}px`, top: dayTop, fontSize: "20px", lineHeight: "24px", whiteSpace: "nowrap" }}>day {day}</div>
    <div className="absolute font-poppins font-medium text-black text-center" style={{ width: "105px", height: "24px", left: `${parseFloat(left) + 10}px`, top: statusTop, fontSize: "16px", lineHeight: "24px" }}>{isCompleted ? "Completed" : "In Progress"}</div>
  </>
);

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
    } catch (error) {
      setMessage('Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="min-h-screen bg-transparent relative overflow-y-auto" ref={containerRef}>
      {/* Desktop Layout */}
      <div 
        className="font-orbitron absolute top-0 left-0 hidden lg:block" 
        style={{ 
          transform: `scale(${scaleX}, ${scaleY})`, 
          transformOrigin: 'top left',
          width: `${100 / scaleX}%`,
          height: `${100 / scaleY}%`
        }}
      >
          {/* Top Rectangle */}
          <div className="absolute bg-black" style={{ width: "1452px", height: "104px", left: "29.01px", top: "121px" }}>
            <button onClick={() => navigate(-1)} className="absolute flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" style={{ left: "4.03%", top: "34.62%", width: "30px", height: "30px", background: "transparent", border: "none" }}>
              <img src={leftArrow} alt="Left arrow" className="w-full h-full object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </button>
          </div>
          
          {/* Day X Of Y Text */}
          <div className="absolute font-whirlyBirdie font-bold text-white text-center" style={{ width: "210px", height: "29px", left: "130.01px", top: "157px", fontSize: "24px", lineHeight: "29px", whiteSpace: "nowrap" }}>
            Day {displayDay} Of {progress?.progress.length || 10}
          </div>
          
          {/* Tutorial Button */}
          <button onClick={() => setIsOpen(true)} className="absolute bg-black text-white border border-white px-4 py-2 rounded hover:bg-gray-800 transition-colors" style={{ width: "138px", height: "45px", left: "1321px", top: "150px" }}>Tutorial</button>
          
          {/* Left Rectangle */}
          <div className="absolute bg-black border border-black" style={{ width: "918.03px", height: "528px", left: "29px", top: "249px" }}>
            <div className="absolute font-whirlyBirdie font-bold text-white" style={{ width: "733px", height: "60px", left: "calc(50% - 733px/2 - 50px)", top: "0px", paddingTop: "20px", fontSize: "20px", lineHeight: "30px" }}>
              {question?.question || "I hold two people inside me forever, but i'm not a home. What am i ?"}
            </div>
            <div className="absolute" style={{ width: "918.03px", height: "0px", left: "0px", top: "113.5px", border: "1px solid #FFFFFF" }} />
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
          <div className="absolute font-whirlyBirdie font-bold text-black text-center" style={{ width: "191px", height: "29px", left: "29px", top: "808px", fontSize: "24px", lineHeight: "29px" }}>ANSWER :</div>
          
          {/* Answer Input */}
          <div className="absolute" style={{ width: "701px", height: "73px", left: "29.01px", top: "851px" }}>
            <Input id="answer-input" placeholder="" value={answer} onChange={(e: any) => setAnswer(e.target.value)} disabled={cooldownSeconds > 0 || submitting} onKeyDown={(e: any) => e.key === 'Enter' && handleSubmit()} className="w-full h-full" />
          </div>
          
          {/* Placeholder Text */}
          {!answer && <div className="absolute pointer-events-none font-poppins font-medium" style={{ width: "218px", height: "36px", left: "60px", top: "872px", fontSize: "24px", lineHeight: "36px", color: "#6B6B6B" }}>Enter Your Answer</div>}
          
          {/* Submit Button */}
          <div className="absolute" style={{ width: "216px", height: "73px", left: "731px", top: "851px" }}>
            <Button onClick={handleSubmit} disabled={submitting || cooldownSeconds > 0} className="w-full h-full bg-black text-white font-whirlyBirdie font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center" style={{ fontSize: "24px", lineHeight: "29px" }}>
              {submitting ? 'Submitting...' : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'SUBMIT'}
            </Button>
          </div>
          
          {/* Message Display */}
          {message && (
            <div 
              className="absolute font-poppins text-base font-medium" 
              style={{ 
                left: "29px", 
                top: "940px", 
                color: message.includes('Correct') || message.includes('Success') || message.includes('🎉') ? "#10b981" : "#ef4444",
                maxWidth: "900px"
              }}
            >
              {message}
            </div>
          )}
          
          {/* Right Rectangle */}
          <div className="absolute bg-black" style={{ width: "514px", height: "675px", left: "968.02px", top: "249px" }}>
            <div className="absolute font-whirlyBirdie font-bold text-white text-center" style={{ width: "332px", height: "29px", left: "25px", top: "55px", fontSize: "24px", lineHeight: "29px" }}>Your progress</div>
            
            {/* Day Boxes */}
            {DAY_BOXES.map(({ day, left, top, dayTop, statusTop }, idx) => (
              <DayBox key={day} day={day} left={left} top={top} dayTop={dayTop} statusTop={statusTop} isCompleted={progress?.progress[idx]?.isCompleted} />
            ))}
            
            {/* Progress Bar */}
            <div className="absolute bg-white" style={{ width: "15px", height: "523px", left: "473.99px", top: "114px" }} />
          </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden px-4 py-6 space-y-6 pb-20">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-black text-white p-4 rounded-lg">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8">
            <img src={leftArrow} alt="Back" className="w-full h-full object-contain" style={{ filter: "brightness(0) invert(1)" }} />
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
              onChange={(e: any) => setAnswer(e.target.value)} 
              disabled={cooldownSeconds > 0 || submitting} 
              onKeyDown={(e: any) => e.key === 'Enter' && handleSubmit()} 
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
              className={`font-poppins text-sm font-medium p-3 rounded ${
                message.includes('Correct') || message.includes('Success') || message.includes('🎉') 
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
            {DAY_BOXES.map(({ day }, idx) => (
              <div key={day} className="bg-white rounded p-3 text-center">
                <div className="font-whirlyBirdie font-bold text-black text-sm mb-1 whitespace-nowrap">day {day}</div>
                <div className="font-poppins font-medium text-black text-xs">
                  {progress?.progress[idx]?.isCompleted ? "Completed" : "In Progress"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tutorial Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 font-sans" initial={{ scale: 0.8, opacity: 0, y: -50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4 pb-3 border-b border-gray-200 tracking-tight">Tutorial</h2>
              <div className="flex gap-4 justify-center mt-4">
                <img src={tutor1} alt="Tutorial 1" className="w-[128px] h-[128px] md:w-[156px] md:h-[156px] object-cover rounded-lg" />
                <img src={tutor2} alt="Tutorial 2" className="w-[128px] h-[128px] md:w-[156px] md:h-[156px] object-cover rounded-lg" />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-700 leading-relaxed">France gifted the Statue of Liberty to the USA. <br />It was made of copper and over time it turned green due to chemical reactions.</p>
                <p className="mt-4 font-medium text-gray-900 text-lg">Answer: <span className="font-semibold">Statue of Liberty</span></p>
              </div>
              <div className="mt-5 flex justify-center">
                <button onClick={() => setIsOpen(false)} className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-sm tracking-wide">Close</button>
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
