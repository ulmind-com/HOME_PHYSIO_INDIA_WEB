"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PerspectiveCarouselItem {
  src: string;
  title: string;
  alt?: string;
}

export interface PerspectiveCarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: PerspectiveCarouselItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  loop?: boolean;
  slideWidth?: number;
  rotationStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  showControls?: boolean;
  showDots?: boolean;
  viewportClassName?: string;
  slideClassName?: string;
  imageClassName?: string;
  labelClassName?: string;
  controlsClassName?: string;
  onSlideClick?: (index: number) => void;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.14,
  duration: 0.9,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function PerspectiveCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = false,
  slideWidth = 200,
  rotationStep = 60,
  inactiveScale = 0.85,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  onSlideClick,
  tabIndex,
  ...props
}: PerspectiveCarouselProps) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex),
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const safeSlideWidth = Math.max(96, slideWidth);
  const safeInactiveScale = clamp(inactiveScale, 0.5, 1);

  const selectSlide = React.useCallback(
    (nextIndex: number) => {
      if (!items.length) return;
      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);
      if (activeIndex === undefined) setUncontrolledIndex(resolvedIndex);
      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange],
  );

  if (!items.length) return null;

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectSlide(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectSlide(currentIndex + 1);
    }
  };

  const activeItem = items[currentIndex];

  return (
    <div
      {...props}
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex w-full flex-1 items-center justify-center",
          viewportClassName,
        )}
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const offset = index - currentIndex;
            const translateX = offset * (safeSlideWidth * 0.55);
            const rotateY = -offset * rotationStep;
            const scale = isActive ? 1 : safeInactiveScale;
            const zIndex = 100 - Math.abs(offset);
            const opacity = Math.abs(offset) > 3 ? 0 : 1;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn(
                  "absolute top-1/2 left-1/2 origin-center",
                  slideClassName,
                )}
                style={{
                  width: safeSlideWidth,
                  height: safeSlideWidth * 1.35,
                  marginLeft: -safeSlideWidth / 2,
                  marginTop: -(safeSlideWidth * 1.35) / 2,
                }}
                animate={{
                  x: translateX,
                  rotateY,
                  scale,
                  zIndex,
                  opacity,
                }}
                transition={transition}
              >
                <button
                  type="button"
                  aria-label={item.alt ?? item.title}
                  onClick={() =>
                    isActive ? onSlideClick?.(index) : selectSlide(index)
                  }
                  className={cn(
                    "group relative block h-full w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] transition-shadow",
                    isActive && "shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]",
                  )}
                >
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700",
                      isActive && "group-hover:scale-[1.03]",
                      imageClassName,
                    )}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {activeItem && (
        <div
          className={cn(
            "pointer-events-none mt-4 text-center text-sm font-medium tracking-wide text-foreground",
            labelClassName,
          )}
        >
          {activeItem.title}
        </div>
      )}

      {showControls && (
        <div
          className={cn(
            "mt-5 flex items-center gap-3 rounded-full border border-border bg-background/60 px-3 py-2 backdrop-blur",
            controlsClassName,
          )}
        >
          <button
            type="button"
            aria-label="Previous slide"
            disabled={isPreviousDisabled}
            onClick={() => selectSlide(currentIndex - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground transition hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {showDots && (
            <div className="flex items-center gap-1.5">
              {items.map((item, index) => (
                <button
                  key={`dot-${item.src}-${index}`}
                  type="button"
                  aria-label={`Go to ${item.title}`}
                  onClick={() => selectSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    currentIndex === index
                      ? "w-6 bg-foreground"
                      : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground",
                  )}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            aria-label="Next slide"
            disabled={isNextDisabled}
            onClick={() => selectSlide(currentIndex + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground transition hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PerspectiveCarousel;
