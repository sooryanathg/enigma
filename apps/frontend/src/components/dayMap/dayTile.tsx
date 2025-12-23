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
    if (isDayAccessible) navigate(`/play/${day}`);
  };

  const isLocked = !isComplete && !isDayAccessible;

  return (
    <div className="group tile w-full h-full ">
      <div
        className={`overflow-visible day-cell w-full h-full px-2 flex items-center justify-center font-whirlyBirdie text-[8px] lg:text-[12px] font-bold border ${
          isLocked
            ? "bg-[#252525] text-white/30 border-white/10"
            : "bg-black text-white border-white/20"
        } ${isComplete && "day-complete"} ${isDayAccessible && "day-hoverable"}`}
        onClick={handleClick}
      >
        <div
          className={`day-cell-side overflow-visible border-2 border-white/20 ${isLocked ? "!bg-[#1a1a1a]" : ""}`}
        />
        DAY {day}
        <div
          className={`day-cell-bottom overflow-visible border-2  border-white/20 ${isLocked ? "!bg-[#1a1a1a]" : ""}`}
        />
      </div>
    </div>
  );
};
