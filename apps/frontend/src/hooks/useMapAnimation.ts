import { useCallback, useEffect, useRef } from "react";

export const useMapAnimation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const lastKnownScrollY = useRef(0);
  const ticking = useRef(false);

  const updateMapTransform = useCallback(() => {
    if (!mapRef.current) return;

    const y = lastKnownScrollY.current;
    const width = window.innerWidth;

    // Responsive Math
    const isMobile = width < 768;
    const baseTranslateX = isMobile ? 85 : 75;
    const driftFactor = isMobile ? 0.12 : 0.08;
    const horizontalCorrection = y * 0.8;
    const xValue = baseTranslateX - horizontalCorrection * driftFactor;

    mapRef.current.style.transform = `
      rotateX(55deg)
      rotateZ(-20deg)
      translateX(${xValue}%)
      translateY(-25%)
    `;

    ticking.current = false;
  }, []);

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
