import type{ ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p15 from "@/assets/p15.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile15 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.45}
    ox={-0.7}
    oy={0.02}
    sizeClass="w-[14%]"
    src={p15}
  />
);

export default HeroTile15;
