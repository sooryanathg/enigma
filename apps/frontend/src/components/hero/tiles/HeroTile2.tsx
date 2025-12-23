import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p2 from "@/assets/p2.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile2 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={-1.8}
    oy={-1.2}
   
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p2}
  />
);

export default HeroTile2;
