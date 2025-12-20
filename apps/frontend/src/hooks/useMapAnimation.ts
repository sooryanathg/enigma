import { useCallback, useEffect, useRef } from "react";

export const useMapAnimation = (rowCount: number) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const lastKnownScrollY = useRef(0);
  const ticking = useRef(false);

  const updateMapTransform = useCallback(() => {
    if (!mapRef.current) return;

    const y = lastKnownScrollY.current;
    const width = window.innerWidth;
    const isMobile = width < 768;

    // 1. Horizontal Drift Logic
    const rowOffset = Math.max(0, (rowCount - 1) * 3.8);
    const desktopBase = 50 + rowOffset;
    const baseTranslateX = isMobile ? 50 : desktopBase;
    const driftFactor = isMobile ? 0.08 : 0.13;
    const xValue = baseTranslateX - y * 0.5 * driftFactor;

    // 2. Vertical Space Compression Logic
    const verticalCompression = Math.min(-10, -rowCount * 0.45);

    // 3. Apply everything in a single GPU-accelerated string
    mapRef.current.style.transform = `
      rotateX(55deg)
      rotateZ(-20deg)
      translateX(calc(-50% + ${xValue}%))
      translateY(${verticalCompression}%)
      translateZ(0)
    `;

    ticking.current = false;
  }, [rowCount]);

  useEffect(() => {
    const handleScroll = () => {
      lastKnownScrollY.current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(updateMapTransform);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMapTransform);
    updateMapTransform();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMapTransform);
    };
  }, [updateMapTransform]);

  return { mapRef };
};
