import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface BouquetProps {
  className?: string;
}

interface Flower {
  x: number;
  maxHeight: number;
  color: string;
  bloomSpeed: number;
  stemOffset: number;
  leafHeight: number;
  petalColor2?: string; // Secondary petal color for variation
  bloomDelay: number; // Delay before this flower starts blooming
}

export function Bouquet({ className }: BouquetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set resolution for better detail
    const width = 120;
    const height = 140;
    canvas.width = width;
    canvas.height = height;

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    let frame = 0;
    let animationId: number;

    const flowers: Flower[] = [
      // Back row (taller, further back)
      {
        x: 40,
        maxHeight: 70,
        color: "#a855f7",
        petalColor2: "#c084fc",
        bloomSpeed: 0.85,
        stemOffset: 5,
        leafHeight: 30,
        bloomDelay: 0.15,
      }, // Left Purple
      {
        x: 60,
        maxHeight: 75,
        color: "#ec4899",
        petalColor2: "#f472b6",
        bloomSpeed: 1,
        stemOffset: 0,
        leafHeight: 35,
        bloomDelay: 0,
      }, // Center Pink (tallest)
      {
        x: 80,
        maxHeight: 68,
        color: "#f59e0b",
        petalColor2: "#fbbf24",
        bloomSpeed: 1.15,
        stemOffset: 3,
        leafHeight: 28,
        bloomDelay: 0.08,
      }, // Right Orange
      // Middle row
      {
        x: 50,
        maxHeight: 60,
        color: "#f43f5e",
        petalColor2: "#fb7185",
        bloomSpeed: 0.92,
        stemOffset: 10,
        leafHeight: 25,
        bloomDelay: 0.22,
      }, // Mid-left Red
      {
        x: 70,
        maxHeight: 62,
        color: "#3b82f6",
        petalColor2: "#60a5fa",
        bloomSpeed: 1.08,
        stemOffset: 8,
        leafHeight: 27,
        bloomDelay: 0.05,
      }, // Mid-right Blue
      // Front row (shorter, in front)
      {
        x: 35,
        maxHeight: 50,
        color: "#14b8a6",
        petalColor2: "#2dd4bf",
        bloomSpeed: 0.95,
        stemOffset: 15,
        leafHeight: 20,
        bloomDelay: 0.18,
      }, // Front left Teal
      {
        x: 85,
        maxHeight: 52,
        color: "#8b5cf6",
        petalColor2: "#a78bfa",
        bloomSpeed: 1.05,
        stemOffset: 13,
        leafHeight: 22,
        bloomDelay: 0.12,
      }, // Front right Violet
    ];

    const drawPixel = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    };

    const drawRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(x),
        Math.floor(y),
        Math.floor(w),
        Math.floor(h),
      );
    };

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Animation progress (0 to 1 over 500 frames - much longer, more realistic timing)
      const progress = Math.min(frame / 500, 1);

      // Draw pot - made larger and more prominent
      const potY = height - 20; // Bottom of canvas
      const potWidth = 50;
      const potHeight = 20;
      const potX = (width - potWidth) / 2;

      // Pot body with gradient effect using multiple shades
      drawRect(potX, potY, potWidth, potHeight, "#d97706"); // Main body
      drawRect(
        potX + 3,
        potY + 3,
        potWidth - 6,
        potHeight - 6,
        "#f59e0b",
      ); // Inner highlight
      drawRect(
        potX + 6,
        potY + 6,
        potWidth - 12,
        potHeight - 9,
        "#d97706",
      ); // Inner shadow

      // Pot rim - wider and more defined
      drawRect(potX - 3, potY, potWidth + 6, 4, "#b45309"); // Rim base
      drawRect(potX - 2, potY, potWidth + 4, 2, "#92400e"); // Rim top edge

      // Draw flowers
      flowers.forEach((flower) => {
        // Grow stem slowly and naturally
        const stemProgress = Math.min(progress * 1.3, 1);
        const currentHeight = flower.maxHeight * stemProgress;
        const startY = potY;
        const endY = startY - currentHeight;

        if (currentHeight <= 0) return;

        // Stem with slight thickness variation
        drawRect(flower.x, endY, 1, currentHeight, "#10b981");

        // Leaves (appear gradually as stem grows)
        if (currentHeight > flower.leafHeight) {
          const leafProgress = Math.min(
            (currentHeight - flower.leafHeight) / 10,
            1,
          );
          const leafSize = Math.floor(leafProgress * 3);
          if (leafSize > 0) {
            // Left leaf
            for (let i = 0; i < leafSize; i++) {
              drawPixel(
                flower.x - 1 - i,
                potY - flower.leafHeight + Math.floor(i / 2),
                "#059669",
              );
            }
            // Right leaf (slightly offset)
            for (let i = 0; i < leafSize; i++) {
              drawPixel(
                flower.x + 1 + i,
                potY -
                  flower.leafHeight -
                  3 +
                  Math.floor(i / 2),
                "#059669",
              );
            }
          }
        }

        // Bloom - starts much later and progresses very slowly
        // Each flower has its own timing based on bloomDelay
        const bloomStart = 0.55; // Start blooming when stem is 55% grown (was 80%)
        const individualBloomProgress = Math.max(
          0,
          stemProgress - bloomStart - flower.bloomDelay,
        );
        const bloomDuration = 0.45; // Takes 45% of total animation time to fully bloom
        const normalizedBloomProgress = Math.min(
          individualBloomProgress / bloomDuration,
          1,
        );

        // Apply easing for more natural bloom - starts slow, speeds up, then slows at end
        const easedBloomProgress =
          normalizedBloomProgress < 0.5
            ? 2 *
              normalizedBloomProgress *
              normalizedBloomProgress
            : 1 -
              Math.pow(-2 * normalizedBloomProgress + 2, 2) / 2;

        if (easedBloomProgress > 0) {
          const centerX = flower.x;
          const centerY = endY - 1;

          // Stage 1: Closed bud (0-0.2)
          if (easedBloomProgress < 0.2) {
            const budProgress = easedBloomProgress / 0.2;
            // Small closed bud
            drawPixel(centerX, centerY - 2, flower.color);
            drawPixel(centerX - 1, centerY - 1, flower.color);
            drawPixel(centerX, centerY - 1, flower.color);
            drawPixel(centerX + 1, centerY - 1, flower.color);
            if (budProgress > 0.5) {
              drawPixel(
                centerX,
                centerY - 3,
                flower.petalColor2 || flower.color,
              );
            }
          }
          // Stage 2: Bud opening (0.2-0.5)
          else if (easedBloomProgress < 0.5) {
            const openingProgress =
              (easedBloomProgress - 0.2) / 0.3;

            // Yellow center appearing
            drawPixel(centerX, centerY - 1, "#fef08a");
            if (openingProgress > 0.3) {
              drawPixel(centerX - 1, centerY - 1, "#fde047");
            }

            // Petals starting to separate and extend
            const petalExtend = Math.floor(openingProgress * 2);
            // Top petal
            for (let i = 0; i <= petalExtend; i++) {
              drawPixel(
                centerX,
                centerY - 2 - i,
                i === petalExtend
                  ? flower.petalColor2 || flower.color
                  : flower.color,
              );
            }
            // Side petals appearing
            if (openingProgress > 0.4) {
              drawPixel(centerX - 1, centerY - 2, flower.color);
              drawPixel(centerX + 1, centerY - 2, flower.color);
            }
            // Bottom petals
            if (openingProgress > 0.6) {
              drawPixel(centerX - 1, centerY, flower.color);
              drawPixel(centerX + 1, centerY, flower.color);
            }
          }
          // Stage 3: Full bloom (0.5-1.0)
          else {
            const fullBloomProgress =
              (easedBloomProgress - 0.5) / 0.5;
            const petalLength = Math.floor(
              2 + fullBloomProgress * 2.5,
            ); // Max petal length of 4-5 pixels

            // Full yellow center
            drawRect(centerX - 1, centerY - 1, 3, 2, "#fef08a");
            drawPixel(centerX, centerY - 2, "#fde047");

            // Main petals - 4 cardinal directions
            // Top petal
            for (let i = 0; i < petalLength; i++) {
              const petal =
                i < petalLength - 1
                  ? flower.color
                  : flower.petalColor2 || flower.color;
              drawPixel(centerX, centerY - 3 - i, petal);
            }
            // Bottom petal
            for (let i = 0; i < petalLength; i++) {
              const petal =
                i < petalLength - 1
                  ? flower.color
                  : flower.petalColor2 || flower.color;
              drawPixel(centerX, centerY + 1 + i, petal);
            }
            // Left petal
            for (let i = 0; i < petalLength; i++) {
              const petal =
                i < petalLength - 1
                  ? flower.color
                  : flower.petalColor2 || flower.color;
              drawPixel(centerX - 2 - i, centerY, petal);
            }
            // Right petal
            for (let i = 0; i < petalLength; i++) {
              const petal =
                i < petalLength - 1
                  ? flower.color
                  : flower.petalColor2 || flower.color;
              drawPixel(centerX + 2 + i, centerY, petal);
            }

            // Secondary petals (diagonals) - appear later in bloom
            if (fullBloomProgress > 0.3) {
              const diagLength = Math.floor(
                (fullBloomProgress - 0.3) * 4,
              );

              // Top-left diagonal
              for (
                let i = 0;
                i < Math.min(diagLength, 2);
                i++
              ) {
                drawPixel(
                  centerX - 1 - i,
                  centerY - 2 - i,
                  flower.petalColor2 || flower.color,
                );
              }
              // Top-right diagonal
              for (
                let i = 0;
                i < Math.min(diagLength, 2);
                i++
              ) {
                drawPixel(
                  centerX + 1 + i,
                  centerY - 2 - i,
                  flower.petalColor2 || flower.color,
                );
              }
              // Bottom-left diagonal
              for (
                let i = 0;
                i < Math.min(diagLength, 2);
                i++
              ) {
                drawPixel(
                  centerX - 1 - i,
                  centerY + 1 + i,
                  flower.petalColor2 || flower.color,
                );
              }
              // Bottom-right diagonal
              for (
                let i = 0;
                i < Math.min(diagLength, 2);
                i++
              ) {
                drawPixel(
                  centerX + 1 + i,
                  centerY + 1 + i,
                  flower.petalColor2 || flower.color,
                );
              }
            }

            // Inner petal layer for depth (appears in final stage)
            if (fullBloomProgress > 0.7) {
              drawPixel(centerX, centerY - 2, flower.color);
              drawPixel(centerX - 1, centerY - 1, flower.color);
              drawPixel(centerX + 1, centerY - 1, flower.color);
              drawPixel(centerX - 1, centerY, flower.color);
              drawPixel(centerX + 1, centerY, flower.color);
            }
          }
        }
      });

      frame++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className={`relative flex justify-center items-center ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 p-12 bg-sky-50 rounded-full shadow-inner"
      >
        <canvas
          ref={canvasRef}
          className="image-pixelated drop-shadow-xl"
          style={{
            imageRendering: "pixelated",
            width: "400px",
            height: "466px", // Maintains 120:140 aspect ratio
            maxWidth: "90vw",
          }}
        />
      </motion.div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-pink-200/30 via-rose-200/30 to-pink-200/30 blur-3xl rounded-full -z-0 pointer-events-none" />
    </div>
  );
}