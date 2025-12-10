import type{ ParallaxTileProps } from "../ParallaxTile";
import ParallaxTile from "../ParallaxTile";
import p16 from "@/assets/p16.webp";

type Props = Omit<ParallaxTileProps, "depth" | "ox" | "oy" | "sizeClass" | "src">;

const HeroTile16 = (props: Props) => (
  <ParallaxTile
    {...props}
    depth={0.45}
    ox={0.55}
    oy={-0.05}
    sizeClass="w-[14%]"
    src={p16}
  />
);

export default HeroTile16;
