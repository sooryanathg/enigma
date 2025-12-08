import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import Footer from "./ui/footer";

import p1 from "@/assets/p1.png";
import p2 from "@/assets/p2.png";
import p3 from "@/assets/p3.png";
import p4 from "@/assets/p4.png";
import p5 from "@/assets/p5.png";
import p6 from "@/assets/p6.png";
import p7 from "@/assets/p7.png";
import p8 from "@/assets/p8.png";
import p9 from "@/assets/p9.png";
import p10 from "@/assets/p10.png";
import p11 from "@/assets/p11.png";
import p12 from "@/assets/p12.png";
import p13 from "@/assets/p13.png";
import p14 from "@/assets/p14.png";
import p15 from "@/assets/p15.png";
import p16 from "@/assets/p16.png";

const steps = [
  { id: 1, number: "01", title: "REGISTER", description: "Create an account or sign in with Google" },
  { id: 2, number: "02", title: "DAILY QUESTION", description: "Answer today's challenge as quickly as possible" },
  { id: 3, number: "03", title: "COMPETE", description: "See your ranking on the daily leaderboard" },
  { id: 4, number: "04", title: "REPEAT", description: "Come back tomorrow for the next challenge!" }
];

const tilesContainerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.18, when: "beforeChildren" } }
};

const tileVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } }
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works-section" className="pt-24 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2
          style={{ fontFamily: "WhirlyBirdie" }}
          className="text-4xl md:text-5xl font-bold text-black text-center mb-6"
        >
          HOW IT WORKS
        </h2>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-2xl md:text-3xl font-bold text-black/90">
            Join our 10-day treasure hunt!!
          </p>
          <p className="text-md md:text-lg font-bold text-black/70 mt-4">
            One question per day, compete for the fastest completion time, and climb the daily leaderboard
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={tilesContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={tileVariants}
              className="group relative bg-black border-[3px] border-white text-white overflow-hidden cursor-pointer flex items-center justify-center min-h-[16rem]"
              tabIndex={0}
            >
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-6 w-full h-full">
                <div
                  style={{ fontFamily: "WhirlyBirdie", fontSize: "32px" }}
                  className="font-bold mb-2"
                >
                  {step.number}
                </div>

                <div
                  style={{ fontFamily: "WhirlyBirdie", fontSize: "18px" }}
                  className="font-bold mb-3"
                >
                  {step.title}
                </div>

                <p
                  className={
                    "text-sm md:text-base text-white/90 max-w-[160px] mx-auto transition-all duration-700 opacity-0 translate-y-4 " +
                    "group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0"
                  }
                >
                  {step.description}
                </p>
              </div>

              <div aria-hidden className="pointer-events-none absolute inset-0 border-[3px] border-white" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

type TileConfig = {
  id: string;
  src: string;
  depth: number;
  ox: number;
  oy: number;
  size: string;
};

type ParallaxTileProps = {
  tile: TileConfig;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  viewportWidth: number;
  viewportHeight: number;
  parallax: number;
};

const ParallaxTile = ({
  tile,
  smoothX,
  smoothY,
  viewportWidth,
  viewportHeight,
  parallax
}: ParallaxTileProps) => {
  const x = useTransform(smoothX, (v) => {
    const baseX = tile.ox * (viewportWidth / 2);
    return baseX + -v * tile.depth * viewportWidth * parallax;
  });

  const y = useTransform(smoothY, (v) => {
    const baseY = tile.oy * (viewportHeight / 2);
    return baseY + -v * tile.depth * viewportHeight * parallax;
  });

  return (
    <motion.div
      className={cn(
        "absolute left-1/2 top-1/2 rounded-2xl shadow-xl overflow-hidden pointer-events-none",
        tile.size
      )}
      style={{ x, y }}
    >
      <img src={tile.src} className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  );
};

const HeroSection = () => {
  const { currentUser } = useAuth();

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.25 } } };
  const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9 } } };
  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.9 } } };

  const [vp, setVp] = useState({ w: 0, h: 0 });

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const smoothX = useMotionValue(0);
  const smoothY = useMotionValue(0);

  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { w, h } = vp;

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!w || !h) return;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      targetX.set(nx);
      targetY.set(ny);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [w, h, targetX, targetY]);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const tx = targetX.get();
      const ty = targetY.get();
      const sx = smoothX.get();
      const sy = smoothY.get();
      const nextX = sx + (tx - sx) * 0.16;
      const nextY = sy + (ty - sy) * 0.16;
      smoothX.set(nextX);
      smoothY.set(nextY);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [targetX, targetY, smoothX, smoothY]);

  const centerX = w / 2;
  const centerY = h / 2;
  const parallax = 0.75;

  const pointerX = useTransform(smoothX, (v) => v * (w / 2));
  const pointerY = useTransform(smoothY, (v) => v * (h / 2));

  const tiles: TileConfig[] = [
    { id: "1", src: p1, depth: 0.7, ox: -1.8, oy: -1.6, size: "w-[16%]" },
    { id: "2", src: p2, depth: 0.7, ox: -1.2, oy: -1.4, size: "w-[16%]" },
    { id: "3", src: p3, depth: 0.7, ox: 1.2, oy: -1.4, size: "w-[16%]" },
    { id: "4", src: p4, depth: 0.7, ox: 1.8, oy: -1.6, size: "w-[16%]" },
    { id: "5", src: p5, depth: 0.8, ox: -2.0, oy: -0.5, size: "w-[18%]" },
    { id: "6", src: p6, depth: 0.8, ox: 1.7, oy: 0.0, size: "w-[18%]" },
    { id: "7", src: p7, depth: 0.8, ox: -2.0, oy: 0.7, size: "w-[18%]" },
    { id: "8", src: p8, depth: 0.8, ox: 1.6, oy: 0.9, size: "w-[18%]" },
    { id: "9", src: p9, depth: 0.6, ox: -0.35, oy: -1.1, size: "w-[15%]" },
    { id: "10", src: p10, depth: 0.6, ox: 0.35, oy: -1.1, size: "w-[15%]" },
    { id: "11", src: p11, depth: 0.6, ox: -0.35, oy: 1.1, size: "w-[15%]" },
    { id: "12", src: p12, depth: 0.6, ox: 0.35, oy: 0.95, size: "w-[15%]" },
    { id: "13", src: p13, depth: 0.7, ox: -1.45, oy: 1.4, size: "w-[17%]" },
    { id: "14", src: p14, depth: 0.7, ox: 1.2, oy: 1.4, size: "w-[17%]" },
    { id: "15", src: p15, depth: 0.45, ox: -0.7, oy: 0.02, size: "w-[14%]" },
    { id: "16", src: p16, depth: 0.45, ox: 0.55, oy: -0.05, size: "w-[14%]" }
  ];

  const scrollToHow = () => {
    const el = document.getElementById("how-it-works-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div className="flex flex-col" initial="hidden" animate="visible" variants={containerVariants}>
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        {w > 0 && h > 0 && (
          <>
            <motion.div
              className="pointer-events-none fixed z-30 hidden md:flex items-center justify-center rounded-full border border-black bg-black/90 shadow-md"
              style={{
                width: "48px",
                height: "48px",
                left: centerX,
                top: centerY,
                transform: "translate(-50%, -50%)",
                x: pointerX,
                y: pointerY
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.4
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-10">
              {tiles.map((tile) => (
                <ParallaxTile
                  key={tile.id}
                  tile={tile}
                  smoothX={smoothX}
                  smoothY={smoothY}
                  viewportWidth={w}
                  viewportHeight={h}
                  parallax={parallax}
                />
              ))}
            </div>
          </>
        )}

        <div className="relative z-20 flex px-4 sm:px-6 lg:px-8 pt-[9rem] items-start justify-center select-none">
          <div className="max-w-5xl mx-auto text-center w-full">
            <motion.h1
              variants={fadeIn}
              style={{ fontFamily: "WhirlyBirdie", fontSize: "144px" }}
              className={cn("font-bold text-black tracking-[0.08em] leading-[0.85] mb-4")}
            >
              ENIGMA
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-4xl text-black mb-10 max-w-2xl mx-auto font-normal font-orbitron"
            >
              Online Treasure Hunt
            </motion.p>

            <motion.div className="mt-28 flex flex-col items-center gap-6" variants={containerVariants}>
              <motion.div variants={fadeUp}>
                <Link
                  to={currentUser ? "/play" : "/signin"}
                  className="px-12 py-4 rounded-full text-lg font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.button
                onClick={scrollToHow}
                variants={fadeUp}
                aria-label="Scroll"
                className="flex items-center justify-center w-12 h-12 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <Footer />
    </motion.div>
  );
};

export default HeroSection;
