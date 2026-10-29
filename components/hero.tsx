"use client";

import { useEffect, useRef, useState } from "react";
import { demoTickets, type DemoEnd } from "@/lib/content";
import { BookButton } from "./providers";

function splitWords(text: string, index: { n: number }) {
  return text.split(/(\s+)/).map((part, i) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return part;
    const delay = 0.06 + index.n * 0.04;
    index.n += 1;
    return (
      <span key={`${part}-${i}`} className="w" style={{ animationDelay: `${delay}s` }}>
        {part}
      </span>
    );
  });
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f0abfc" strokeWidth="2">
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

const channelIcon = { email: EmailIcon, chat: ChatIcon, form: FormIcon };

function segments(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("hi-IN", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return [text];
}

type Pill = "open" | "ok" | "hu";

export function Hero() {
  const wordIndex = { n: 0 };
  const demoRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const running = useRef(true);
  const indexRef = useRef(0);
  const [active, setActive] = useState(0);
  const [pills, setPills] = useState<Pill[]>(["open", "open", "open"]);
  const [done, setDone] = useState([false, false, false]);
  const [chips, setChips] = useState(0);
  const [draft, setDraft] = useState("");
  const [caret, setCaret] = useState(true);
  const [conf, setConf] = useState("");
  const [note, setNote] = useState("");
  const [send, setSend] = useState<"idle" | "ready" | "sent">("idle");
  const [stateLabel, setStateLabel] = useState("AI पढ़ रहा है");
  const [stateKind, setStateKind] = useState<"ai" | "ok" | "hu">("ai");
  const [solved, setSolved] = useState(0);
  const [playing, setPlaying] = useState(true);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const play = (index: number) => {
    const ticket = demoTickets[index];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    indexRef.current = index;
    setActive(index);
    setStateKind("ai");
    setStateLabel("AI पढ़ रहा है");
    setChips(0);
    setDraft("");
    setCaret(true);
    setConf("");
    setNote("");
    setSend("idle");

    ticket.look.forEach((_, chipIndex) => {
      later(() => setChips(chipIndex + 1), 500 + chipIndex * 450);
    });

    const parts = segments(ticket.draft);
    const speed = reduce ? 0 : 22;
    const start = 500 + ticket.look.length * 450 + 250;
    for (let cursor = 0; cursor <= parts.length; cursor++) {
      later(() => setDraft(parts.slice(0, cursor).join("")), start + cursor * speed);
    }
    const endAt = start + parts.length * speed + 350;
    later(() => {
      setConf(ticket.conf);
      setSend("ready");
    }, endAt);
    later(() => {
      setCaret(false);
      setSend("sent");
      setNote(ticket.note);
      const kind: DemoEnd = ticket.end;
      setPills((current) => current.map((pill, i) => (i === index ? (kind === "hu" ? "hu" : "ok") : pill)));
      setDone((current) => current.map((item, i) => (i === index ? true : item)));
      setStateKind(kind === "hu" ? "hu" : "ok");
      setStateLabel(kind === "hu" ? "टीम के पास" : "हल हुआ");
      setSolved((count) => count + 1);
    }, endAt + 900);
    later(() => {
      const next = (index + 1) % demoTickets.length;
      if (next === 0) {
        setDone([false, false, false]);
        setPills(["open", "open", "open"]);
      }
      if (running.current) play(next);
    }, endAt + 2600);
  };

  useEffect(() => {
    const node = demoRef.current;
    if (!node) return;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (started) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          started = true;
          play(0);
        }
      },
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      running.current = false;
      clearTimers();
    };
    // The demo sequence owns its timers and restarts only when this effect remounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ticket = demoTickets[active];

  return (
    <header className="hero">
      <div className="wrap">
        <h1 className="split" id="h1">
          {splitWords("आज 50वीं बार ", wordIndex)}
          <em>{splitWords("“मेरा ऑर्डर कहाँ है?”", wordIndex)}</em>
          {splitWords(" का वही जवाब टाइप करना बंद करें।", wordIndex)}
        </h1>
        <p className="hero-sub h-in" style={{ animationDelay: ".2s" }}>
          AI असली Shopify ऑर्डर की जानकारी से हर जवाब का ड्राफ़्ट बनाता है। मुश्किल टिकट आपकी टीम तक पहुँचते हैं।
        </p>
        <div className="cta-block h-in" style={{ animationDelay: ".3s" }}>
          <BookButton>मेरी सेटअप कॉल बुक करें</BookButton>
          <p className="cta-note">15 दिन मुफ़्त। 7 मिनट से भी कम में सेटअप।</p>
        </div>
        <div className="hero-proof h-in" style={{ animationDelay: ".45s" }}>
          <span>
            <span className="star" aria-hidden="true">
              ★
            </span>
            <b>4.6</b> रेटिंग Shopify App Store पर
          </span>
          <span className="hp-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </svg>
            सिर्फ़ Shopify के लिए बनाया गया
          </span>
        </div>
        <div className="stage h-in" style={{ animationDelay: ".6s" }}>
          <div className="demo" ref={demoRef} aria-label="प्रोडक्ट डेमो: Shopify सपोर्ट टिकटों के जवाब देता Chili Labs">
            <div className="demo-bar">
              <i />
              <i />
              <i />
              <span className="ttl">डेमो स्टोर का इनबॉक्स</span>
              <span className="live">AI सक्रिय है</span>
            </div>
            <div className="demo-body">
              <div className="q-list" id="qList">
                {demoTickets.map((item, i) => {
                  const Icon = channelIcon[item.ch];
                  return (
                    <div key={item.id} className={`tk${active === i ? " on" : ""}${done[i] ? " done" : ""}`} id={`tk${i}`}>
                      <span className="ch">
                        <Icon />
                      </span>
                      <span className="t">
                        <b>
                          {item.id} {item.title}
                        </b>
                        <small>माध्यम: {item.via}</small>
                      </span>
                      <span className={`pill ${pills[i]}`}>{pills[i] === "ok" ? "हल हुआ" : pills[i] === "hu" ? "टीम" : "खुला"}</span>
                    </div>
                  );
                })}
              </div>
              <div className="pane">
                <div className="pane-h">
                  <b id="pTitle">
                    {ticket.id} {ticket.title}
                  </b>
                  <span className={`pill ${stateKind}`} id="pState">
                    {stateLabel}
                  </span>
                </div>
                <div className="msg cust" id="pCust">
                  {ticket.cust}
                </div>
                <div className="lookup" id="pLook">
                  {ticket.look.map((label, i) => (
                    <span key={label} className={`chip${i < chips ? " show" : ""}`}>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="msg draft">
                  <div className="lbl">
                    <span id="pLbl">{ticket.lbl}</span>
                    <span id="pConf">{conf}</span>
                  </div>
                  <span id="pDraft">{draft}</span>
                  <span className="caret" id="caret" style={{ display: caret ? "inline-block" : "none" }} />
                </div>
                <div className="sendrow">
                  <span id="pNote" style={{ fontSize: 12, color: "#9c8fc0" }}>
                    {note}
                  </span>
                  <button
                    className={`sendbtn${send === "ready" ? " ready" : ""}${send === "sent" ? " sent" : ""}`}
                    id="pSend"
                    tabIndex={-1}
                    aria-hidden="true"
                    type="button"
                  >
                    {send === "sent" ? (ticket.end === "hu" ? "सौंप दिया" : "भेज दिया") : ticket.end === "hu" ? "सौंपें" : "भेजें"}
                  </button>
                </div>
              </div>
            </div>
            <div className="demo-foot">
              <span>
                इस सेशन में हल किए:{" "}
                <b id="solved" style={{ color: "#fff" }}>
                  {solved}
                </b>
              </span>
              <button
                type="button"
                id="demoToggle"
                onClick={() => {
                  const next = !running.current;
                  running.current = next;
                  setPlaying(next);
                  clearTimers();
                  if (next) play(indexRef.current);
                }}
              >
                {playing ? "डेमो रोकें" : "डेमो चलाएँ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
