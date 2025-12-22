import { motion, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

type ParallaxTileProps = {
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  viewportWidth: number;
  viewportHeight: number;
  parallax: number;
  depth: number;
  ox: number;
  oy: number;
  sizeClass: string;
  src: string;
};

const ParallaxTile = ({
  smoothX,
  smoothY,
  viewportWidth,
  viewportHeight,
  parallax,
  depth,
  ox,
  oy,
  sizeClass,
  src,
}: ParallaxTileProps) => {
  const x = useTransform(smoothX, (v) => {
    const baseX = ox * (viewportWidth / 2);
    return baseX - v * depth * viewportWidth * parallax;
  });

  const y = useTransform(smoothY, (v) => {
    const baseY = oy * (viewportHeight / 2);
    return baseY - v * depth * viewportHeight * parallax;
  });

  return (
    <motion.div
      className={cn(
        "absolute left-1/2 top-1/2 overflow-hidden pointer-events-none shadow-xl",
      
        "rounded-xl sm:rounded-2xl md:rounded-3xl",
        sizeClass
      )}
      style={{
        x,
        y,
        touchAction: "none",
      }}
    >
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
};

export type { ParallaxTileProps };
export default ParallaxTile;
