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

    const paddingTop = -1 * rowCount * 3;

    if (mapRef.current.parentElement) {
      mapRef.current.parentElement.style.marginTop = `${paddingTop}px`;
    }

    /**
     * CALCULATION LOGIC:
     * When rows are low (e.g., 1-2), the 3D 'rotateX' pulls the top of the map
     * closer to the center. We reduce the baseTranslateX for short maps.
     */
    const rowOffset = Math.max(0, (rowCount - 1) * 3.8); // Add 5% shift per row
    const desktopBase = 50 + rowOffset; // Starts tighter for 1 row, wider for more

    const baseTranslateX = isMobile ? 50 : desktopBase;
    const driftFactor = isMobile ? 0.08 : 0.13;
    const horizontalCorrection = y * 0.5;

    const xValue = baseTranslateX - horizontalCorrection * driftFactor;

    // Use transformOrigin to ensure the map anchors correctly
    mapRef.current.style.transformOrigin = "center center";

    mapRef.current.style.transform = `
      rotateX(55deg)
      rotateZ(-20deg)
      translateX(calc(-50% + ${xValue}%))
      translateY(-25%)
    `;

    ticking.current = false;
  }, [rowCount]); // Re-run if rowCount changes

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
