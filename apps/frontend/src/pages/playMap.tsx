import { MoveRight, MoveLeft, MoveDown } from "lucide-react";

import "./page.css";
import { DayTile } from "@/components/progressMap/dayTile";
import { generateMap } from "@/components/progressMap/mapGenerator";
import { usePlay } from "@/hooks/usePlay";
import { useAuth } from "@/contexts/AuthContext";

const PlayMap = () => {
  const { currentUser } = useAuth();
  const { progress, fetchProgress } = usePlay(currentUser);
  fetchProgress(true);

  const renderArrow = (direction: string) => {
    switch (direction) {
      case "right":
        return <MoveRight className="w-8 h-8" />;
      case "left":
        return <MoveLeft className="w-8 h-8" />;
      case "down":
        return <MoveDown className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const isDayComplete = (day: number): boolean => {
    return (
      (progress?.progress &&
        progress.progress.length >= day &&
        progress.progress[day - 1]?.isCompleted === true) ||
      false
    );
  };

  const isArrowActive = (cellIndex: number, row: any[]): boolean => {
    // Find the next day cell after this arrow
    for (let i = cellIndex + 1; i < row.length; i++) {
      if (row[i].type === "day") {
        const nextDay = row[i].day!;
        return (
          nextDay > 1 &&
          (isDayComplete(nextDay) ||
            (isDayComplete(nextDay - 1) && !isDayComplete(nextDay)))
        );
      }
    }
    return false;
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
              style={{
                perspective: "1200px",
              }}
              className={`grid grid-cols-9 ${(rowIndex + 1) % 4 === 2 ? "direction-reverse" : ""} gap-0 items-center justify-center max-w-4xl overflow-visible`}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="flex w-full h-full min-h-[120px] relative overflow-visible"
                >
                  {cell.type === "day" ? (
                    <DayTile
                      day={cell.day!}
                      isComplete={isDayComplete(cell.day!)}
                    />
                  ) : cell.type === "arrow" ? (
                    <div
                      className={`w-full h-full flex items-center justify-center border -z-10 ${
                        isArrowActive(cellIndex, row)
                          ? "bg-black text-white border-white/20"
                          : "border-black"
                      }`}
                    >
                      {renderArrow(cell.arrow!)}
                    </div>
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
