export interface DayCell {
  type: "day";
  day: number;
}

export interface ArrowCell {
  type: "arrow";
  arrow: "right" | "left" | "down";
  fromDay: number;
}

export interface EmptyCell {
  type: "empty";
}

export type MapCell = DayCell | ArrowCell | EmptyCell;

export type MapRow = MapCell[];

export function generateMap(dayCount: number): MapRow[] {
  const rows: MapRow[] = [];
  let currentDay = 0;
  let goingRight = true;

  while (currentDay <= dayCount) {
    const row: MapRow = [];
    const maxDaysInRow = Math.min(3, dayCount - currentDay + 1);

    // Build path segment
    for (let i = 0; i < maxDaysInRow; i++) {
      row.push({ type: "day", day: currentDay });
      currentDay++;

      if (i < maxDaysInRow - 1) {
        row.push({
          type: "arrow",
          arrow: goingRight ? "right" : "left",
          fromDay: currentDay - 1,
        });
        row.push({
          type: "arrow",
          arrow: goingRight ? "right" : "left",
          fromDay: currentDay - 1,
        });
      }
    }

    // Add connector to next row
    if (currentDay <= dayCount) {
      row.push({
        type: "arrow",
        arrow: goingRight ? "right" : "left",
        fromDay: currentDay - 1,
      });
      row.push({ type: "arrow", arrow: "down", fromDay: currentDay - 1 });
    }

    // Pad row to 9 columns
    while (row.length < 9) {
      row.push({ type: "empty" });
    }

    rows.push(row);

    // Add vertical transition row
    if (currentDay <= dayCount) {
      const transitionRow: MapRow = [
        { type: "arrow", arrow: "down", fromDay: currentDay - 1 },
      ];
      while (transitionRow.length < 9) {
        transitionRow.push({ type: "empty" });
      }
      rows.push(transitionRow);
    }

    goingRight = !goingRight;
  }

  return rows;
}
