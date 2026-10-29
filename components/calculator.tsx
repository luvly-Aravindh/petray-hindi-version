"use client";

import { useEffect, useRef, useState } from "react";

function tween(el: HTMLElement, to: number, decimals: boolean, reduce: boolean) {
  const from = parseFloat(el.dataset.v || "0");
  const start = performance.now();
  const duration = reduce ? 1 : 420;
  el.dataset.v = String(to);
  const frame = (now: number) => {
    const k = Math.min(1, (now - start) / duration);
    const value = from + (to - from) * (1 - Math.pow(1 - k, 3));
    el.textContent = decimals ? value.toFixed(1) : Math.round(value).toLocaleString("hi-IN");
    if (k < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function Calculator() {
  const [tickets, setTickets] = useState(47);
  const [minutes, setMinutes] = useState(6);
  const [share, setShare] = useState(63);
  const hoursRef = useRef<HTMLDivElement>(null);
  const weeksRef = useRef<HTMLElement>(null);
  const repeatRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hours = hoursRef.current;
    const weeks = weeksRef.current;
    const repeat = repeatRef.current;
    if (!hours || !weeks || !repeat) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const repeated = tickets * 30.4 * (share / 100);
    const hrs = (repeated * minutes) / 60;
    tween(hours, Math.round(hrs), false, reduce);
    tween(weeks, hrs / 40, true, reduce);
    tween(repeat, Math.round(repeated), false, reduce);
  }, [tickets, minutes, share]);

  return (
    <section className="sec" style={{ background: "var(--tint)" }}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow rv up">हिसाब लगाकर देखें</span>
          <h2 className="rv blur">
            “मेरा ऑर्डर कहाँ है?” के जवाब में <em>कितने घंटे जा रहे हैं?</em>
          </h2>
          <p className="rv up d1">अपने स्टोर के हिसाब से स्लाइडर बदलें। हिसाब आपके आँकड़ों पर है।</p>
        </div>
        <div className="calc rv up d2">
          <div className="calc-in">
            <div className="rng">
              <label htmlFor="r1">
                रोज़ के टिकट <output id="o1">{tickets}</output>
              </label>
              <input id="r1" type="range" min={5} max={600} step={1} value={tickets} onChange={(e) => setTickets(Number(e.target.value))} />
              <small>ईमेल, चैट और संपर्क फ़ॉर्म मिलाकर</small>
            </div>
            <div className="rng">
              <label htmlFor="r2">
                हर जवाब में लगने वाले मिनट <output id="o2">{minutes}</output>
              </label>
              <input id="r2" type="range" min={1} max={20} step={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
              <small>ऑर्डर ढूँढ़ना, टाइप करना, भेजना</small>
            </div>
            <div className="rng">
              <label htmlFor="r3">
                दोहराए जाने वाले सवालों का हिस्सा <output id="o3">{share}%</output>
              </label>
              <input id="r3" type="range" min={10} max={90} step={1} value={share} onChange={(e) => setShare(Number(e.target.value))} />
              <small>ऑर्डर की स्थिति, रिटर्न, रिफ़ंड, आम सवाल</small>
            </div>
          </div>
          <div className="calc-out" aria-live="polite">
            <div className="big" id="hOut" ref={hoursRef}>
              0
            </div>
            <p>घंटे हर महीने उन जवाबों को टाइप करने में जाते हैं जो आपके Shopify डेटा में पहले से मौजूद हैं।</p>
            <div className="sub2">
              <div>
                <b id="wOut" ref={weeksRef}>
                  0
                </b>
                काम के हफ़्ते हर महीने
              </div>
              <div>
                <b id="tOut" ref={repeatRef}>
                  0
                </b>
                बार-बार आने वाले टिकट हर महीने
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
