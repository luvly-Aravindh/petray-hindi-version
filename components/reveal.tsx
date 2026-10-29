"use client";

import { useEffect, useRef } from "react";

type Tag = "div" | "span" | "section" | "article" | "details" | "p" | "h2" | "h3";

export function Reveal({
  className = "",
  children,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const TagName = as;
  return (
    <TagName ref={ref as never} className={className}>
      {children}
    </TagName>
  );
}
