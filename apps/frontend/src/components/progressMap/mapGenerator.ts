export function generateMap(dayCount: number) {
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
