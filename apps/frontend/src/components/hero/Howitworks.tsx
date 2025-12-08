import { motion } from "framer-motion";

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

export default HowItWorksSection;
