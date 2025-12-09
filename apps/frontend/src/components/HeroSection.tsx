import  { useEffect, useState } from "react";
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
  visible: { transition: { staggerChildren: 0.25 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9 } }
};

const HeroSection = () => {
  const { currentUser } = useAuth();

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

  // Mouse position → normalized target values (-1 to 1)
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

  // Smooth lag pointer and parallax driver
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
              className="pointer-events-none fixed z-30 hidden md:flex items-center justify-center rounded-full border border-black bg-peach/90 shadow-md"
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
              <HeroTile1 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile2 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile3 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile4 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile5 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile6 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile7 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile8 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile9 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile10 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile11 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile12 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile13 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile14 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile15 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
              <HeroTile16 smoothX={smoothX} smoothY={smoothY} viewportWidth={w} viewportHeight={h} parallax={parallax} />
            </div>
          </>
        )}

        <div className="relative z-20 flex px-4 sm:px-6 lg:px-8 pt-[9rem] items-start justify-center select-none">
          <div className="max-w-5xl mx-auto text-center w-full">
            <motion.h1
              variants={fadeIn}
              style={{ fontFamily: "WhirlyBirdie", fontSize: "144px" }}
              className={cn("font-bold text-black tracking-[0.08em] leading-[0.85] mb-8")}
            >
              ENIGMA
            </motion.h1>

            <motion.p
              variants={fadeIn}        
                className="text-2xl sm:text-3xl md:text-5xl text-black mb-10 max-w-2xl mx-auto font-[400] font-whirlybird"
            >
              Online Treasure Hunt
            </motion.p>

            <motion.div className="mt-28 flex flex-col items-center gap-6" variants={containerVariants}>
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
