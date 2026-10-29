"use client";

import { useCountdown } from "./providers";
import { BookButton } from "./providers";

export function PromoBand() {
  const clock = useCountdown();
  return (
    <div className="band" role="note">
      ब्लैक फ़्राइडे में{" "}
      <b>
        <span id="bandDays">{clock.days}</span> दिन
      </b>{" "}
      बाकी हैं। अपना सपोर्ट अभी तैयार करें।
    </div>
  );
}

export function BottomBar() {
  const clock = useCountdown();
  return (
    <div className="fbar" id="fbar" aria-label="ब्लैक फ़्राइडे की उलटी गिनती">
      <div className="fbar-in">
        <div className="fb-l">
          <small>ब्लैक फ़्राइडे की उलटी गिनती। सपोर्ट पहले तैयार करें।</small>
          <div className="clock">
            <span>{clock.days}</span>
            <em>दिन</em>
            <span>{clock.h}</span>
            <em>घं.</em>
            <span>{clock.m}</span>
            <em>मि.</em>
            <span>{clock.s}</span>
            <em>से.</em>
          </div>
        </div>
        <BookButton>मेरी सेटअप कॉल बुक करें</BookButton>
      </div>
    </div>
  );
}
