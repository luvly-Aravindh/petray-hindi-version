"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CALL_MINUTES, buildDays, fieldOk, formatWhen, tierOf, visitorTimeZone, type DaySlots, type LeadFields } from "@/lib/booking";
import { Arrow } from "./icons";
import { useLead } from "./providers";

const empty: LeadFields = {
  platform: "",
  store: "",
  market: "",
  orders: "",
  team: "",
  channels: [],
  name: "",
  email: "",
  phone: "",
  plan: "",
};

const stepFields = [
  ["platform", "store", "market"],
  ["orders", "team", "channels"],
  ["name", "email", "phone", "plan"],
];

function NextSteps({ setup }: { setup: string }) {
  return (
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
        <span>{setup}</span>
      </div>
    </div>
  );
}

function Choice({
  name,
  value,
  checked,
  label,
  type = "radio",
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  type?: "radio" | "checkbox";
  onChange: () => void;
}) {
  return (
    <label className="opt">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

export function LeadModal() {
  const { open, closeForm } = useLead();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<LeadFields>(empty);
  const [errors, setErrors] = useState<string[]>([]);
  const [phase, setPhase] = useState<"form" | "booking" | "booked" | "skipped" | "notfit">("form");
  const [days, setDays] = useState<DaySlots[]>([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [zone, setZone] = useState("आपका स्थानीय समय");

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const field = cardRef.current?.querySelector<HTMLElement>(".fstep.on input, .f-close");
      field?.focus({ preventScroll: true });
    }, reduce ? 0 : 380);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeForm();
        return;
      }
      if (event.key !== "Tab" || !cardRef.current) return;
      const focusable = Array.from(cardRef.current.querySelectorAll<HTMLElement>("button,input,summary")).filter(
        (el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeForm, step, phase]);

  const clearError = (name: string) => setErrors((current) => current.filter((item) => item !== name));

  const setText = (name: keyof LeadFields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const setRadio = (name: keyof LeadFields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const toggleChannel = (value: string) => {
    setFields((current) => ({
      ...current,
      channels: current.channels.includes(value) ? current.channels.filter((item) => item !== value) : [...current.channels, value],
    }));
    clearError("channels");
  };

  const valueOf = (name: string) => (name === "channels" ? fields.channels : fields[name as keyof LeadFields]);

  const validate = (index: number) => {
    const bad = stepFields[index].filter((name) => {
      if (name === "store" && fields.platform === "other") return false;
      return !fieldOk(name, valueOf(name) as string | string[]);
    });
    setErrors(bad);
    if (bad[0]) {
      cardRef.current?.querySelector<HTMLElement>(`[data-req="${bad[0]}"] input`)?.focus();
    }
    return bad.length === 0;
  };

  const showStep = (index: number) => {
    setStep(index);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const publishLead = (qualified: boolean) => {
    const lead = {
      qualified,
      ...fields,
      channels: fields.channels.join(","),
      tier: tierOf(fields),
      page: "chililabs_trial_lp_v9.4",
      ts: new Date().toISOString(),
    };
    window.dispatchEvent(new CustomEvent("chili:lead", { detail: lead }));
    if (qualified && typeof window.fbq === "function") window.fbq("track", "Lead");
    if (!qualified && typeof window.fbq === "function") window.fbq("trackCustom", "NotAFit");
    return lead;
  };

  const goNext = () => {
    if (!validate(step)) return;
    if (step === 0 && fields.platform === "other") {
      publishLead(false);
      setPhase("notfit");
      return;
    }
    showStep(step + 1);
  };

  const finish = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate(2)) return;
    publishLead(true);
    setZone(visitorTimeZone());
    setDays(buildDays(fields.market));
    setDayIndex(0);
    setSlot(null);
    setPhase("booking");
    cardRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmSlot = () => {
    if (!slot) return;
    const booking = {
      email: fields.email,
      phone: fields.phone,
      name: fields.name,
      store: fields.store,
      tier: tierOf(fields),
      market: fields.market,
      slot_utc: new Date(slot).toISOString(),
      slot_local: formatWhen(slot, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }),
      visitor_tz: zone,
      minutes: CALL_MINUTES,
      page: "chililabs_trial_lp_v9.4",
      ts: new Date().toISOString(),
    };
    window.dispatchEvent(new CustomEvent("chili:booking", { detail: booking }));
    if (typeof window.fbq === "function") window.fbq("track", "Schedule");
    const params = new URLSearchParams({
      name: fields.name,
      store: fields.store,
      slot: booking.slot_utc,
      mins: String(CALL_MINUTES),
    });
    setPhase("booked");
    router.push(`/thank-you?${params.toString()}`);
  };

  const firstName = fields.name.split(" ")[0] || "दोस्त";
  const activeDay = days[dayIndex];

  return (
    <div
      className={`fmodal${open ? " open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fTitle"
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeForm();
      }}
    >
      <div
        className="fmodal-in"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeForm();
        }}
      >
        <div className="form-card" id="formCard" ref={cardRef}>
          <button type="button" className="f-close" aria-label="फ़ॉर्म बंद करें" onClick={closeForm}>
            ✕
          </button>

          {phase === "form" ? (
            <>
              <h2 className="f-title" id="fTitle">
                अपना मुफ़्त ट्रायल शुरू करें
              </h2>
              <p className="f-intro">तीन छोटे सवाल, ताकि हम आपके स्टोर के लिए Chili Labs सेट कर सकें। इसमें लगभग 60 सेकंड लगेंगे।</p>
              <div className="prog" aria-hidden="true">
                <i className={step >= 0 ? "on" : undefined} />
                <i className={step >= 1 ? "on" : undefined} />
                <i className={step >= 2 ? "on" : undefined} />
              </div>
              <form id="leadForm" noValidate onSubmit={finish}>
                <div className={`fstep${step === 0 ? " on" : ""}`} data-step="1">
                  <h3>आपका स्टोर</h3>
                  <p className="hint">3 में से पहला चरण</p>
                  <div className={`fld${errors.includes("platform") ? " bad" : ""}`} data-req="platform">
                    <span className="lab" id="lp">
                      आपका स्टोर किस प्लेटफ़ॉर्म पर है?
                    </span>
                    <div className="opts one" role="radiogroup" aria-labelledby="lp">
                      <Choice name="platform" value="shopify" checked={fields.platform === "shopify"} label="Shopify पर है और ऑर्डर आ रहे हैं" onChange={() => setRadio("platform", "shopify")} />
                      <Choice name="platform" value="shopify_prelaunch" checked={fields.platform === "shopify_prelaunch"} label="Shopify पर है, जल्द लॉन्च होगा" onChange={() => setRadio("platform", "shopify_prelaunch")} />
                      <Choice name="platform" value="other" checked={fields.platform === "other"} label="कोई दूसरा प्लेटफ़ॉर्म (WooCommerce, कस्टम वेबसाइट या मार्केटप्लेस)" onChange={() => setRadio("platform", "other")} />
                    </div>
                    <p className="err">आगे बढ़ने के लिए एक विकल्प चुनें।</p>
                  </div>
                  <div className={`fld${errors.includes("store") ? " bad" : ""}`} data-req="store">
                    <label htmlFor="store">स्टोर का URL</label>
                    <input id="store" name="store" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" value={fields.store} onChange={(e) => setText("store", e.target.value)} />
                    <p className="err">अपने स्टोर का URL डालें, ताकि हम सही स्टोर कनेक्ट कर सकें।</p>
                  </div>
                  <div className={`fld${errors.includes("market") ? " bad" : ""}`} data-req="market">
                    <span className="lab" id="lm">
                      आपके ज़्यादातर ग्राहक कहाँ हैं?
                    </span>
                    <div className="opts three" role="radiogroup" aria-labelledby="lm">
                      <Choice name="market" value="india" checked={fields.market === "india"} label="भारत" onChange={() => setRadio("market", "india")} />
                      <Choice name="market" value="us" checked={fields.market === "us"} label="अमेरिका" onChange={() => setRadio("market", "us")} />
                      <Choice name="market" value="global" checked={fields.market === "global"} label="कहीं और" onChange={() => setRadio("market", "global")} />
                    </div>
                    <p className="err">आगे बढ़ने के लिए एक विकल्प चुनें।</p>
                  </div>
                  <div className="fnav">
                    <button type="button" className="cta" onClick={goNext}>
                      आगे बढ़ें
                      <span className="arr" aria-hidden="true">
                        <Arrow />
                      </span>
                    </button>
                  </div>
                </div>

                <div className={`fstep${step === 1 ? " on" : ""}`} data-step="2">
                  <h3>आपके स्टोर का सपोर्ट</h3>
                  <p className="hint">3 में से दूसरा चरण</p>
                  <div className={`fld${errors.includes("orders") ? " bad" : ""}`} data-req="orders">
                    <span className="lab" id="lo">
                      हर महीने कितने ऑर्डर आते हैं?
                    </span>
                    <div className="opts" role="radiogroup" aria-labelledby="lo">
                      <Choice name="orders" value="lt300" checked={fields.orders === "lt300"} label="300 से कम" onChange={() => setRadio("orders", "lt300")} />
                      <Choice name="orders" value="300_1000" checked={fields.orders === "300_1000"} label="300 से 1,000" onChange={() => setRadio("orders", "300_1000")} />
                      <Choice name="orders" value="1000_5000" checked={fields.orders === "1000_5000"} label="1,000 से 5,000" onChange={() => setRadio("orders", "1000_5000")} />
                      <Choice name="orders" value="gt5000" checked={fields.orders === "gt5000"} label="5,000 से ज़्यादा" onChange={() => setRadio("orders", "gt5000")} />
                    </div>
                    <p className="err">आगे बढ़ने के लिए एक विकल्प चुनें।</p>
                  </div>
                  <div className={`fld${errors.includes("team") ? " bad" : ""}`} data-req="team">
                    <span className="lab" id="lt">
                      अभी ग्राहकों के सवालों का जवाब कौन देता है?
                    </span>
                    <div className="opts" role="radiogroup" aria-labelledby="lt">
                      <Choice name="team" value="founder" checked={fields.team === "founder"} label="सिर्फ़ मैं" onChange={() => setRadio("team", "founder")} />
                      <Choice name="team" value="2_5" checked={fields.team === "2_5"} label="2 से 5 लोग" onChange={() => setRadio("team", "2_5")} />
                      <Choice name="team" value="6plus" checked={fields.team === "6plus"} label="6 या ज़्यादा लोग" onChange={() => setRadio("team", "6plus")} />
                      <Choice name="team" value="outsourced" checked={fields.team === "outsourced"} label="बाहरी सपोर्ट टीम" onChange={() => setRadio("team", "outsourced")} />
                    </div>
                    <p className="err">आगे बढ़ने के लिए एक विकल्प चुनें।</p>
                  </div>
                  <div className={`fld${errors.includes("channels") ? " bad" : ""}`} data-req="channels">
                    <span className="lab" id="lc">
                      ग्राहकों के सवाल कहाँ आते हैं? सभी लागू विकल्प चुनें।
                    </span>
                    <div className="opts" role="group" aria-labelledby="lc">
                      <Choice type="checkbox" name="channels" value="email" checked={fields.channels.includes("email")} label="ईमेल" onChange={() => toggleChannel("email")} />
                      <Choice type="checkbox" name="channels" value="chat" checked={fields.channels.includes("chat")} label="वेबसाइट चैट" onChange={() => toggleChannel("chat")} />
                      <Choice type="checkbox" name="channels" value="whatsapp" checked={fields.channels.includes("whatsapp")} label="WhatsApp" onChange={() => toggleChannel("whatsapp")} />
                      <Choice type="checkbox" name="channels" value="instagram" checked={fields.channels.includes("instagram")} label="Instagram मैसेज" onChange={() => toggleChannel("instagram")} />
                      <Choice type="checkbox" name="channels" value="phone" checked={fields.channels.includes("phone")} label="फ़ोन कॉल" onChange={() => toggleChannel("phone")} />
                      <Choice type="checkbox" name="channels" value="helpdesk" checked={fields.channels.includes("helpdesk")} label="कोई दूसरा हेल्पडेस्क" onChange={() => toggleChannel("helpdesk")} />
                    </div>
                    <p className="err">कम से कम एक विकल्प चुनें।</p>
                  </div>
                  <div className="fnav">
                    <button type="button" className="cta" onClick={goNext}>
                      आगे बढ़ें
                      <span className="arr" aria-hidden="true">
                        <Arrow />
                      </span>
                    </button>
                    <button type="button" className="back" onClick={() => showStep(0)}>
                      पीछे जाएँ
                    </button>
                  </div>
                </div>

                <div className={`fstep${step === 2 ? " on" : ""}`} data-step="3">
                  <h3>आपके ट्रायल की जानकारी कहाँ भेजें?</h3>
                  <p className="hint">3 में से तीसरा चरण</p>
                  <div className={`fld${errors.includes("name") ? " bad" : ""}`} data-req="name">
                    <label htmlFor="name">आपका नाम</label>
                    <input id="name" name="name" type="text" autoComplete="name" placeholder="अपना पूरा नाम" value={fields.name} onChange={(e) => setText("name", e.target.value)} />
                    <p className="err">अपना नाम डालें।</p>
                  </div>
                  <div className={`fld${errors.includes("email") ? " bad" : ""}`} data-req="email">
                    <label htmlFor="email">काम का ईमेल</label>
                    <input id="email" name="email" type="email" autoComplete="email" placeholder="you@yourstore.com" value={fields.email} onChange={(e) => setText("email", e.target.value)} />
                    <p className="err">सही ईमेल पता डालें।</p>
                  </div>
                  <div className={`fld${errors.includes("phone") ? " bad" : ""}`} data-req="phone">
                    <label htmlFor="phone">WhatsApp नंबर</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98xxx xxxxx या +1 555 xxx xxxx" value={fields.phone} onChange={(e) => setText("phone", e.target.value)} />
                    <p className="err">देश के कोड के साथ अपना नंबर डालें, ताकि सेटअप में मदद के लिए हम आपसे संपर्क कर सकें।</p>
                  </div>
                  <div className={`fld${errors.includes("plan") ? " bad" : ""}`} data-req="plan">
                    <span className="lab" id="lpl">
                      आप कौन-सा प्लान लेना चाहते हैं?
                    </span>
                    <div className="opts" role="radiogroup" aria-labelledby="lpl">
                      <Choice name="plan" value="starter" checked={fields.plan === "starter"} label="Starter, $29" onChange={() => setRadio("plan", "starter")} />
                      <Choice name="plan" value="growth" checked={fields.plan === "growth"} label="Growth, $59" onChange={() => setRadio("plan", "growth")} />
                      <Choice name="plan" value="pro" checked={fields.plan === "pro"} label="Pro, $99" onChange={() => setRadio("plan", "pro")} />
                      <Choice name="plan" value="unsure" checked={fields.plan === "unsure"} label="अभी तय नहीं किया" onChange={() => setRadio("plan", "unsure")} />
                    </div>
                    <p className="err">आगे बढ़ने के लिए एक विकल्प चुनें।</p>
                  </div>
                  <div className="fnav">
                    <button type="submit" className="cta">
                      मेरी सेटअप कॉल बुक करें
                      <span className="arr" aria-hidden="true">
                        <Arrow />
                      </span>
                    </button>
                    <button type="button" className="back" onClick={() => showStep(1)}>
                      पीछे जाएँ
                    </button>
                  </div>
                  <p className="fine">हम आपकी जानकारी का इस्तेमाल सिर्फ़ आपका ट्रायल सेट करने और सेवा शुरू करने में मदद के लिए करते हैं।</p>
                </div>
              </form>
            </>
          ) : null}

          {phase === "notfit" ? (
            <div className="done-card">
              <div className="done-ic warn">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <path d="M12 7v6M12 17h.01" />
                </svg>
              </div>
              <h3>Chili Labs सिर्फ़ Shopify स्टोर्स के लिए बनाया गया है।</h3>
              <p>यह सीधे Shopify से ऑर्डर की जानकारी पढ़ता है, जिससे हर जवाब सही रहता है। दूसरे प्लेटफ़ॉर्म के स्टोर्स अभी कनेक्ट नहीं हो सकते, इसलिए फ़िलहाल ट्रायल आपके काम नहीं आएगा। यह सुविधा उपलब्ध होने पर हम आपको बताएँगे।</p>
            </div>
          ) : null}

          {phase === "booking" ? (
            <div className="done-card">
              <div className="done-ic">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </div>
              <h3>आप तैयार हैं, {firstName}.</h3>
              <p>
                बस आख़िरी चरण। {CALL_MINUTES} मिनट की सेटअप कॉल का समय चुनें। Chili Labs की टीम {fields.store || "आपका स्टोर"} चालू करने में आपकी मदद करेगी।
              </p>
              <div className="bk">
                <div className="bk-h">दिन चुनें</div>
                <div className="bk-days" role="group" aria-label="दिन">
                  {days.map((day, index) => (
                    <button
                      key={day.key}
                      type="button"
                      className="bk-day"
                      aria-pressed={index === dayIndex}
                      onClick={() => {
                        setDayIndex(index);
                        setSlot(null);
                      }}
                    >
                      <small>{formatWhen(day.first, { weekday: "short" })}</small>
                      <b>{formatWhen(day.first, { day: "numeric" })}</b>
                      <small>{formatWhen(day.first, { month: "short" })}</small>
                    </button>
                  ))}
                </div>
                <div className="bk-h">समय चुनें</div>
                <div className="bk-slots" role="group" aria-label="समय">
                  {activeDay ? (
                    activeDay.slots.map((time) => (
                      <button key={time} type="button" className="bk-slot" aria-pressed={slot === time} onClick={() => setSlot(time)}>
                        {formatWhen(time, { hour: "numeric", minute: "2-digit" })}
                      </button>
                    ))
                  ) : (
                    <p className="bk-empty">अभी कोई समय उपलब्ध नहीं है। इस चरण को छोड़ दें, हमारी टीम आपको मैसेज करेगी।</p>
                  )}
                </div>
                <p className="bk-tz">समय आपके स्थानीय समय क्षेत्र के अनुसार दिखाए गए हैं ({zone}).</p>
                <button type="button" className="cta" disabled={!slot} onClick={confirmSlot}>
                  मेरी कॉल कन्फ़र्म करें
                  <span className="arr" aria-hidden="true">
                    <Arrow />
                  </span>
                </button>
                <button
                  type="button"
                  className="bk-skip"
                  onClick={() => {
                    const params = new URLSearchParams({ name: fields.name, store: fields.store });
                    setPhase("skipped");
                    router.push(`/thank-you?${params.toString()}`);
                  }}
                >
                  अभी छोड़ें, पहले इंस्टॉल करूँगा
                </button>
              </div>
            </div>
          ) : null}

          {phase === "booked" && slot ? (
            <div className="done-card">
              <div className="done-ic">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </div>
              <h3>आपकी कॉल बुक हो गई है।</h3>
              <div className="booked">
                <b>{formatWhen(slot, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}</b>
                {CALL_MINUTES} मिनट की कॉल Chili Labs की टीम के साथ। कॉल का निमंत्रण {fields.email} पर और रिमाइंडर WhatsApp पर आएगा।
              </div>
              <p>कॉल से पहले ये काम पूरे कर लें, ताकि हम सीधे सेटअप शुरू कर सकें।</p>
              <NextSteps setup="कॉल पर Chili Labs की टीम आपके साथ मिलकर शिकायतें संभालने की प्रक्रिया और AI के जवाब सेट करेगी।" />
            </div>
          ) : null}

          {phase === "skipped" ? (
            <div className="done-card">
              <h3>कोई बात नहीं।</h3>
              <p>आपका 15 दिन का मुफ़्त ट्रायल तैयार है। अब आगे ये करें।</p>
              <NextSteps setup="Chili Labs की टीम WhatsApp और ईमेल पर आपसे संपर्क करेगी और आपके साथ मिलकर शिकायतें संभालने की प्रक्रिया और AI के जवाब सेट करेगी।" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
