import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p7 from "@/assets/p7.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile7 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.8}
    ox={-2.0}
    oy={0.7}
    sizeClass="w-[18%]"
    src={p7}
  />
);

export default HeroTile7;
