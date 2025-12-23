import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p8 from "@/assets/p8.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile8 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.8}
    ox={1.6}
    oy={0.9}
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p8}
  />
);

export default HeroTile8;
