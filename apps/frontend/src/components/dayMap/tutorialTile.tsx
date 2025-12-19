import "./progressMap.css";

export const TutorialTile = ({
  isComplete = false,
}: {
  isComplete?: boolean;
}) => {
  return (
    <div
      className={`group overflow-visible day-cell w-full h-full px-2 flex items-center justify-center text-[10px] font-whirlyBirdie font-bold border bg-black text-white border-white/20
       ${isComplete && "day-complete"} day-hoverable`}
    >
      <div className={`day-cell-side overflow-visible`} />
      Tutorial
      <div className={`day-cell-bottom overflow-visible`} />
    </div>
  );
};
