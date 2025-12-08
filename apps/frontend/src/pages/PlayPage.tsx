import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentDay } from '../services/firestoreService';
import { usePlay } from '../hooks/usePlay';
import ProgressGrid from '../components/play/ProgressGrid';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";

import tutor1 from '@/assets/tutor1.jpeg';
import tutor2 from '@/assets/tutor2.jpeg';
import QuestionImage from '@/components/ui/questionImage';
import leftArrow from '@/assets/left-arrow.svg';

function PlayPage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const {
    displayDay,
    question,
    progress,
    cooldownSeconds,
    initialize,
    fetchQuestion,
    submitAnswer,
  } = usePlay(currentUser);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [squareImagesLoaded, setSquareImagesLoaded] = useState([false, false, false, false]);

  useEffect(() => {
    setImageLoaded(false);
    setSquareImagesLoaded([false, false, false, false]);
  }, [question?.image]);

  useEffect(() => {
    if (currentUser) initialize();
  }, [currentUser, initialize]);

  const handleSelectDay = useCallback(async (day: number) => {
    const currentDay = getCurrentDay();
    if (day > await currentDay) return;
    await fetchQuestion(day);
  }, [fetchQuestion]);

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
        setAnswer('');

        await fetchQuestion(displayDay);
      }
    } finally {
      setSubmitting(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [showFinalCongrats, setShowFinalCongrats] = useState(false);
  useEffect(() => {
    if (question?.isCompleted && displayDay === progress?.progress.length) {
      setShowFinalCongrats(true);
    }
  }, [question, displayDay, progress]);




  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-transparent pt-14 relative overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 pt-20 font-orbitron">
        {/* Group 78 - Top Rectangle */}
        <div className="hidden lg:block">
          <div className="absolute bg-black" style={{ width: "1452px", height: "104px", left: "29.01px", top: "121px" }}>
            {/* Left Arrow */}
            <button
              onClick={() => navigate(-1)}
              className="absolute flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                left: "4.03%",
                top: "34.62%",
                width: "30px",
                height: "30px",
                background: "transparent",
                border: "none"
              }}
            >
              <img src={leftArrow} alt="Left arrow" className="w-full h-full object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </button>
          </div>
          {/* Day X Of Y Text */}
          <div
            className="absolute font-whirlyBirdie font-bold text-white text-center"
            style={{
              width: "210px",
              height: "29px",
              left: "130.01px",
              top: "157px",
              fontSize: "24px",
              lineHeight: "29px"
            }}
          >
            Day {displayDay} Of {progress?.progress.length || 10}
          </div>
          {/* Tutorial Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bg-black text-white border border-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            style={{
              width: "138px",
              height: "45px",
              left: "1321px",
              top: "150px"
            }}
          >
            Tutorial
          </button>
          {/* Group 79 - Left Rectangle */}
          <div className="absolute bg-black border border-black" style={{ width: "918.03px", height: "528px", left: "29px", top: "249px" }}>
            {/* Question Text */}
            <div
              className="absolute font-whirlyBirdie font-bold text-white"
              style={{
                width: "733px",
                height: "60px",
                left: "calc(50% - 733px/2 - 50px)",
                top: "0px",
                paddingTop: "20px",
                fontSize: "20px",
                lineHeight: "30px"
              }}
            >
              {question?.question || "I hold two people inside me forever, but i'm not a home. What am i ?"}
            </div>
            {/* Line 36 - Divider */}
            <div
              className="absolute"
              style={{
                width: "918.03px",
                height: "0px",
                left: "0px",
                top: "113.5px",
                border: "1px solid #FFFFFF"
              }}
            />
          </div>
          {/* Rectangle 40210 - Square */}
          <div
            className="absolute box-border overflow-hidden"
            style={{
              width: "165px",
              height: "165px",
              left: "321px",
              top: "389px",
              border: "1px solid #FFFFFF"
            }}
          >
            {question?.image && (
              <img
                src={question.image}
                onLoad={() => setSquareImagesLoaded(prev => [true, prev[1], prev[2], prev[3]])}
                onError={() => setSquareImagesLoaded(prev => [true, prev[1], prev[2], prev[3]])}
                className={`w-full h-full object-cover ${squareImagesLoaded[0] ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                alt="Question image 1"
              />
            )}
            {!squareImagesLoaded[0] && question?.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          {/* Rectangle 40211 - Square */}
          <div
            className="absolute box-border overflow-hidden"
            style={{
              width: "165px",
              height: "165px",
              left: "496px",
              top: "389px",
              border: "1px solid #FFFFFF"
            }}
          >
            {question?.image && (
              <img
                src={question.image}
                onLoad={() => setSquareImagesLoaded(prev => [prev[0], true, prev[2], prev[3]])}
                onError={() => setSquareImagesLoaded(prev => [prev[0], true, prev[2], prev[3]])}
                className={`w-full h-full object-cover ${squareImagesLoaded[1] ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                alt="Question image 2"
              />
            )}
            {!squareImagesLoaded[1] && question?.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
          </div>
          {/* Rectangle 40212 - Square */}
          <div
            className="absolute box-border overflow-hidden"
            style={{
              width: "165px",
              height: "165px",
              left: "321px",
              top: "564px",
              border: "1px solid #FFFFFF"
            }}
          >
            {question?.image && (
              <img
                src={question.image}
                onLoad={() => setSquareImagesLoaded(prev => [prev[0], prev[1], true, prev[3]])}
                onError={() => setSquareImagesLoaded(prev => [prev[0], prev[1], true, prev[3]])}
                className={`w-full h-full object-cover ${squareImagesLoaded[2] ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                alt="Question image 3"
              />
            )}
            {!squareImagesLoaded[2] && question?.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
                </div>
          {/* Rectangle 40213 - Square */}
          <div
            className="absolute box-border overflow-hidden"
            style={{
              width: "165px",
              height: "165px",
              left: "496px",
              top: "564px",
              border: "1px solid #FFFFFF"
            }}
          >
            {question?.image && (
              <img
                src={question.image}
                onLoad={() => setSquareImagesLoaded(prev => [prev[0], prev[1], prev[2], true])}
                onError={() => setSquareImagesLoaded(prev => [prev[0], prev[1], prev[2], true])}
                className={`w-full h-full object-cover ${squareImagesLoaded[3] ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                alt="Question image 4"
              />
            )}
            {!squareImagesLoaded[3] && question?.image && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
                    </div>
          {/* ANSWER : Text */}
          <div
            className="absolute font-whirlyBirdie font-bold text-black text-center"
            style={{
              width: "191px",
              height: "29px",
              left: "29px",
              top: "808px",
              fontSize: "24px",
              lineHeight: "29px"
            }}
          >
            ANSWER :
                  </div>
          {/* Group 82 - Answer Input Field */}
          <div
            className="absolute"
            style={{
              width: "701px",
              height: "73px",
              left: "29.01px",
              top: "851px"
            }}
          >
                      <Input
                        id="answer-input"
              placeholder=""
                        value={answer}
                        onChange={(e: any) => setAnswer(e.target.value)}
                        disabled={cooldownSeconds > 0 || submitting}
                        onKeyDown={(e: any) => e.key === 'Enter' && handleSubmit()}
              className="w-full h-full"
            />
          </div>
          {/* Enter Your Answer Text */}
          {!answer && (
            <div
              className="absolute pointer-events-none font-poppins font-medium"
              style={{
                width: "218px",
                height: "36px",
                left: "60px",
                top: "872px",
                fontSize: "24px",
                lineHeight: "36px",
                color: "#6B6B6B"
              }}
            >
              Enter Your Answer
            </div>
          )}
          {/* Group 77 - Submit Button */}
          <div
            className="absolute"
            style={{
              width: "216px",
              height: "73px",
              left: "731px",
              top: "851px"
            }}
          >
            <Button
              onClick={handleSubmit}
              disabled={submitting || cooldownSeconds > 0}
              className="w-full h-full bg-black text-white font-whirlyBirdie font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
              style={{
                fontSize: "24px",
                lineHeight: "29px"
              }}
            >
              {submitting ? 'Submitting...' : cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'SUBMIT'}
                        </Button>
                      </div>
          {/* Rectangle 40202 - Right Rectangle */}
          <div
            className="absolute bg-black"
            style={{
              width: "514px",
              height: "675px",
              left: "968.02px",
              top: "249px"
            }}
          >
            {/* Your progress Text */}
            <div
              className="absolute font-whirlyBirdie font-bold text-white text-center"
              style={{
                width: "332px",
                height: "29px",
                left: "25px",
                top: "55px",
                fontSize: "24px",
                lineHeight: "29px"
              }}
            >
              Your progress
            </div>
            {/* Day 1 Box */}
            <div
              className="absolute bg-white"
              style={{
                width: "126.08px",
                height: "94px",
                left: "24.99px",
                top: "114px"
              }}
            />
            <div
              className="absolute font-whirlyBirdie font-bold text-black text-center"
              style={{
                width: "89px",
                height: "24px",
                left: "42.99px",
                top: "139px",
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "nowrap"
              }}
            >
              day 1
            </div>
            <div
              className="absolute font-poppins font-medium text-black text-center"
              style={{
                width: "105px",
                height: "24px",
                left: "34.99px",
                top: "161px",
                fontSize: "16px",
                lineHeight: "24px"
              }}
            >
              {progress?.progress[0]?.isCompleted ? "Completed" : "In Progress"}
            </div>
            {/* Day 2 Box */}
            <div
              className="absolute bg-white"
              style={{
                width: "126.08px",
                height: "94px",
                left: "171.07px",
                top: "114px"
              }}
            />
            <div
              className="absolute font-whirlyBirdie font-bold text-black text-center"
              style={{
                width: "89px",
                height: "24px",
                left: "189.07px",
                top: "139px",
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "nowrap"
              }}
            >
              day 2
            </div>
            <div
              className="absolute font-poppins font-medium text-black text-center"
              style={{
                width: "105px",
                height: "24px",
                left: "181.07px",
                top: "161px",
                fontSize: "16px",
                lineHeight: "24px"
              }}
            >
              {progress?.progress[1]?.isCompleted ? "Completed" : "In Progress"}
            </div>
            {/* Day 3 Box */}
            <div
              className="absolute bg-white"
              style={{
                width: "126.08px",
                height: "94px",
                left: "317.15px",
                top: "114px"
              }}
            />
            <div
              className="absolute font-whirlyBirdie font-bold text-black text-center"
              style={{
                width: "89px",
                height: "24px",
                left: "335.15px",
                top: "139px",
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "nowrap"
              }}
            >
              day 3
                    </div>
            <div
              className="absolute font-poppins font-medium text-black text-center"
              style={{
                width: "105px",
                height: "24px",
                left: "327.15px",
                top: "161px",
                fontSize: "16px",
                lineHeight: "24px"
              }}
            >
              {progress?.progress[2]?.isCompleted ? "Completed" : "In Progress"}
                  </div>
            {/* Day 4 Box */}
            <div
              className="absolute bg-white"
              style={{
                width: "126.08px",
                height: "94px",
                left: "24.99px",
                top: "228px"
              }}
            />
            <div
              className="absolute font-whirlyBirdie font-bold text-black text-center"
              style={{
                width: "89px",
                height: "24px",
                left: "42.99px",
                top: "253px",
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "nowrap"
              }}
            >
              day 4
            </div>
            <div
              className="absolute font-poppins font-medium text-black text-center"
              style={{
                width: "105px",
                height: "24px",
                left: "34.99px",
                top: "275px",
                fontSize: "16px",
                lineHeight: "24px"
              }}
            >
              {progress?.progress[3]?.isCompleted ? "Completed" : "In Progress"}
            </div>
            {/* Day 5 Box */}
            <div
              className="absolute bg-white"
              style={{
                width: "126.08px",
                height: "94px",
                left: "171.07px",
                top: "228px"
              }}
            />
            <div
              className="absolute font-whirlyBirdie font-bold text-black text-center"
              style={{
                width: "89px",
                height: "24px",
                left: "189.07px",
                top: "253px",
                fontSize: "20px",
                lineHeight: "24px",
                whiteSpace: "nowrap"
              }}
            >
              day 5
            </div>
            <div
              className="absolute font-poppins font-medium text-black text-center"
              style={{
                width: "105px",
                height: "24px",
                left: "181.07px",
                top: "275px",
                fontSize: "16px",
                lineHeight: "24px"
              }}
            >
              {progress?.progress[4]?.isCompleted ? "Completed" : "In Progress"}
            </div>
            {/* Group 106 - Progress Bar */}
            <div
              className="absolute bg-white"
              style={{
                width: "15px",
                height: "523px",
                left: "473.99px",
                top: "114px"
              }}
            />
          </div>
        </div>

          {/* Popup */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 font-sans"
                  initial={{ scale: 0.8, opacity: 0, y: -50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Tutorial heading with underline */}
                  <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4 pb-3 border-b border-gray-200 tracking-tight">Tutorial</h2>

                  {/* Two images in one row */}
                  <div className="flex gap-4 justify-center mt-4">
                    <img
                      src={tutor1}
                      alt="Dummy"
                      className="w-[128px] h-[128px] md:w-[156px] md:h-[156px] object-cover rounded-lg"
                    />
                    <img
                      src={tutor2}
                      alt="Dummy1"
                      className="w-[128px] h-[128px] md:w-[156px] md:h-[156px] object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 leading-relaxed">
                      France gifted the Statue of Liberty to the USA. <br />
                      It was made of copper and over time it turned green due to chemical reactions.
                    </p>
                    <p className="mt-4 font-medium text-gray-900 text-lg">
                      Answer: <span className="font-semibold">Statue of Liberty</span>
                    </p>
                  </div>

                  {/* Close button */}
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-sm tracking-wide"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        <AnimatePresence>
  {showFinalCongrats && (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="rounded-2xl p-6 max-w-md w-full mx-4 text-center 
                   bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4 tracking-wide">
          🎉 Congratulations! 🎉
        </h2>

        <p className="text-gray-200 leading-relaxed">
          You’ve completed all available challenges!<br />
          Absolute legend energy.
        </p>

        <div className="mt-6">
          <button
            onClick={() => setShowFinalCongrats(false)}
            className="px-6 py-2.5 rounded-lg bg-white/20 text-white 
                       hover:bg-white/30 transition-colors border border-white/30"
          >
            Awesome!
          </button>
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
