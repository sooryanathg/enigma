import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p4 from "@/assets/p4.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile4 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={1.8}
    oy={-1.6}
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p4}
  />
);

export default HeroTile4;
