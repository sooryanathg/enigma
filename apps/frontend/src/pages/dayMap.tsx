import { DayTile } from "@/components/dayMap/dayTile";
import { generateMap } from "@/components/dayMap/mapGenerator";
import { usePlay } from "@/hooks/usePlay";
import { useAuth } from "@/contexts/AuthContext";
import "./page.css";
import { ArrowTile } from "@/components/dayMap/arrowTile";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { PageExplainer } from "@/components/ui/pageExplainer";
import { TutorialTile } from "@/components/dayMap/tutorialTile";
import TutorialModal from "@/components/play/tutorialModal";

const DayMap = () => {
  const { currentUser } = useAuth();
  const { progress, fetchProgress } = usePlay(currentUser);

  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const hasInitiatedFetch = useRef(false);

  useEffect(() => {
    if (!isOpen && !progress?.isTutorialComplete) fetchProgress(true);
  }, [isOpen]);

  useEffect(() => {
    if (currentUser && !hasInitiatedFetch.current && !progress) {
      hasInitiatedFetch.current = true;
      fetchProgress(true);
    }
  }, [currentUser, fetchProgress, progress]);

  const mapRef = useRef<HTMLDivElement>(null);
  const lastKnownScrollY = useRef(0);
  const ticking = useRef(false);
  const hasScrolledToActive = useRef(false);

  const updateMapTransform = useCallback(() => {
    if (!mapRef.current) return;

    const y = lastKnownScrollY.current;
    const width = window.innerWidth;

    // RESPONSIVE CALCULATION:
    // On small screens (mobile), we need a larger base offset and a faster correction rate.
    const isMobile = width < 768;
    const baseTranslateX = isMobile ? 85 : 75; // Starting position %
    const driftFactor = isMobile ? 0.12 : 0.08; // How fast it moves left as you scroll

    const horizontalCorrection = y * 0.8;
    const xValue = baseTranslateX - horizontalCorrection * driftFactor;

    mapRef.current.style.transform = `
          rotateX(55deg)
          rotateZ(-20deg)
          translateX(${xValue}%)
          translateY(-25%)
        `;

    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      lastKnownScrollY.current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(updateMapTransform);
        ticking.current = true;
      }
    };

    // Also update on resize to ensure it stays centered if orientation changes
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMapTransform);

    // Initial call to set position
    updateMapTransform();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMapTransform);
    };
  }, [updateMapTransform]);
  const completedDays = useMemo(() => progress?.progress ?? [], [progress]);

  const isDayComplete = useCallback(
    (day: number): boolean => {
      if (day === 0) {
        return progress?.isTutorialComplete === true;
      }
      return completedDays[day - 1]?.isCompleted === true;
    },
    [completedDays],
  );

  const isDayAccessible = useCallback(
    (day: number): boolean => {
      if (day === 0) return true;
      return isDayComplete(day - 1);
    },
    [isDayComplete],
  );

  const rows = useMemo(() => generateMap(30), [completedDays.length]);

  const activeDay = useMemo(() => {
    if (!progress) return 0;
    const lastCompleted = completedDays.filter((d) => d.isCompleted).length;
    return lastCompleted; // This is the day they are currently on
  }, [completedDays, progress]);

  useEffect(() => {
    if (progress && !hasScrolledToActive.current) {
      const activeElement = document.getElementById(`day-tile-${activeDay}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        hasScrolledToActive.current = true;
      }
    }
  }, [progress, activeDay]);

  const horizontalCorrection = scrollY * 0.8;

  return (
    <div className="min-h-screen flex flex-col container overflow-x-hidden selection:bg-none mx-auto px-4 md:px-6 gap-12 lg:gap-24 py-14">
      <PageExplainer pageTitle="Levels" />

      <div className="w-full flex justify-center overflow-hidden pb-[-20%]">
        <div
          ref={mapRef}
          className="relative map-area transition-transform duration-75 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `
                    rotateX(55deg)
                    rotateZ(-20deg)
                    translateX(${75 - horizontalCorrection * 0.08}%)
                    translateY(-25%)
                  `,
            marginBottom: "-40vh",
          }}
        >
          {rows.map((row, rowIndex) => {
            const isReversed =
              (rowIndex + 1) % 4 === 2 || (rowIndex + 1) % 4 === 3;

            return (
              <div
                key={`row-${rowIndex}`}
                className={`grid grid-cols-9 gap-0 items-center justify-center max-w-4xl overflow-visible ${
                  isReversed ? "direction-reverse" : ""
                }`}
              >
                {row.map((cell, cellIndex) => {
                  const visualColumn = isReversed ? 8 - cellIndex : cellIndex;
                  const zIndex = 1000 - visualColumn;

                  return (
                    <div
                      key={`cell-${rowIndex}-${cellIndex}`}
                      style={{ zIndex }}
                      className={`flex w-full h-full min-h-[120px] relative overflow-visible ${
                        cell.type === "empty" ? "no-shadow" : ""
                      }`}
                    >
                      {cell.type === "day" &&
                        (cell.day === 0 ? (
                          <TutorialTile
                            onClick={setIsOpen}
                            isComplete={isDayComplete(0)}
                          />
                        ) : (
                          <DayTile
                            day={cell.day}
                            isComplete={isDayComplete(cell.day)}
                            isDayAccessible={isDayAccessible(cell.day)}
                          />
                        ))}

                      {cell.type === "arrow" && (
                        <ArrowTile
                          isActive={isDayComplete(cell.fromDay)}
                          direction={cell.arrow}
                        />
                      )}

                      {cell.type === "empty" && (
                        <div className="w-full h-full bg-transparent" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <TutorialModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
    </div>
  );
};

export default DayMap;
