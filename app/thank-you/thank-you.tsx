"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { brandLogos, images } from "@/lib/images";
import styles from "./thanks.module.css";

function stamp(ms: number) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function ThankYou() {
  const params = useSearchParams();
  const name = (params.get("name") || "").trim().split(" ")[0];
  const store = (params.get("store") || "").trim();
  const slot = params.get("slot");
  const mins = parseInt(params.get("mins") || "20", 10) || 20;
  const when = slot ? Date.parse(slot) : NaN;
  const booked = !Number.isNaN(when);

  const calendar = useMemo(() => {
    if (!booked) return "";
    const end = when + mins * 60000;
    const title = `Chili Labs के साथ कॉल${store ? ` (${store})` : ""}`;
    const details = "Chili Labs की टीम के साथ कॉल।";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(when)}/${stamp(end)}&details=${encodeURIComponent(details)}`;
  }, [booked, when, mins, store]);

  useEffect(() => {
    document.body.style.paddingBottom = "0";
    if (typeof window.fbq !== "function") {
      return () => {
        document.body.style.paddingBottom = "";
      };
    }
    window.fbq("track", "Lead");
    if (booked) window.fbq("track", "Schedule");
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [booked]);

  const zone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "";
    }
  })();

  const downloadIcs = () => {
    if (!booked) return;
    const end = when + mins * 60000;
    const title = `Chili Labs के साथ कॉल${store ? ` (${store})` : ""}`;
    const details = "Chili Labs की टीम के साथ कॉल।";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Chili Labs//Call//EN",
      "BEGIN:VEVENT",
      `UID:${stamp(when)}-${Math.random().toString(36).slice(2)}@chililabs.ai`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(when)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    link.download = "chililabs-call.ics";
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.remove();
    }, 500);
  };

  const whenText = booked
    ? `${new Intl.DateTimeFormat("hi-IN", { weekday: "long", day: "numeric", month: "long" }).format(when)}, ${new Intl.DateTimeFormat("hi-IN", { hour: "numeric", minute: "2-digit" }).format(when)}`
    : "";

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <img src={images.logo} alt="" width={30} height={30} />
          <span>Chili Labs</span>
        </header>
        <section className={styles.hero}>
          <div className={styles.ic}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </svg>
          </div>
          <span className="eyebrow">{booked ? "कॉल बुक हो गई है" : "आपका अनुरोध मिल गया है"}</span>
          <h1>{name ? `धन्यवाद, ${name}।` : "धन्यवाद।"}</h1>
          <p className={styles.lead}>
            {booked
              ? "हमें खुशी है कि आप हमारे साथ जुड़े हैं। आपकी कॉल बुक हो गई है। उससे पहले Chili Labs की टीम का कोई सदस्य आपसे संपर्क करेगा।"
              : "हमें खुशी है कि आप हमारे साथ जुड़े हैं। Chili Labs की टीम का कोई सदस्य जल्द आपसे संपर्क करेगा।"}
          </p>
          {booked ? (
            <div className={styles.card}>
              <div className={styles.lbl}>आपकी कॉल</div>
              <div className={styles.when}>{whenText}</div>
              <div className={styles.meta}>
                <span className={styles.chip}>{mins} मिनट</span>
                <span className={styles.chip}>Chili Labs की टीम के साथ</span>
                <span className={styles.chip}>{zone ? `आपके समय क्षेत्र के अनुसार (${zone})` : "आपका स्थानीय समय"}</span>
              </div>
              <div className={styles.cal}>
                <a className={styles.btn2} href={calendar} target="_blank" rel="noopener">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="5" width="18" height="16" rx="3" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                  Google Calendar में जोड़ें
                </a>
                <button type="button" className={styles.btn2} onClick={downloadIcs}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                  </svg>
                  कॉल का निमंत्रण डाउनलोड करें
                </button>
              </div>
            </div>
          ) : null}
          <div className="next">
            <div>
              <b className="n">1</b>
              <span>Shopify App Store खोलें, Chililabs: AI Customer Support खोजें और Install पर टैप करें।</span>
            </div>
            <div>
              <b className="n">2</b>
              <span>Shopify में इसे अनुमति दें। सेटअप में 7 मिनट से भी कम लगते हैं।</span>
            </div>
            <div>
              <b className="n">3</b>
              <span>
                {booked
                  ? "कॉल पर Chili Labs की टीम आपके साथ मिलकर शिकायतें संभालने की प्रक्रिया और AI के जवाब सेट करेगी।"
                  : "Chili Labs की टीम WhatsApp और ईमेल पर आपसे संपर्क करेगी और आपके साथ मिलकर शिकायतें संभालने की प्रक्रिया और AI के जवाब सेट करेगी।"}
              </span>
            </div>
          </div>
        </section>
        <section className={styles.proof}>
          <div className={styles.stars} aria-hidden="true">
            ★★★★★
          </div>
          <p>Shopify App Store पर 4.6 रेटिंग। तेज़ी से बढ़ते Shopify ब्रांड्स का भरोसा।</p>
          <div className={styles.logos}>
            {brandLogos.map((logo) => (
              <div className={styles.lg} key={logo.alt}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </section>
      </div>
      <footer className={styles.foot}>Chili Labs। Shopify के अंदर ही AI ग्राहक सपोर्ट।</footer>
    </div>
  );
}
