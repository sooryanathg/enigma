import type { ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p15 from "@/assets/p15.webp";

type Props = Omit<
  ParallaxTileProps,
  "depth" | "ox" | "oy" | "sizeClass" | "src"
>;

const HeroTile15 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.9}
    ox={-1}
    oy={-1}
    // ✅ Bigger on mobile, balanced on desktop
    sizeClass="w-[34%] sm:w-[24%] md:w-[16%]"
    src={p15}
  />
);

export default HeroTile15;
