"use client";

import { useEffect, useState } from "react";
import { tickerItems } from "@/lib/content";

export function ProofTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const item = tickerItems[index];

  useEffect(() => {
    const start = Math.floor(Math.random() * tickerItems.length);
    setIndex(start);
    let current = start;
    let hideTimer = 0;
    let loopTimer = 0;
    const show = () => {
      setIndex(current);
      setVisible(true);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
        current = (current + 1) % tickerItems.length;
      }, 6000);
    };
    const boot = window.setTimeout(() => {
      show();
      loopTimer = window.setInterval(show, 11000);
    }, 4000);
    return () => {
      window.clearTimeout(boot);
      window.clearTimeout(hideTimer);
      window.clearInterval(loopTimer);
    };
  }, []);

  return (
    <div className={`gn-proof-ticker${visible ? " is-visible" : ""}`} role="status" aria-live="polite">
      <div className="gn-proof-ticker__thumb">
        <svg className="gn-proof-ticker__pin" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 0C4.925 0 0 4.925 0 11c0 7.5 11 17 11 17s11-9.5 11-17c0-6.075-4.925-11-11-11z" fill="#3b5afe" />
          <circle cx="11" cy="11" r="4" fill="#ffffff" />
        </svg>
      </div>
      <div className="gn-proof-ticker__content">
        <div className="gn-proof-ticker__line1">
          <span>{item.name}</span>
          <span className="gn-proof-ticker__line1-from"> · </span>
          <span>{item.city}</span>
        </div>
        <div className="gn-proof-ticker__line2">{item.action}</div>
        <div className="gn-proof-ticker__line3">
          <span className="gn-proof-ticker__time">{item.time}</span>
          <svg className="gn-proof-ticker__badge" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Z" fill="#3b5afe" />
            <path d="M8 12.5l2.7 2.7L16.5 9" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="gn-proof-ticker__verified">Proof द्वारा सत्यापित</span>
        </div>
      </div>
    </div>
  );
}
