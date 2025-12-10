import { DayTile } from "@/components/progressMap/dayTile";
import { generateMap } from "@/components/progressMap/mapGenerator";
import { usePlay } from "@/hooks/usePlay";
import { useAuth } from "@/contexts/AuthContext";

import "./page.css";
import { ArrowTile } from "@/components/progressMap/arrowTile";
import { useEffect } from "react";

const PlayMap = () => {
  const { currentUser } = useAuth();
  const { progress, fetchProgress } = usePlay(currentUser);

  useEffect(() => {
    fetchProgress(true);
  }, []);

  const isDayComplete = (day: number): boolean => {
    return (
      (progress?.progress &&
        progress.progress.length >= day &&
        progress.progress[day - 1]?.isCompleted === true) ||
      false
    );
  };

  const rows = generateMap(progress?.progress.length || 0);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 p-8 overflow-visible">
      <div className="w-full max-w-6xl overflow-visible">
        {/* Map Container with 3D perspective */}
        <div
          className="relative overflow-visible"
          style={{
            transformStyle: "preserve-3d",
            transform:
              "rotateX(55deg) rotateZ(-20deg) translateY(-25%) translateX(20%)",
          }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-9 ${(rowIndex + 1) % 4 === 2 ? "direction-reverse" : ""} gap-0 items-center justify-center max-w-4xl overflow-visible`}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`flex w-full h-full min-h-[120px] relative overflow-visible ${
                    cell.type === "empty" ? "no-shadow" : ""
                  }`}
                >
                  {cell.type === "day" ? (
                    <DayTile
                      day={cell.day!}
                      isComplete={isDayComplete(cell.day!)}
                    />
                  ) : cell.type === "arrow" ? (
                    <ArrowTile
                      cellIndex={cellIndex}
                      isDayComplete={isDayComplete}
                      row={row}
                    />
                  ) : (
                    <div className="w-full h-full bg-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayMap;
