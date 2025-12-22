import type{ ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p14 from "@/assets/p14.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile14 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.7}
    ox={1.2}
    oy={1.4}
      sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p14}
  />
);

export default HeroTile14;
