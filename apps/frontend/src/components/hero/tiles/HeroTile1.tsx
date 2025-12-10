import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p2 from "@/assets/p1.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile2 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={-1.2}
    oy={-1.4}
    sizeClass="w-[16%]"
    src={p2}
  />
);

export default HeroTile2;
