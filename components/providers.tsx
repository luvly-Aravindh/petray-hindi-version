"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Clock = { days: string; h: string; m: string; s: string };

const CountdownContext = createContext<Clock>({ days: "—", h: "00", m: "00", s: "00" });

function pad(n: number) {
  return (n < 10 ? "0" : "") + n;
}

export function CountdownProvider({ children }: { children: React.ReactNode }) {
  const [clock, setClock] = useState<Clock>({ days: "—", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const bf = new Date(2026, 10, 27, 0, 0, 0);
    const tick = () => {
      const s = Math.floor(Math.max(0, bf.getTime() - Date.now()) / 1000);
      const d = Math.floor(s / 86400);
      setClock({
        days: String(d),
        h: pad(Math.floor((s % 86400) / 3600)),
        m: pad(Math.floor((s % 3600) / 60)),
        s: pad(s % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <CountdownContext.Provider value={clock}>{children}</CountdownContext.Provider>;
}

export function useCountdown() {
  return useContext(CountdownContext);
}

type LeadApi = { open: boolean; openForm: () => void; closeForm: () => void };

const LeadContext = createContext<LeadApi | null>(null);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  const openForm = useCallback(() => {
    lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setOpen(false);
    const back = lastFocus.current;
    window.setTimeout(() => back?.focus({ preventScroll: true }), 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", open);
    return () => document.body.classList.remove("locked");
  }, [open]);

  const value = useMemo(() => ({ open, openForm, closeForm }), [open, openForm, closeForm]);
  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead must be used inside LeadProvider");
  return ctx;
}

export function BookButton({ children }: { children: React.ReactNode }) {
  const { openForm } = useLead();
  return (
    <button className="cta" type="button" onClick={openForm}>
      {children}
      <span className="arr" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
}
