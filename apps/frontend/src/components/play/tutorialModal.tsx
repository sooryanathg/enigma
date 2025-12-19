import { motion, AnimatePresence } from "framer-motion";

interface TutorialSlide {
  image?: string | null;
  title?: string;
  text: string;
  answer?: string;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

import alchemist from "@/assets/alchemist.png";
import rumi from "@/assets/rumi.png";
import sand_storm from "@/assets/sand_storm.png";
import pyramid from "@/assets/pyramid.png";
import hawkings from "@/assets/hawkings.png";

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    image: alchemist,
    title: "QUESTION",
    text: "I speak without words, guide without maps, and only those who listen with their heart understand me. I am the actual treasure hunt... Discover where I hide!!",
  },
  {
    image: rumi,
    text: '1. Clue of poet Rumi : The novel is deeply influenced by Sufi philosophy and closely resembles the teachings of Jalaluddin Rumi, the 13th century Sufi poet. Both The Alchemist and Rumi emphasize " The Universe helps you when you follow your true path"',
  },
  {
    image: sand_storm,
    text: "2. Clue of Sand Storm: There are several scenes of Sand storm in The Alchemist also the protagonist himself turns into sandstorm wind",
  },
  {
    image: pyramid,
    text: "3. Clue of Pyramid : The pyramids are the final destination of Santiago, the protagonist.",
  },
  {
    image: hawkings,
    text: '4. Clue of Stephen Hawking : His famous book "The Brief History of Time" is also released in the year 1988, the same year Paulo Coelho published "The Alchemist"',
  },
  {
    image: null,
    title: "CONCLUSION",
    text: "Each clue converges on The Alchemist: the novel is steeped in Sufi-like wisdom (Rumi-style guidance about following your true path), contains vivid desert imagery and a literal sandstorm sequence, culminates at the Egyptian pyramids (Santiago's final destination), and was first published in 1988 — the same year Hawking's A Brief History of Time came out, giving a neat date-based cross-clue. Put those together and there's only one book that fits all four hints.",
    answer: "ALCHEMIST",
  },
];

export default function TutorialModal({
  isOpen,
  onClose,
  currentSlide,
  setCurrentSlide,
}: TutorialModalProps) {
  const slide = TUTORIAL_SLIDES[currentSlide];

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
            className="bg-black border border-white w-full max-w-[340px] md:max-w-[500px] h-[500px] md:h-[600px] shadow-2xl flex flex-col"
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
                onClick={onClose}
                className="font-whirlyBirdie font-bold text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-colors"
              >
                X
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col items-center grow overflow-hidden">
              {slide.title && (
                <div className="text-xs text-gray-400 mb-3 tracking-widest font-whirlyBirdie font-bold">
                  {slide.title}
                </div>
              )}

              {slide.image && (
                <div className="mb-4 h-[160px]">
                  <div className="border border-white p-2 h-full aspect-square">
                    <img
                      src={slide.image}
                      alt="tutorial"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="text-center font-whirlyBirdie font-bold text-white text-xs leading-relaxed uppercase overflow-y-auto">
                {slide.text}
              </div>

              {slide.answer && (
                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-400">ANSWER :</div>
                  <div className="text-xl tracking-widest text-[#10b981]">
                    {slide.answer}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white h-[60px] flex items-center justify-between px-6">
              <button
                onClick={prev}
                disabled={currentSlide === 0}
                className={`font-whirlyBirdie font-bold ${
                  currentSlide === 0 ? "opacity-0" : "opacity-100"
                }`}
              >
                &lt; BACK
              </button>

              <div className="flex gap-2">
                {TUTORIAL_SLIDES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full border border-white ${
                      i === currentSlide ? "bg-white" : ""
                    }`}
                  />
                ))}
              </div>

              {currentSlide < TUTORIAL_SLIDES.length - 1 ? (
                <button onClick={next} className="font-whirlyBirdie font-bold">
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
