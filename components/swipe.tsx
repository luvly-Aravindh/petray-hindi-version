"use client";

import { useEffect, useRef, useState } from "react";

export function Swipe({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
    setCount(kids.length);
    if (kids.length < 2) return;

    const ordered = () => kids.slice().sort((a, b) => a.offsetLeft - b.offsetLeft);
    const update = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = 1e9;
      ordered().forEach((kid, i) => {
        const mid = kid.offsetLeft + kid.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    const onScroll = () => requestAnimationFrame(update);
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    const timer = window.setTimeout(update, 50);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div ref={ref} className={className} aria-label={label}>
        {children}
      </div>
      {count > 1 ? (
        <div className="dots" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <i key={i} className={i === active ? "on" : undefined} />
          ))}
        </div>
      ) : null}
    </>
  );
}
