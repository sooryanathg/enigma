import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import Footer from "./ui/footer";
import HowItWorksSection from "./hero/Howitworks";

import HeroTile1 from "./hero/tiles/HeroTile1";
import HeroTile2 from "./hero/tiles/HeroTile2";
import HeroTile3 from "./hero/tiles/HeroTile3";
import HeroTile4 from "./hero/tiles/HeroTile4";
import HeroTile5 from "./hero/tiles/HeroTile5";
import HeroTile6 from "./hero/tiles/HeroTile6";
import HeroTile7 from "./hero/tiles/HeroTile7";
import HeroTile8 from "./hero/tiles/HeroTile8";
import HeroTile9 from "./hero/tiles/HeroTile9";
import HeroTile10 from "./hero/tiles/HeroTile10";
import HeroTile11 from "./hero/tiles/HeroTile11";
import HeroTile12 from "./hero/tiles/HeroTile12";
import HeroTile13 from "./hero/tiles/HeroTile13";
import HeroTile14 from "./hero/tiles/HeroTile14";
import HeroTile15 from "./hero/tiles/HeroTile15";
import HeroTile16 from "./hero/tiles/HeroTile16";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9 },
  },
};

const heroContainerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.18,
    },
  },
};

const HeroSection = () => {
  const { currentUser } = useAuth();

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const smoothX = useMotionValue(0);
  const smoothY = useMotionValue(0);

  // Track viewport size
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { w, h } = viewport;

  // Mouse move → target parallax values (-1 to 1)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!w || !h) return;

      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      targetX.set(nx);
      targetY.set(ny);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [w, h, targetX, targetY]);

  // Smooth follow (lerp) for softer motion
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

  const parallax = 0.75;

  // Pointer indicator motion
  const pointerX = useTransform(smoothX, (v) => v * (w / 2));
  const pointerY = useTransform(smoothY, (v) => v * (h / 2));

  const scrollToHow = () => {
    const el = document.getElementById("how-it-works-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
        {w > 0 && h > 0 && (
          <>
            {/* Pointer indicator following cursor */}
            <motion.div
              className="pointer-events-none fixed z-30 hidden md:flex items-center justify-center rounded-full border border-black bg-peach/90 shadow-md"
              style={{
                width: 48,
                height: 48,
                left: w / 2,
                top: h / 2,
                x: pointerX,
                y: pointerY,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.4,
              }}
            />

            {/* Parallax tiles */}
            <div
              className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
              style={{ clipPath: "inset(40px 0 0 0)" }}
            >
              <HeroTile1 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile2 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile3 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile4 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile5 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile6 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile7 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile8 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile9 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile10 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile11 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile12 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile13 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile14 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile15 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
              <HeroTile16 {...{ smoothX, smoothY, viewportWidth: w, viewportHeight: h, parallax }} />
            </div>
          </>
        )}

        {/* Hero content */}
        <motion.div
          className="relative z-20 flex px-4 sm:px-6 lg:px-8 pt-[9rem] items-start justify-center select-none"
          variants={heroContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.6, once: false }} // 👈 animate on load AND when scrolling back up
        >
          <div className="max-w-5xl mx-auto text-center w-full">
            <motion.h1
              variants={fadeIn}
              style={{ fontFamily: "WhirlyBirdie", fontSize: "144px" }}
              className={cn(
                "font-bold text-black tracking-[0.08em] leading-[0.85] mb-8"
              )}
            >
              ENIGMA
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-2xl sm:text-3xl md:text-5xl text-black mb-10 max-w-2xl mx-auto font-[400] font-whirlybird"
            >
              Online Treasure Hunt
            </motion.p>

            <motion.div
              className="mt-28 flex flex-col items-center gap-6"
              variants={containerVariants}
            >
              <motion.div variants={fadeUp}>
                <Link
                  to={currentUser ? "/play" : "/signin"}
                  className="px-12 py-4 square-full text-lg font-medium border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
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
                transition={{
                  repeat: Infinity,
                  duration: 1.1,
                  ease: "easeInOut",
                }}
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
        </motion.div>
      </section>

      <HowItWorksSection />
      <Footer />
    </div>
  );
};

export default HeroSection;
