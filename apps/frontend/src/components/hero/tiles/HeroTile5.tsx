import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p5 from "@/assets/p5.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile5 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.8}
    ox={-2.0}
    oy={-0.5}
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p5}
  />
);

export default HeroTile5;
