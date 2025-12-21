import { useCallback, useEffect, useRef } from "react";

const screenParams = {
  mobile: {
    baseXOffset: 280,
    driftFactor: 0.3,
    mapRotationDeg: 55,
  },
  tablet: {
    baseXOffset: 200,
    driftFactor: 0.3,
    mapRotationDeg: 55,
  },
  semiDesktop: {
    baseXOffset: 280,
    driftFactor: 0.25,
    mapRotationDeg: 55,
  },
  desktop: {
    baseXOffset: 50,
    driftFactor: 0.13,
    mapRotationDeg: 55,
  },
};

export const useMapAnimation = (rowCount: number) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const lastKnownScrollY = useRef(0);
  const ticking = useRef(false);

  const updateMapTransform = useCallback(() => {
    if (!mapRef.current) return;

    const y = lastKnownScrollY.current;
    const width = window.innerWidth;

    let params = screenParams.desktop;
    if (width < 768) {
      params = screenParams.mobile;
    } else if (width < 1024) {
      params = screenParams.tablet;
    } else if (width < 1200) {
      params = screenParams.semiDesktop;
    }

    // 1. Horizontal Drift Logic
    const rowOffset = Math.max(0, (rowCount - 1) * 3.8);
    const baseTranslateX = params.baseXOffset + rowOffset;
    const driftFactor = params.driftFactor;
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
