import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p6 from "@/assets/p6.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile6 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.8}
    ox={1.7}
    oy={0.0}
    sizeClass="w-[18%]"
    src={p6}
  />
);

export default HeroTile6;
