import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p12 from "@/assets/p12.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile12 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.6}
    ox={0.35}
    oy={0.95}
    sizeClass="w-[15%]"
    src={p12}
  />
);

export default HeroTile12;
