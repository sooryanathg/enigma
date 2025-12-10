import type  { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p3 from "@/assets/p3.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile3 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={1.2}
    oy={-1.4}
    sizeClass="w-[16%]"
    src={p3}
  />
);

export default HeroTile3;
