import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePlay } from '../hooks/usePlay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import tutor1 from '@/assets/tutor1.jpeg';
import tutor2 from '@/assets/tutor2.jpeg';
import leftArrow from '@/assets/left-arrow.svg';

const ImageSquare = ({ index, image, loaded, setLoaded }: { index: number; image?: string; loaded: boolean; setLoaded: (loaded: boolean) => void }) => (
  <div className="absolute box-border overflow-hidden" style={{ width: "165px", height: "165px", left: index % 2 === 0 ? "321px" : "496px", top: index < 2 ? "389px" : "564px", border: "1px solid #FFFFFF" }}>
    {image && <img src={image} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)} className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} alt={`Question image ${index + 1}`} />}
    {!loaded && image && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>}
  </div>
);

const DayBox = ({ day, left, top, dayTop, statusTop, isCompleted }: { day: number; left: string; top: string; dayTop: string; statusTop: string; isCompleted?: boolean }) => (
  <>
    <div className="absolute bg-white" style={{ width: "126.08px", height: "94px", left, top }} />
    <div className="absolute font-whirlyBirdie font-bold text-black text-center" style={{ width: "89px", height: "24px", left: `${parseFloat(left) + 18}px`, top: dayTop, fontSize: "20px", lineHeight: "24px", whiteSpace: "nowrap" }}>day {day}</div>
    <div className="absolute font-poppins font-medium text-black text-center" style={{ width: "105px", height: "24px", left: `${parseFloat(left) + 10}px`, top: statusTop, fontSize: "16px", lineHeight: "24px" }}>{isCompleted ? "Completed" : "In Progress"}</div>
  </>
);

function PlayPage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showFinalCongrats, setShowFinalCongrats] = useState(false);
  const [squareImagesLoaded, setSquareImagesLoaded] = useState([false, false, false, false]);
  
  const { displayDay, question, progress, cooldownSeconds, initialize, fetchQuestion, submitAnswer } = usePlay(currentUser);

  useEffect(() => {
    setSquareImagesLoaded([false, false, false, false]);
  }, [question?.image]);

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

  const updateSquareLoaded = (index: number) => {
    setSquareImagesLoaded(prev => prev.map((val, i) => i === index ? true : val));
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="min-h-screen bg-transparent pt-14 relative overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 pt-20 font-orbitron">
        <div className="hidden lg:block">
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
          
          {/* Image Squares */}
          {[0, 1, 2, 3].map(i => <ImageSquare key={i} index={i} image={question?.image} loaded={squareImagesLoaded[i]} setLoaded={() => updateSquareLoaded(i)} />)}
          
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
            <DayBox day={1} left="24.99px" top="114px" dayTop="139px" statusTop="161px" isCompleted={progress?.progress[0]?.isCompleted} />
            <DayBox day={2} left="171.07px" top="114px" dayTop="139px" statusTop="161px" isCompleted={progress?.progress[1]?.isCompleted} />
            <DayBox day={3} left="317.15px" top="114px" dayTop="139px" statusTop="161px" isCompleted={progress?.progress[2]?.isCompleted} />
            <DayBox day={4} left="24.99px" top="228px" dayTop="253px" statusTop="275px" isCompleted={progress?.progress[3]?.isCompleted} />
            <DayBox day={5} left="171.07px" top="228px" dayTop="253px" statusTop="275px" isCompleted={progress?.progress[4]?.isCompleted} />
            
            {/* Progress Bar */}
            <div className="absolute bg-white" style={{ width: "15px", height: "523px", left: "473.99px", top: "114px" }} />
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
      </div>
    </motion.div>
  );
}

export default PlayPage;
