'use client';

import { useMotionValue, animate, motion, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';

export default function AnimatedGridPattern({
  width = 30,
  height = 30,
  x = -1,
  y = -1,
  strokeDasharray = '4 4',
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5, // This prop is now explicitly destructured
  ...props
}) {
  const [ref, { width: containerWidth, height: containerHeight }] =
    useMeasure();

  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(xValue, [0, containerWidth - width], {
      duration,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      repeatDelay,
    });

    return controls.stop;
  }, [xValue, containerWidth, width, duration, repeatDelay]);

  useEffect(() => {
    const controls = animate(yValue, [0, containerHeight - height], {
      duration: duration * 2,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      repeatDelay,
    });

    return controls.stop;
  }, [yValue, containerHeight, height, duration, repeatDelay]);

  const xTranslate = useTransform(xValue, (v) => `-${v}px`);
  const yTranslate = useTransform(yValue, (v) => `-${v}px`);

  return (
    <motion.svg
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-[oklch(from_var(--primarius)_l_c_h/0.1)] stroke-[oklch(from_var(--primarius)_l_c_h/0.2)]',
        className
      )}
      // Only the remaining valid props are passed down, fixing the warning.
      {...props}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
          style={{
            transform: `translate(${xTranslate.get()}, ${yTranslate.get()})`,
          }}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill="url(#grid-pattern)"
      />
    </motion.svg>
  );
}
