import { MoveRight, MoveLeft, MoveDown } from "lucide-react";
import type { ArrowCell, DayCell, MapRow } from "./mapGenerator";
import type { FC } from "react";

interface ArrowTileProps {
  cellIndex: number;
  isDayComplete: (day: number) => boolean;
  row: MapRow;
  allRows: MapRow[];
  rowIndex: number;
}

export const ArrowTile: FC<ArrowTileProps> = ({
  cellIndex,
  isDayComplete,
  row,
  allRows,
  rowIndex,
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

  const isArrowActive = (): boolean => {
    // Find all day numbers in the entire map
    const allDays: number[] = [];
    allRows.forEach((r) => {
      r.forEach((cell) => {
        if (cell.type === "day") {
          allDays.push(cell.day);
        }
      });
    });

    allDays.sort((a, b) => a - b);

    // Find the last completed day and next uncompleted day
    let lastCompletedDay = 0;
    let nextUncompletedDay = null;

    for (const day of allDays) {
      if (isDayComplete(day)) {
        lastCompletedDay = day;
      } else {
        nextUncompletedDay = day;
        break;
      }
    }

    // If all days are complete or no days are complete, no arrows should be active
    if (lastCompletedDay === 0 || nextUncompletedDay === null) {
      return false;
    }

    // Find previous and next day cells relative to this arrow
    let prevDay: number | null = null;
    let nextDay: number | null = null;

    // Check backward in current row
    for (let i = cellIndex - 1; i >= 0; i--) {
      if (row[i].type === "day") {
        prevDay = (row[i] as DayCell).day;
        break;
      }
    }

    // Check forward in current row
    for (let i = cellIndex + 1; i < row.length; i++) {
      if (row[i].type === "day") {
        nextDay = (row[i] as DayCell).day;
        break;
      }
    }

    // If no prev day in current row, check previous rows
    if (prevDay === null) {
      for (let r = rowIndex - 1; r >= 0; r--) {
        const prevRow = allRows[r];
        for (let i = prevRow.length - 1; i >= 0; i--) {
          if (prevRow[i].type === "day") {
            prevDay = (prevRow[i] as DayCell).day;
            break;
          }
        }
        if (prevDay !== null) break;
      }
    }

    // If no next day in current row, check next rows
    // But we need the CLOSEST next day in the sequence
    if (nextDay === null && prevDay !== null) {
      // Look for the day that comes immediately after prevDay
      const targetNextDay = prevDay + 1;

      for (let r = rowIndex + 1; r < allRows.length; r++) {
        const nextRow = allRows[r];
        for (const cell of nextRow) {
          if (cell.type === "day" && (cell as DayCell).day === targetNextDay) {
            nextDay = targetNextDay;
            break;
          }
        }
        if (nextDay !== null) break;
      }

      // If we didn't find the immediate next day, look for any next day
      if (nextDay === null) {
        for (let r = rowIndex + 1; r < allRows.length; r++) {
          const nextRow = allRows[r];
          for (const cell of nextRow) {
            if (cell.type === "day") {
              nextDay = (cell as DayCell).day;
              break;
            }
          }
          if (nextDay !== null) break;
        }
      }
    }

    // Arrow is active if it's part of the path from start to the next uncompleted day
    if (prevDay !== null && nextDay !== null) {
      // Check if this arrow is part of the active path
      // The path includes all days from 1 to lastCompletedDay, plus the connection to nextUncompletedDay
      return prevDay <= lastCompletedDay && nextDay <= nextUncompletedDay;
    }

    return false;
  };

  return (
    <div
      className={`w-full h-full flex items-center justify-center border -z-10 ${
        isArrowActive() ? "bg-black text-white border-white/20" : "border-black"
      }`}
    >
      {renderArrow((row[cellIndex] as ArrowCell).arrow)}
    </div>
  );
};
