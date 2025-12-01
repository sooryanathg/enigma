import EnigmaLogo from "@/assets/circular logo.webp";
import Enigma3D from "@/assets/enig-anim-org.webm";

/*
 * CircularText
 * Renders the rotating "ENIGMA" text ring around the logo.
 * Values are taken directly from Figma (left, top, rotation).
 */
const CircularText = () => {
  type LetterDef = {
    char: string;
    left: string;
    top: string;
    rotate: number;
  };

  const letters: LetterDef[] = [
    // ===== SEQUENCE 1: ENIGMA + 3 blanks =====
    { char: "E", left: "49.98%", top: "0%", rotate: 4.49 },
    { char: "N", left: "56.19%", top: "0.72%", rotate: 14.61 },
    { char: "I", left: "63%", top: "2%", rotate: 22.29 },
    { char: "G", left: "66.33%", top: "4.79%", rotate: 29.92 },
    { char: "M", left: "73.08%", top: "9.88%", rotate: 42.2 },
    { char: "A", left: "79.93%", top: "17%", rotate: 54.05 },
    { char: " ", left: "84%", top: "24.75%", rotate: 61.29 },
    { char: " ", left: "85.4%", top: "27.98%", rotate: 65.52 },
    { char: " ", left: "86.6%", top: "31.32%", rotate: 69.74 },

    // ===== SEQUENCE 2: ENIGMA + 3 blanks =====
    { char: "E", left: "90%", top: "35.17%", rotate: 76.39 },
    { char: "N", left: "91%", top: "42.98%", rotate: 86.5 },
    { char: "I", left: "93%", top: "48.5%", rotate: 94.13 },
    { char: "G", left: "91%", top: "54.21%", rotate: 101.67 },
    { char: "M", left: "88%", top: "61.82%", rotate: 114.1 },
    { char: "A", left: "83.5%", top: "70.29%", rotate: 126.02 },
    { char: " ", left: "77.8%", top: "75.97%", rotate: 133.25 },
    { char: " ", left: "75.66%", top: "78.08%", rotate: 137.42 },
    { char: " ", left: "73.38%", top: "80.05%", rotate: 141.6 },

    // ===== SEQUENCE 3: ENIGMA + 3 blanks =====
    { char: "E", left: "68.16%", top: "81.93%", rotate: 148.17 },
    { char: "N", left: "60.94%", top: "85.27%", rotate: 158.34 },
    { char: "I", left: "58.2%", top: "87.2%", rotate: 166.03 },
    { char: "G", left: "50.56%", top: "88.81%", rotate: 173.61 },
    { char: "M", left: "40.1%", top: "88.79%", rotate: -174.08 },
    { char: "A", left: "31.22%", top: "86.49%", rotate: -162.14 },
    { char: " ", left: "27.42%", top: "85.14%", rotate: -154.84 },
    { char: " ", left: "24.21%", top: "83.71%", rotate: -150.62 },
    { char: " ", left: "21.15%", top: "82.11%", rotate: -146.43 },

    // ===== SEQUENCE 4: ENIGMA + 3 blanks =====
    { char: "E", left: "15.4%", top: "79%", rotate: -139.86 },
    { char: "N", left: "9.8%", top: "74%", rotate: -129.8 },
    { char: "I", left: "8.3%", top: "68.9%", rotate: -122.18 },
    { char: "G", left: "2.92%", top: "63.87%", rotate: -114.58 },
    { char: "M", left: "0.16%", top: "55%", rotate: -102.15 },
    { char: "A", left: "0%", top: "46.58%", rotate: -90.28 },
    { char: " ", left: "0.21%", top: "42.41%", rotate: -83.04 },
    { char: " ", left: "0.68%", top: "38.85%", rotate: -78.87 },
    { char: " ", left: "1.42%", top: "35.29%", rotate: -74.61 },

    // ===== SEQUENCE 5: ENIGMA + 3 blanks =====
    { char: "E", left: "2.48%", top: "27%", rotate: -67.99 },
    { char: "N", left: "5.59%", top: "20.14%", rotate: -57.83 },
    { char: "I", left: "10.67%", top: "15.5%", rotate: -50.21 },
    { char: "G", left: "13.27%", top: "10.68%", rotate: -42.68 },
    { char: "M", left: "19%", top: "5.56%", rotate: -30.39 },
    { char: "A", left: "28%", top: "2.2%", rotate: -18.43 },
  ];

  return (
    <div className="absolute inset-0 animate-spin-slow">
      <div className="relative w-full h-full">
        {letters.map((l, i) => (
          <span
            key={i}
            className="
              absolute
              text-white
              font-inter
              text-[18.5px]
              leading-[22px]
              pointer-events-none
            "
            style={{
              left: l.left,
              top: l.top,
              transform: `rotate(${l.rotate}deg)`,
            }}
          >
            {l.char}
          </span>
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="relative w-full min-h-[2000px] overflow-hidden mt-[-18px]" style={{ backgroundColor: '#FFF2E4' }}>

      {/* ========== DESKTOP LAYOUT - EXACT ORIGINAL (hidden on mobile) ========== */}
      <div className="hidden xl:block">
        {/* ========== RECTANGLE 1 ========== */}
        <section
          className="
            absolute
            w-[1444px]
            h-[804px]
            bg-black
            top-[139px]
            left-[34px]
            relative
          "
        >
          {/* === GRID LINES (horizontal) === */}

          {/* Line 27 */}
          <div
            className="absolute border border-white"
            style={{
              width: "799px",
              height: "0px",
              left: "0px",
              top: "322px",
            }}
          />

          {/* Line 28 (extended to full width for layout) */}
          <div
            className="absolute border border-white"
            style={{
              width: "1444px",
              height: "0px",
              left: "0px",
              top: "482px",
            }}
          />

          {/* Line 29 */}
          <div
            className="absolute border border-white"
            style={{
              width: "643px",
              height: "0px",
              left: "0px",
              top: "642px",
            }}
          />

          {/* Line 34 – small horizontal under ENIGMA description */}
          <div
            className="absolute border border-white"
            style={{
              width: "477px",
              height: "0px",
              left: "322px",
              top: "157px",
            }}
          />

          {/* === GRID LINES (vertical segments) === */}

          {/* Line 31 – breaks where it intersects content */}
          {/* Top segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "322.5px",
              top: "0px",
              height: "322px",
            }}
          />
          {/* Bottom segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "322.5px",
              top: "642px",
              height: "164px",
            }}
          />

          {/* Line 32 – two segments */}
          {/* Top segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "483.5px",
              top: "0px",
              height: "157px",
            }}
          />
          {/* Bottom segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "483.5px",
              top: "642px",
              height: "157px",
            }}
          />

          {/* Line 33 – two segments */}
          {/* Top segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "643.5px",
              top: "0px",
              height: "157px",
            }}
          />
          {/* Lower segment */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "643.5px",
              top: "482px",
              height: "322px",
            }}
          />

          {/* Line 35 – right-side vertical near 3D block */}
          <div
            className="absolute border-l border-white"
            style={{
              left: "795.5px",
              top: "0px",
              height: "482px",
            }}
          />

          {/* === ENIGMA LOGO + ROTATING TEXT RING === */}
          <div
            className="
              absolute
              top-[75px]
              left-[70px]
              w-[214px]
              h-[214px]
            "
          >
            <CircularText />

            {/* Inner circular ENIGMA logo */}
            <img
              src={EnigmaLogo}
              alt="Enigma Logo"
              className="
                absolute
                w-[100.55px]
                h-[63px]
                top-[75px]
                left-[57px]
                object-contain
              "
            />
          </div>

          {/* === TEXT CONTENT === */}

          {/* Intro paragraph */}
          <p
            className="
              absolute
              w-[458px]
              h-[120px]
              top-[177px]
              left-[345px]
              font-poppins
              text-[20px]
              font-normal
              leading-[26px]
              tracking-[-0.02em]
              text-white
            "
          >
            Enigma is the ultimate puzzle hunter under Invento, GEC Palakkad — a game
            where curiosity meets chaos and logic meets imagination.
          </p>

          {/* Paragraph 2 */}
          <p
            className="
              absolute
              w-[729px]
              top-[341px]
              left-[22px]
              font-poppins
              text-[20px]
              font-normal
              leading-[26px]
              tracking-[-0.02em]
              text-white
              antialiased
            "
          >
            Each day brings a single, mind-bending question — it could be an image,
            a waveform, a phrase, or even a mysterious sound clip. The challenge?
            Decode the hidden meaning behind each clue and connect them all to
            uncover the final answer.
          </p>

          {/* Paragraph 3 */}
          <p
            className="
              absolute
              w-[567px]
              top-[515px]
              left-[22px]
              font-poppins
              text-[20px]
              font-normal
              leading-[26px]
              tracking-[-0.02em]
              text-white
              antialiased
            "
          >
            It's not just a quiz — it's a journey through riddles, symbols, and subtle
            hints that test your observation, reasoning, and creativity.
          </p>

          {/* CTA line */}
          <p
            className="
              absolute
              w-[258px]
              top-[677px]
              left-[22px]
              font-poppins
              text-[30px]
              font-semibold
              leading-[34px]
              tracking-[-0.02em]
              text-white
              antialiased
            "
          >
            So, ready to dive into the mystery?
          </p>

          {/* ENIGMA Heading (Whirly font) */}
          <p
            className="
              absolute
              w-[489px]
              top-[605px]
              left-[799px]
              font-whirly
              text-[80px]
              font-bold
              leading-[80px]
              tracking-[-0.02em]
              text-center
              text-white
              antialiased
            "
          >
            ENIGMA
          </p>

          {/* === 3D ANIMATED ICON (right side) with fallback image === */}
          <div
            className="
              absolute
              w-[650px]
              h-[486px]
              top-[0px]
              left-[796px]
              overflow-hidden
              mix-blend-screen
            "
          >
            {/* Static fallback image */}
            <img
              src="/src/assets/enigma-static.webp"
              alt="Enigma static"
              className="
                w-full
                h-full
                object-cover
                absolute
                top-0
                left-0
              "
            />

            {/* Animated 3D Video */}
            <video
              src={Enigma3D}
              autoPlay
              loop
              muted
              playsInline
              className="
                w-full
                h-full
                object-cover
                absolute
                inset-0
                opacity-0
                transition-opacity duration-500
                z-10
              "
              onLoadedData={(e) => (e.currentTarget.style.opacity = "1")}
              onError={(e) => (e.currentTarget.style.display = "none")}
              onMouseEnter={(e) => {
                e.currentTarget.playbackRate = 5;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.playbackRate = 1;
              }}
            />
          </div>
        </section>

        {/* Rectangle 2 – reserved for later */}
        <section
          className="
            absolute
            w-[1444px]
            h-[804px]
            bg-black
            top-[1049px]
            left-[34px]
          "
        />
      </div>

      {/* ========== MOBILE/TABLET RESPONSIVE LAYOUT (shown on smaller screens) ========== */}
      <div className="block xl:hidden px-4 py-8 md:px-8 md:py-12">
        <section className="max-w-4xl mx-auto space-y-8">
          {/* Circular Logo */}
          <div className="relative w-[180px] h-[180px] md:w-[214px] md:h-[214px] mx-auto">
            <CircularText />
            <img
              src={EnigmaLogo}
              alt="Enigma Logo"
              className="absolute w-[80px] h-[50px] md:w-[100.55px] md:h-[63px] top-[50px] left-[50px] md:top-[75px] md:left-[57px] object-contain"
            />
          </div>

          {/* Intro paragraph */}
          <p className="font-poppins text-base md:text-xl leading-relaxed tracking-[-0.02em] text-white text-center">
            Enigma is the ultimate puzzle hunter under Invento, GEC Palakkad — a game
            where curiosity meets chaos and logic meets imagination.
          </p>

          {/* 3D Video */}
          <div className="w-full aspect-[4/3] overflow-hidden rounded-lg mix-blend-screen">
            <video
              src={Enigma3D}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              onTouchStart={(e) => {
                e.currentTarget.playbackRate = 5;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.playbackRate = 1;
              }}
            />
          </div>

          {/* Paragraph 2 */}
          <p className="font-poppins text-base md:text-xl leading-relaxed tracking-[-0.02em] text-white">
            Each day brings a single, mind-bending question — it could be an image,
            a waveform, a phrase, or even a mysterious sound clip. The challenge?
            Decode the hidden meaning behind each clue and connect them all to
            uncover the final answer.
          </p>

          {/* Paragraph 3 */}
          <p className="font-poppins text-base md:text-xl leading-relaxed tracking-[-0.02em] text-white">
            It's not just a quiz — it's a journey through riddles, symbols, and subtle
            hints that test your observation, reasoning, and creativity.
          </p>

          {/* CTA line */}
          <p className="font-poppins text-xl md:text-3xl font-semibold leading-relaxed tracking-[-0.02em] text-white text-center">
            So, ready to dive into the mystery?
          </p>

          {/* ENIGMA Heading */}
          <p className="font-whirly text-5xl md:text-7xl font-bold tracking-[-0.02em] text-center text-white">
            ENIGMA
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;