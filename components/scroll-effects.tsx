"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".rv,.pain-photo,.gr");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    const steps = document.getElementById("steps");
    const stepEls = steps ? Array.from(steps.querySelectorAll<HTMLElement>(".step")) : [];
    const fbar = document.getElementById("fbar");
    const hero = document.querySelector(".hero");
    const fin = document.querySelector(".final-card");

    const stepScroll = () => {
      if (!steps) return;
      const rect = steps.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - rect.top) / Math.max(1, rect.height * 0.9)));
      steps.style.setProperty("--p", p.toFixed(3));
      const wide = window.innerWidth >= 960;
      stepEls.forEach((step, index) => {
        const lit = wide ? p >= index / stepEls.length + 0.02 : step.getBoundingClientRect().top < vh * 0.7;
        step.classList.toggle("lit", lit);
      });
    };

    const barScroll = () => {
      if (!fbar || !hero || !fin) return;
      const finRect = fin.getBoundingClientRect();
      const overFinal = finRect.top < window.innerHeight && finRect.bottom > 0;
      fbar.classList.toggle("show", hero.getBoundingClientRect().bottom < 0 && !overFinal);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        barScroll();
        stepScroll();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", stepScroll);
    barScroll();
    stepScroll();
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", stepScroll);
    };
  }, []);

  return null;
}
