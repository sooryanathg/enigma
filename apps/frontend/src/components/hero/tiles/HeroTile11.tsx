import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p11 from "@/assets/p11.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile11 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.6}
    ox={-0.35}
    oy={1.1}
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p11}
  />
);

export default HeroTile11;
