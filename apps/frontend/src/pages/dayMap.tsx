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
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        hasScrolledToActive.current = true;
      }
    }
  }, [progress, activeDay]);

  return (
    <div className="min-h-screen flex flex-col md:overflow-x-hidden overflow-x-scroll container selection:bg-none mx-auto py-12 md:py-14">
      <PageExplainer pageTitle="Levels" />

      <div className="w-full flex justify-center overflow-visible">
        <div
          ref={mapRef}
          className=""
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
                className={`grid gap-0 items-center max-w-3xl overflow-visible ${
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
                      style={{ zIndex }}
                      className={`w-full h-full min-h-[60px] lg:min-h-[120px] overflow-visible ${
                        cell.type === "empty" ? "no-shadow" : ""
                      }`}
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
