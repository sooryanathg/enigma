import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p1 from "@/assets/p1.webp";

type Props = Omit<
  ParallaxTileProps,
  "depth" | "ox" | "oy" | "sizeClass" | "src"
>;

const HeroTile1 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.9}
    ox={-1}
    oy={-1}
   
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p1}
  />
);

export default HeroTile1;
