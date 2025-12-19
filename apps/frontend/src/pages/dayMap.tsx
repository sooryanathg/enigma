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

  return (
    <div className="min-h-screen flex flex-col container mx-auto px-4 md:px-6 gap-12 lg:gap-24 py-14">
      <PageExplainer pageTitle="Levels" />

      <div className="flex items-center justify-center w-full max-w-6xl overflow-visible p-8">
        <div
          className="relative overflow-visible"
          style={{
            transformStyle: "preserve-3d",
            transform:
              "rotateX(55deg) rotateZ(-20deg) translateY(-25%) translateX(20%)",
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
