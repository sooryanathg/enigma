import { MoveRight, MoveLeft, MoveDown } from "lucide-react";

import "./page.css";

function generateMap(dayCount: number) {
  const rows = [];
  let currentDay = 1;
  let goingRight = true;

  while (currentDay <= dayCount) {
    const row = [];

    // Determine how many days fit in this row (max 3 days per row)
    const daysInThisRow = Math.min(3, dayCount - currentDay + 1);

    if (goingRight) {
      // Fill row going RIGHT
      for (let dayInRow = 0; dayInRow < daysInThisRow; dayInRow++) {
        // Add day cell
        const isLastDayInRow = dayInRow === daysInThisRow - 1;
        const isLastDay = currentDay === dayCount;

        row.push({
          day: currentDay,
          type: "day",
          arrow: isLastDay
            ? "none"
            : isLastDayInRow && currentDay < dayCount
              ? "down"
              : "right",
        });

        currentDay++;

        // Add arrow cells between days (2 arrows between each day)
        if (dayInRow < daysInThisRow - 1) {
          row.push({ type: "arrow", arrow: "right" });
          row.push({ type: "arrow", arrow: "right" });
        }
      }

      // Add down arrows at the end if not last day
      if (currentDay <= dayCount) {
        row.push({ type: "arrow", arrow: "right" });
        row.push({ type: "arrow", arrow: "down" });
      }

      // Fill remaining cells with empty boxes to reach 9 columns
      while (row.length < 9) {
        row.push({ type: "empty" });
      }
    } else {
      // Fill row going LEFT (need to build in reverse)
      const tempRow = [];

      for (let dayInRow = 0; dayInRow < daysInThisRow; dayInRow++) {
        const isLastDayInRow = dayInRow === daysInThisRow - 1;
        const isLastDay = currentDay === dayCount;

        tempRow.push({
          day: currentDay,
          type: "day",
          arrow: isLastDay
            ? "none"
            : isLastDayInRow && currentDay < dayCount
              ? "down"
              : "left",
        });

        currentDay++;

        // Add arrow cells between days
        if (dayInRow < daysInThisRow - 1) {
          tempRow.push({ type: "arrow", arrow: "left" });
          tempRow.push({ type: "arrow", arrow: "left" });
        }
      }

      // Reverse the row for left direction
      row.push(...tempRow.reverse());

      // Add down arrow at the beginning if not last day
      if (currentDay <= dayCount) {
        row.unshift({ type: "arrow", arrow: "left" });
        row.unshift({ type: "arrow", arrow: "down" });
      }

      // Fill remaining cells with empty boxes to reach 9 columns
      while (row.length < 9) {
        row.unshift({ type: "empty" });
      }
    }

    rows.push(row);

    // Add transition row (single down arrow) if not last row
    if (currentDay <= dayCount) {
      const transitionRow = [];
      transitionRow.push({ type: "arrow", arrow: "down" });
      // Fill remaining cells with empty boxes
      while (transitionRow.length < 9) {
        transitionRow.push({ type: "empty" });
      }
      rows.push(transitionRow);
      goingRight = !goingRight; // Switch direction
    }
  }

  return rows;
}

const PlayMap = () => {
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

  const rows = generateMap(15);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 p-8">
      <div className="w-full max-w-6xl">
        {/* Map Container with 3D perspective */}
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform:
              "rotateX(55deg) rotateZ(-15deg) translateY(-25%) translateX(20%)",
          }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-9 ${(rowIndex + 1) % 4 === 2 ? "direction-reverse" : ""} gap-0 items-center justify-center max-w-4xl`}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="flex w-full h-full min-h-[120px] relative"
                >
                  {cell.type === "day" ? (
                    <div className="day-cell hover:scale-110 hover:shadow-2xl day-3d w-full h-full bg-black text-white flex items-center justify-center text-sm font-bold border border-black transition-all">
                      DAY {cell.day}
                    </div>
                  ) : cell.type === "arrow" ? (
                    <div className="w-full h-full flex items-center justify-center border border-black">
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
