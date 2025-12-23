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
import { useMapAnimation } from "@/hooks/useMapAnimation";

const DayMap = () => {
  const { currentUser } = useAuth();
  const { progress, fetchProgress } = usePlay(currentUser);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const hasInitiatedFetch = useRef(false);
  const hasScrolledToActive = useRef(false);

  useEffect(() => {
    if (!isTutorialOpen && !progress?.isTutorialComplete) fetchProgress(true);
  }, [isTutorialOpen]);

  useEffect(() => {
    if (currentUser && !hasInitiatedFetch.current && !progress) {
      hasInitiatedFetch.current = true;
      fetchProgress(true);
    }
  }, [currentUser, fetchProgress, progress]);

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

  const rows = useMemo(
    () => generateMap(completedDays.length),
    [completedDays.length],
  );

  const { mapRef } = useMapAnimation(rows.length);

  const activeDay = useMemo(() => {
    if (!progress) return 0;
    const lastCompleted = completedDays.filter((d) => d.isCompleted).length;
    return lastCompleted; // This is the day they are currently on
  }, [completedDays, progress]);

  useEffect(() => {
    if (progress && !hasScrolledToActive.current) {
      const activeElement = document.getElementById(`day-tile-${activeDay}`);
      if (activeElement) {
        // Manually scroll so the active tile (tutorial/day) is comfortably
        // below the header on mobile devices like iPhone 14 Pro Max.
        const rect = activeElement.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;
        const offset = 140; // pixels from top of viewport
        window.scrollTo({
          top: Math.max(absoluteTop - offset, 0),
          behavior: "smooth",
        });
        hasScrolledToActive.current = true;
      }
    }
  }, [progress, activeDay]);

  return (
    <div className="min-h-screen flex flex-col container overflow-x-hidden selection:bg-none mx-auto px-4 md:px-6 gap-8 lg:gap-24 py-6 md:py-10 lg:py-14">
      <PageExplainer pageTitle="Levels" />

      {/* Extra top margin so the first (tutorial) row is fully visible
          below the header on tall mobile screens. */}
      <div className="flex-1 w-full flex justify-center items-start overflow-visible min-h-[80vh] mt-6 md:mt-10">
        <div
          ref={mapRef}
          className="relative map-area"
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {rows.map((row, rowIndex) => {
            const isReversed =
              (rowIndex + 1) % 4 === 2 || (rowIndex + 1) % 4 === 3;

            // Dynamically calculate columns
            const columnCount = row.length;

            return (
              <div
                key={`row-${rowIndex}`}
                className={`grid gap-0 items-center justify-center max-w-4xl overflow-visible ${
                  isReversed ? "direction-reverse" : ""
                }`}
                style={{
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                }}
              >
                {row.map((cell, cellIndex) => {
                  const visualColumn = isReversed ? 8 - cellIndex : cellIndex;
                  const zIndex = 1000 - visualColumn;

                  return (
                    <div
                      key={`cell-${rowIndex}-${cellIndex}`}
                      id={cell.type === "day" ? `day-tile-${cell.day}` : undefined}
                      style={{ zIndex }}
                      className={`flex w-full h-full min-h-[90px] lg:min-h-[120px] relative overflow-visible ${
                        cell.type === "day" ? "scroll-mt-32" : ""
                      } ${cell.type === "empty" ? "no-shadow" : ""}`}
                    >
                      {cell.type === "day" &&
                        (cell.day === 0 ? (
                          <TutorialTile
                            onClick={setIsTutorialOpen}
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
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};

export default DayMap;
