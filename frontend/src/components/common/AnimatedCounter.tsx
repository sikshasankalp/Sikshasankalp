import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number | string;
  duration?: number; // duration in ms, default 2000ms
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  // Extract numerical value and any inherent suffix like '+'
  let targetNumber = 0;
  let autoSuffix = suffix;

  if (typeof end === 'number') {
    targetNumber = end;
  } else if (typeof end === 'string') {
    const trimmed = end.trim();
    if (trimmed.endsWith('+') && !suffix) {
      autoSuffix = '+';
    }
    const parsed = parseInt(trimmed.replace(/[^0-9]/g, ''), 10);
    targetNumber = isNaN(parsed) ? 0 : parsed;
  }

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const timeout = setTimeout(() => {
            let startTimestamp: number | null = null;
            const startVal = 0;

            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const elapsed = timestamp - startTimestamp;
              const progress = Math.min(elapsed / duration, 1);

              // Ease Out Quart: 1 - (1 - progress)^4
              const easeProgress = 1 - Math.pow(1 - progress, 4);
              const currentVal = Math.round(startVal + (targetNumber - startVal) * easeProgress);

              setCount(currentVal);

              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                setCount(targetNumber);
              }
            };

            window.requestAnimationFrame(step);
          }, delay);

          return () => clearTimeout(timeout);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [targetNumber, duration, delay, hasAnimated]);

  const formattedCount = count.toLocaleString('en-IN');

  return (
    <span ref={elementRef} className={`inline-flex items-baseline ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{formattedCount}</span>
      {autoSuffix && <span className="ml-0.5">{autoSuffix}</span>}
    </span>
  );
}

export default AnimatedCounter;
