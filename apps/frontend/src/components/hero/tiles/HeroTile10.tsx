import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p10 from "@/assets/p10.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile10 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.6}
    ox={0.35}
    oy={-1.1}
    sizeClass="w-[15%]"
    src={p10}
  />
);

export default HeroTile10;
