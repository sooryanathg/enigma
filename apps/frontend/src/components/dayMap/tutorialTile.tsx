import "./progressMap.css";

export const TutorialTile = ({
  isComplete = false,
  onClick,
}: {
  isComplete?: boolean;
  onClick: (value: boolean) => void;
}) => {
  return (
    <div
      onClick={() => onClick(true)}
      className={`group overflow-visible day-cell w-full h-full px-2 flex items-center justify-center text-[10px] font-whirlyBirdie font-bold border bg-black text-white border-white/20
       ${isComplete && "day-complete"} day-hoverable`}
    >
      <div
        className={`day-cell-side border-2 border-white/20 overflow-visible`}
      />
      Tutorial
      <div
        className={`day-cell-bottom border-2 border-white/20 overflow-visible`}
      />
    </div>
  );
};
