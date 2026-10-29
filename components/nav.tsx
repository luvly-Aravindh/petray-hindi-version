"use client";

import { useEffect, useRef, useState } from "react";
import { images } from "@/lib/images";

const links = [
  { href: "https://chililabs.ai/whats-new", label: "नया क्या है", fresh: true },
  { href: "https://chililabs.ai/demo", label: "लाइव डेमो", fresh: false },
  { href: "https://chililabs.ai/dashboard", label: "डैशबोर्ड", fresh: false },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (open && navRef.current && !navRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className={`topnav${open ? " open" : ""}`} id="topnav" aria-label="Chili Labs" ref={navRef}>
      <div className="wrap nav-in">
        <span className="nav-brand">
          <img src={images.logo} alt="Chili Labs का लोगो" width={28} height={28} />
          <span>Chili Labs</span>
        </span>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="navLinks"
          aria-label="मेन्यू खोलें"
          onClick={() => setOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#160b2e" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="nav-links" id="navLinks">
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
              {link.label}
              {link.fresh ? <span className="new" aria-hidden="true" /> : null}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
