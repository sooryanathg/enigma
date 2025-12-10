import { useNavigate } from "react-router-dom";
import "./progressMap.css";

export const DayTile = ({
  day,
  isComplete = false,
  isDayAccessible = false,
}: {
  day: number;
  isComplete?: boolean;
  isDayAccessible?: boolean;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isDayAccessible && !isComplete) navigate(`/play/${day}`);
  };

  return (
    <div
      className={`group overflow-visible day-cell w-full h-full px-2 bg-black text-white flex items-center justify-center text-base font-whirlyBirdie font-bold border border-white/20 ${
        isComplete ? "day-complete" : isDayAccessible && "day-hoverable"
      }`}
      onClick={handleClick}
    >
      <div className="day-cell-side overflow-visible" />
      DAY {day}
      <div className="day-cell-bottom overflow-visible" />
    </div>
  );
};
