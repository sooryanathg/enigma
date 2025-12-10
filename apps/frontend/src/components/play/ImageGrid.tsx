// Calculate optimal grid layout based on number of images
export const calculateGridLayout = (imageCount: number, containerWidth: number, containerHeight: number, startTop: number, startLeft: number) => {
  if (imageCount === 0) return [];
  
  if (imageCount === 1) {
    // Single large square, centered
    const size = Math.min(400, containerWidth - 100, containerHeight - 150);
    const left = startLeft + (containerWidth - size) / 2;
    const top = startTop + 50;
    return [{ left, top, width: size, height: size }];
  }
  
  if (imageCount === 2) {
    // Two squares side by side
    const gap = 20;
    const size = Math.min(200, (containerWidth - gap - 40) / 2);
    const totalWidth = size * 2 + gap;
    const leftStart = startLeft + (containerWidth - totalWidth) / 2;
    const top = startTop + 50;
    return [
      { left: leftStart, top, width: size, height: size },
      { left: leftStart + size + gap, top, width: size, height: size }
    ];
  }
  
  if (imageCount === 3) {
    // Two on top, one below (centered)
    const gap = 20;
    const size = Math.min(180, (containerWidth - gap - 40) / 2);
    const topRowLeft = startLeft + (containerWidth - (size * 2 + gap)) / 2;
    const bottomLeft = startLeft + (containerWidth - size) / 2;
    return [
      { left: topRowLeft, top: startTop + 50, width: size, height: size },
      { left: topRowLeft + size + gap, top: startTop + 50, width: size, height: size },
      { left: bottomLeft, top: startTop + 50 + size + gap, width: size, height: size }
    ];
  }
  
  // For 4+ images, calculate optimal grid
  const gap = 15;
  let cols = 2;
  let rows = Math.ceil(imageCount / cols);
  
  // Optimize column count for better layout
  if (imageCount >= 6) cols = 3;
  if (imageCount >= 9) cols = 3;
  if (imageCount >= 12) cols = 4;
  
  rows = Math.ceil(imageCount / cols);
  
  const maxSize = Math.min(
    200,
    (containerWidth - (cols - 1) * gap - 40) / cols,
    (containerHeight - (rows - 1) * gap - 100) / rows
  );
  
  const totalWidth = cols * maxSize + (cols - 1) * gap;
  const leftStart = startLeft + (containerWidth - totalWidth) / 2;
  const topStart = startTop + 50;
  
  const positions = [];
  for (let i = 0; i < imageCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    positions.push({
      left: leftStart + col * (maxSize + gap),
      top: topStart + row * (maxSize + gap),
      width: maxSize,
      height: maxSize
    });
  }
  
  return positions;
};

export const ImageSquare = ({ position, image, loaded, onLoad, index }: { position: { left: number; top: number; width: number; height: number }; image?: string; loaded: boolean; onLoad: () => void; index: number }) => {
  return (
    <div className="absolute box-border overflow-hidden" style={{ left: `${position.left}px`, top: `${position.top}px`, width: `${position.width}px`, height: `${position.height}px`, border: "1px solid #FFFFFF" }}>
      {image && <img src={image} onLoad={onLoad} onError={onLoad} className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} alt={`Question image ${index + 1}`} />}
      {!loaded && image && <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>}
    </div>
  );
};

