import { MoveRight, MoveLeft, MoveDown } from "lucide-react";
import type { ArrowCell, DayCell, MapRow } from "./mapGenerator";
import type { FC } from "react";

interface ArrowTileProps {
  cellIndex: number;
  isDayComplete: (day: number) => boolean;
  row: MapRow;
}

export const ArrowTile: FC<ArrowTileProps> = ({
  cellIndex,
  isDayComplete,
  row,
}) => {
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

  const isArrowActive = (cellIndex: number, row: MapRow): boolean => {
    // Find the next day cell after this arrow
    for (let i = cellIndex + 1; i < row.length; i++) {
      if (row[i].type === "day") {
        const nextDay = (row[i] as DayCell).day;
        return (
          nextDay > 1 &&
          (isDayComplete(nextDay) ||
            (isDayComplete(nextDay - 1) && !isDayComplete(nextDay)))
        );
      }
    }
    return false;
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center border -z-10 ${
        isArrowActive(cellIndex, row)
          ? "bg-black text-white border-white/20"
          : "border-black"
      }`}
    >
      {renderArrow((row[cellIndex] as ArrowCell).arrow)}
    </div>
  );
};
