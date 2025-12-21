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

  const width = window.innerWidth;
  const isSmallScreen = width <= 1024;

  const columnCount = isSmallScreen ? 5 : 9;
  const daysPerRow = 3;

  while (currentDay <= dayCount) {
    const downArrowData: ArrowCell = {
      type: "arrow",
      arrow: "down",
      fromDay: currentDay,
    };
    const directedArrowData: ArrowCell = {
      type: "arrow",
      arrow: goingRight ? "right" : "left",
      fromDay: currentDay,
    };

    const row: MapRow = [];
    const maxDaysInRow = Math.min(daysPerRow, dayCount - currentDay + 1);

    for (let i = 0; i < maxDaysInRow; i++) {
      row.push({ type: "day", day: currentDay });
      currentDay++;

      if (i < maxDaysInRow - 1) {
        // Pushes 2 by default, 1 if in isSmallScreen
        row.push(
          directedArrowData,
          ...(isSmallScreen ? [] : [directedArrowData]),
        );
      }
    }

    // Add connector to next row
    if (currentDay <= dayCount && !isSmallScreen) {
      row.push(directedArrowData, downArrowData);
    }

    // Pad row to columns count
    while (row.length < columnCount) {
      row.push({ type: "empty" });
    }

    rows.push(row);

    // Add vertical transition row
    if (currentDay <= dayCount) {
      const transitionRow: MapRow = [downArrowData];
      while (transitionRow.length < columnCount) {
        transitionRow.push({ type: "empty" });
      }
      rows.push(transitionRow);
    }

    goingRight = !goingRight;
  }

  return rows;
}
