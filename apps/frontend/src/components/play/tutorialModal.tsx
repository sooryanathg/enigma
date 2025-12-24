import { motion, AnimatePresence } from "framer-motion";

interface TutorialSlide {
  image?: string | null;
  title?: string;
  text: string;
  answer?: string;
  guidingThought?: string;
  questionText?: string;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import alchemist from "@/assets/alchemist.png";
import rumi from "@/assets/rumi.png";
import sand_storm from "@/assets/sand_storm.png";
import pyramid from "@/assets/pyramid.png";
import hawkings from "@/assets/hawkings.png";
import { usePlay } from "@/hooks/usePlay";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    image: null,
    title: "Welcome to the Enigma Tutorial",
    text: "Let’s walk through how to crack an Enigma question.\n\nDon’t rush to the answer — the magic is in connecting the clues.\n\nWatch how each hint quietly points to the same destination.",
  },
  {
    image: alchemist,
    title: "QUESTION",
    text: "At first glance, this might feel abstract.\nBut Enigma questions are designed so every clue matters — and nothing is random.",
    questionText:
      "I SPEAK WITHOUT WORDS, GUIDE WITHOUT MAPS, AND ONLY THOSE WHO LISTEN WITH THEIR HEART UNDERSTAND ME. I AM THE ACTUAL TREASURE HUNT... DISCOVER WHERE I HIDE!!",
  },
  {
    image: rumi,
    title: "CLUE 1 - RUMI",
    text: 'Jalaluddin Rumi is best known for one powerful belief:\n"When you follow your true path, the universe helps you."\nThis idea is often reused in stories that talk about destiny, purpose, and inner journeys.',
    guidingThought:
      "Ask yourself: What kind of work uses this philosophy as its core theme?",
  },
  {
    image: sand_storm,
    title: "CLUE 2 — SANDSTORM",
    text: "Sandstorms aren’t just weather — in storytelling, they often represent transformation and tests.\nSome famous stories even go as far as turning the traveler into the wind itself.",
    guidingThought:
      "This points toward a symbolic desert journey, not a random setting.",
  },
  {
    image: pyramid,
    title: "CLUE 3 — PYRAMID",
    text: "The pyramids have long been used as symbols of ultimate truth, hidden treasure, and completion.\nVery few stories make them the literal end goal of a journey.",
    guidingThought:
      "Think of a narrative where the journey ends at the pyramids.",
  },
  {
    image: hawkings,
    title: "CLUE 4 — STEPHEN HAWKING",
    text: "Stephen Hawking’s A Brief History of Time was released in 1988.\nThat same year saw the release of another book — one that also went on to become globally iconic.",
    guidingThought: "This clue doesn’t describe the story — it confirms it.",
  },
  {
    image: null,
    title: "CONCLUSION",
    text: "A story rooted in destiny and purpose.\nA symbolic desert journey.\nA final destination at the Egyptian pyramids.\nPublished in 1988.\nAll clues converge on one book.",
    answer: "ALCHEMIST",
  },
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = TUTORIAL_SLIDES[currentSlide];
  const { currentUser } = useAuth();

  const { submitTutorial } = usePlay(currentUser);

  const closeModal = () => {
    onClose();
    submitTutorial();
    setTimeout(() => setCurrentSlide(0), 300); // Reset slide after animation
  };

  const next = () =>
    currentSlide < TUTORIAL_SLIDES.length - 1 &&
    setCurrentSlide(currentSlide + 1);

  const prev = () => currentSlide > 0 && setCurrentSlide(currentSlide - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black border border-white w-full max-w-[340px] md:max-w-[600px] h-[500px] md:h-[600px] shadow-2xl flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="grid grid-cols-[1fr_2fr_1fr] h-[60px] border-b border-white">
              <div />
              <div className="flex items-center justify-center font-whirlyBirdie font-bold text-white text-xl">
                TUTORIAL
              </div>
              <button
                onClick={closeModal}
                className="font-whirlyBirdie font-bold text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
              >
                X
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col items-center grow overflow-hidden w-full">
              {slide.title && (
                <div className="text-lg md:text-xl text-gray-400 mb-4 font-whirlyBirdie font-bold text-center shrink-0">
                  {slide.title}
                </div>
              )}

              {/* Special Layout for Question Slide */}
              {slide.questionText ? (
                <div className="flex flex-col items-center w-full max-w-sm md:max-w-md overflow-hidden flex-1 justify-center p-1">
                  <div className="border border-white p-2 md:p-4 mb-2 md:mb-4 w-full flex flex-col items-center shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0">
                    {slide.image && (
                      <div className="mb-2 w-[100px] md:w-[180px] aspect-square shrink-0">
                        <img
                          src={slide.image}
                          alt="tutorial"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-center font-whirlyBirdie font-bold text-white text-[8px] md:text-xs leading-relaxed uppercase">
                      {slide.questionText}
                    </div>
                  </div>
                  <div className="text-center font-whirlyBirdie font-bold text-white text-[9px] md:text-sm leading-relaxed uppercase whitespace-pre-line shrink-0 px-2 pb-1 md:pb-2">
                    {slide.text}
                  </div>
                </div>
              ) : currentSlide === 0 ? (
                /* Special Layout for Welcome Slide */
                <div className="flex flex-col items-center justify-center w-full max-w-lg overflow-y-auto scrollbar-hide h-full px-4">
                  <div className="font-whirlyBirdie font-bold text-white text-sm md:text-base leading-loose uppercase space-y-6">
                    {slide.text.split("\n\n").map((point, i) => (
                      <div key={i} className="flex gap-3 text-left">
                        <span className="text-[#10b981] shrink-0 transform scale-150">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full max-w-sm md:max-w-md flex-1 justify-center overflow-hidden px-2">
                  {slide.image && (
                    <div className="mb-1 md:mb-4 w-[80px] md:w-[130px] aspect-square shrink-0">
                      <div className="border border-white p-1 md:p-2 h-full w-full">
                        <img
                          src={slide.image}
                          alt="tutorial"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-center font-whirlyBirdie font-bold text-white text-[10px] md:text-sm leading-relaxed uppercase whitespace-pre-line shrink-0">
                    {slide.text}
                  </div>

                  {slide.guidingThought && (
                    <div className="mt-1 md:mt-4 text-center w-full shrink-0">
                      <div className="text-gray-400 font-whirlyBirdie font-bold text-[10px] md:text-xs mb-1">
                        GUIDING THOUGHT:
                      </div>
                      <div className="text-white text-[10px] md:text-sm font-whirlyBirdie leading-relaxed uppercase">
                        {slide.guidingThought}
                      </div>
                    </div>
                  )}

                  {slide.answer && (
                    <div className="mt-4 text-center">
                      <div className="text-xs text-gray-400 font-whirlyBirdie font-bold">
                        ANSWER :
                      </div>
                      <div className="text-2xl tracking-widest text-[#10b981] font-whirlyBirdie font-bold mt-1">
                        {slide.answer}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white h-[60px] flex items-center justify-between px-6">
              <button
                onClick={prev}
                disabled={currentSlide === 0}
                className={`font-whirlyBirdie font-bold text-xs md:text-base text-white ${currentSlide === 0 ? "opacity-0" : "opacity-100"
                  }`}
              >
                &lt; BACK
              </button>

              <div className="flex gap-2">
                {TUTORIAL_SLIDES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-white ${i === currentSlide ? "bg-white" : ""
                      }`}
                  />
                ))}
              </div>

              {currentSlide < TUTORIAL_SLIDES.length - 1 ? (
                <button
                  onClick={next}
                  className="font-whirlyBirdie font-bold text-xs md:text-base text-white"
                >
                  NEXT &gt;
                </button>
              ) : (
                <div className="w-[60px]" />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
