import { MoveRight, MoveLeft, MoveDown } from "lucide-react";
import type { FC } from "react";

import "./progressMap.css";

interface ArrowTileProps {
  isActive: boolean;
  direction: string;
}

export const ArrowTile: FC<ArrowTileProps> = ({ isActive, direction }) => {
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
  return (
    <div
      className={`arrow-tile w-full h-full flex items-center justify-center border -z-10 ${
        isActive ? "bg-black text-white border-white/20" : "border-black"
      }`}
    >
      {renderArrow(direction)}
    </div>
  );
};
