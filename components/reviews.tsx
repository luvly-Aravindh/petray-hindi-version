"use client";

import { useEffect, useState } from "react";
import { reviews, reels } from "@/lib/content";
import { Star } from "./icons";
import { Swipe } from "./swipe";

export function Reviews() {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const [runBar, setRunBar] = useState(false);

  const reel = open === null ? null : reels[open];
  const lineCount = reel ? reel.lines.length + 2 : 0;
  const total = 1300 * lineCount + 1600;

  useEffect(() => {
    if (open === null) return;
    setShown(0);
    setRunBar(false);
    const frame = requestAnimationFrame(() => setRunBar(true));
    const timers = Array.from({ length: lineCount }, (_, index) =>
      window.setTimeout(() => setShown(index + 1), 500 + index * 1300)
    );
    timers.push(window.setTimeout(() => setOpen(null), total + 400));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
      document.removeEventListener("keydown", onKey);
    };
  }, [open, lineCount, total]);

  const lines = reel ? [...reel.lines.map((text) => ({ text, kind: "" })), { text: reel.res, kind: " res" }, { text: reel.who, kind: " who" }] : [];

  return (
    <section className="sec" style={{ background: "var(--tint)" }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow rv up">रिव्यू</span>
          <h2 className="rv blur">
            Shopify ब्रांड्स जिन्होंने <em>सपोर्ट का दबाव सँभाला।</em>
          </h2>
          <p className="rv up d1">असली Shopify स्टोर, उन्हीं के शब्दों में।</p>
        </div>
        <div className="gr rv up d1">
          <div className="gr-top">
            <div className="gr-score">
              <span className="gr-num">4.6</span>
              <span className="gr-stars" aria-label="5 में से 4.6 रेटिंग">
                <span className="gr-bg">
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </span>
                <span className="gr-fg" style={{ width: "92%" }}>
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </span>
              </span>
              <span className="gr-count">Shopify App Store पर 5 रिव्यू</span>
            </div>
            <div className="gr-bars" aria-hidden="true">
              {[60, 40, 0, 0, 0].map((width, index) => (
                <div key={width + index}>
                  <span>{5 - index}</span>
                  <i>
                    <b style={{ width: `${width}%` }} />
                  </i>
                </div>
              ))}
            </div>
          </div>
          <Swipe className="gr-list swipe" label="रिव्यू, और पढ़ने के लिए स्वाइप करें">
            {reviews.map((review) => (
              <article className="gr-card" key={review.name}>
                <div className="gr-head">
                  <div className="gr-av">
                    <img src={review.logo} alt="" />
                  </div>
                  <div className="gr-who">
                    <b>{review.name}</b>
                    <small>{review.place}</small>
                  </div>
                </div>
                <div className="gr-meta">
                  <span>{review.meta[0]}</span>
                  <span className="gr-dot" />
                  <span>{review.meta[1]}</span>
                </div>
                <p className="gr-title">{review.title}</p>
                <p className="gr-text">{review.text}</p>
              </article>
            ))}
          </Swipe>
        </div>
        <div className="reels">
          {reels.map((item, index) => (
            <button key={item.name} className={`reel rv zoom${index ? ` d${index}` : ""}`} type="button" aria-label={item.label} onClick={() => setOpen(index)}>
              <span className="rl-logo">
                <img src={item.logo} alt="" />
              </span>
              <span className="play">
                <svg viewBox="0 0 24 24">
                  <path d="M7 4l13 8-13 8z" fill="#2e1065" />
                </svg>
              </span>
              <span className="rn">
                {item.name}
                <small>{item.caption}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`modal${open !== null ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="ग्राहक की कहानी"
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null);
        }}
      >
        <div className="reel-box">
          <div className="reel-prog">
            <i style={{ width: runBar ? "100%" : "0", transition: runBar ? `width ${total}ms linear` : "none" }} />
          </div>
          <button className="x-close" type="button" aria-label="कहानी बंद करें" onClick={() => setOpen(null)}>
            ✕
          </button>
          {reel ? (
            <div className="reel-logo" key={reel.name}>
              <img src={reel.logo} alt={`${reel.name} लोगो`} />
            </div>
          ) : null}
          <div className="reel-txt">
            {lines.map((line, index) => (
              <div key={line.text} className={`ln${line.kind}${index < shown ? " show" : ""}`}>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
