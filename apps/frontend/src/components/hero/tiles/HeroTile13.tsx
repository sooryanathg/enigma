import type{ ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p13 from "@/assets/p13.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile13 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={-1.45}
    oy={1.4}
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p13}
  />
);

export default HeroTile13;
