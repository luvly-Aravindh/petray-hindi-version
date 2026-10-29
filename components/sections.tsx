"use client";

import { useEffect, useRef } from "react";
import { images, brandLogos } from "@/lib/images";
import { featureTags, plans, faqs } from "@/lib/content";
import { BookButton } from "./providers";
import { Reveal } from "./reveal";
import { Swipe } from "./swipe";
import { Check } from "./icons";

export function LogoMarquee() {
  const half = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];
  const track = [...half, ...half];
  return (
    <section className="logos-sec" aria-label="Chili Labs इस्तेमाल करने वाले Shopify ब्रांड्स">
      <p className="logos-lbl">बढ़ते Shopify ब्रांड्स का भरोसा</p>
      <div className="marquee">
        <div className="mq-track" id="mq">
          {track.map((logo, index) => (
            <div className="lg" key={`${logo.alt}-${index}`}>
              <img className={logo.square ? "sq" : undefined} src={logo.src} alt={index < half.length ? logo.alt : ""} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pain() {
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const photo = photoRef.current;
    if (!photo) return;
    const bubbles = Array.from(photo.querySelectorAll<HTMLElement>(".bub"));
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          bubbles.forEach((bubble, index) => {
            timers.push(window.setTimeout(() => bubble.classList.add("show"), 350 + index * 650));
          });
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(photo);
    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section className="sec" style={{ paddingTop: 24 }}>
      <div className="wrap pain-grid">
        <div className="pain-photo rv zoom" id="painPhoto" ref={photoRef}>
          <img src={images.parcels} alt="भेजे जाने के लिए तैयार पार्सलों के ढेर" />
          <div className="bubbles">
            <div className="bub">
              <small>ईमेल, सुबह 9:14</small>मेरा ऑर्डर कहाँ है? 6 दिन हो गए हैं।
            </div>
            <div className="bub">
              <small>चैट, सुबह 9:15</small>नमस्ते, मुझे गलत साइज़ मिला है। क्या इसे बदल सकते हैं?
            </div>
            <div className="bub">
              <small>संपर्क फ़ॉर्म, सुबह 9:17</small>हेलो?? अभी भी अपने रिफ़ंड का इंतज़ार कर रहा हूँ।
            </div>
          </div>
        </div>
        <div className="pain-copy">
          <Reveal className="eyebrow rv up" as="span">
            कुछ जाना-पहचाना लगा?
          </Reveal>
          <Reveal className="rv up d1" as="h2">
            आपकी टीम धीमी नहीं है। <em>काम करने का तरीका धीमा है।</em>
          </Reveal>
          <Reveal className="rv up d2" as="p">
            हर भेजे गए ऑर्डर के साथ सवाल आते हैं। कहाँ पहुँचा? क्या इसे बदल सकते हैं? पैसे कब वापस मिलेंगे? ज़्यादातर जवाबों के लिए सिर्फ़ जानकारी ढूँढ़नी होती है। इन्हें खुद ढूँढ़कर जवाब देने में वे घंटे निकल जाते हैं जो स्टोर बढ़ाने में लगने चाहिए।
          </Reveal>
          <Reveal className="chain rv up d2">
            <span>ऑर्डर Shopify में</span>
            <i>+</i>
            <span>ट्रैकिंग कूरियर ऐप में</span>
            <i>+</i>
            <span>सवाल आपके इनबॉक्स में</span>
            <i>=</i>
            <span>पहले तीनों जगह जाँच, फिर जवाब टाइप</span>
          </Reveal>
          <Reveal className="voice rv up d3">
            <b>“वही ‘मेरा ऑर्डर कहाँ है?’ वाले DMs का जवाब देने में रोज़ मेरे 2 घंटे निकल जाते थे।”</b>
            <small>फ़ाउंडर्स की कम्युनिटी में एक Shopify फ़ाउंडर</small>
          </Reveal>
          <div className="tried">
            <Reveal className="rv right d2">
              <span className="x">✕</span>
              <span>मुनाफ़ा बचाने के लिए आपने नई भर्ती टाली, तो हर जानकारी ढूँढ़ने की ज़िम्मेदारी आप पर आ गई।</span>
            </Reveal>
            <Reveal className="rv right d3">
              <span className="x">✕</span>
              <span>आपने सभी मैसेज एक इनबॉक्स में लाने की कोशिश की। बस एक और टैब बढ़ गया, और अब भी यही सोचते हैं, “क्या मैंने इन्हें जवाब दिया था?”</span>
            </Reveal>
            <Reveal className="rv right d4">
              <span className="x">✕</span>
              <span>आपने चैटबॉट आज़माया। वह ऑर्डर देख नहीं सका, डिलीवरी की समस्या पर अंदाज़ा लगाया और ग्राहक का भरोसा टूट गया।</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  ["अपना Shopify स्टोर कनेक्ट करें", "Shopify में ऐप को मंज़ूरी दें। Chili Labs आपके ऑर्डर, ग्राहकों और पॉलिसी की जानकारी ले लेता है।", "7 मिनट से भी कम में"],
  ["ग्राहक सीधे बताएँ कि समस्या क्या है", "Amazon जैसे समस्या मेन्यू से हर टिकट के साथ ऑर्डर और समस्या की वजह मिलती है।", "बार-बार पूछने की ज़रूरत नहीं"],
  ["असली ऑर्डर से AI जवाब का ड्राफ़्ट बनाए", "ऑर्डर की स्थिति, रिटर्न, एक्सचेंज और रिफ़ंड के लिए आपके ब्रांड के लहजे में सही जवाब का ड्राफ़्ट मिलता है।", "एक क्लिक में भेजें"],
  ["मुश्किल टिकट टीम के पास जाएँ", "जहाँ समझ-बूझ से फैसला चाहिए, वहाँ पूरी जानकारी, प्राथमिकता के संकेत और SLA टाइमर के साथ टिकट सही व्यक्ति तक पहुँचता है।", "कोई टिकट अटका न रहे"],
];

export function HowItWorks() {
  return (
    <section className="sec" style={{ background: "var(--tint)" }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="eyebrow rv up" as="span">
            यह कैसे काम करता है
          </Reveal>
          <Reveal className="rv blur" as="h2">
            बार-बार होने वाला काम AI सँभाले। <em>ज़रूरी फैसले आपकी टीम करे।</em>
          </Reveal>
        </div>
        <div className="steps" id="steps">
          <span className="track" aria-hidden="true">
            <i />
          </span>
          {steps.map(([title, body, time], index) => (
            <Reveal key={title} className={`step rv up${index ? ` d${index}` : ""}`}>
              <div className="num">{index + 1}</div>
              <div className="step-c">
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="time">{time}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Check stroke="#c4b5fd" />
      {children}
    </li>
  );
}

export function Showcase() {
  return (
    <section className="sec" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="dark-panel dark">
        <div className="wrap sec" style={{ paddingBottom: 72 }}>
          <div className="sec-head">
            <Reveal className="eyebrow rv up" as="span">
              Chili Labs के अंदर
            </Reveal>
            <Reveal className="rv blur" as="h2">
              आपकी सपोर्ट टीम की हर ज़रूरत, <em>एक ही जगह।</em>
            </Reveal>
            <Reveal className="rv up d1" as="p">
              असली प्रोडक्ट की झलक, सीधे Shopify App Store की लिस्टिंग से।
            </Reveal>
          </div>
          <Swipe className="show-track swipe" label="प्रोडक्ट के फ़ीचर्स, और देखने के लिए स्वाइप करें">
            <div className="show-row">
              <div className="show-copy">
                <Reveal className="eyebrow rv up" as="span">
                  सब कुछ एक जगह
                </Reveal>
                <Reveal className="serif rv up d1" as="h3">
                  हर सवाल के लिए <em>संपर्क की एक ही जगह।</em>
                </Reveal>
                <Reveal className="rv up d2" as="p">
                  अलग-अलग इनबॉक्स में खोजने की ज़रूरत नहीं। ईमेल, चैट और संपर्क फ़ॉर्म एक ही कतार में आते हैं। हर टिकट के साथ ऑर्डर, प्राथमिकता, स्थिति, ज़िम्मेदार व्यक्ति और SLA मौजूद रहते हैं।
                </Reveal>
                <Reveal className="rv up d3" as="div">
                  <ul>
                    <Bullet>कैटेगरी, प्राथमिकता और SLA फ़िल्टर वाला एक इनबॉक्स</Bullet>
                    <Bullet>टिकट अपने-आप सौंपना और टीम की शिफ़्ट तय करना</Bullet>
                    <Bullet>Gmail, Outlook और कई सपोर्ट इनबॉक्स कनेक्ट करें</Bullet>
                  </ul>
                </Reveal>
              </div>
              <div className="shot rv">
                <img src={images.inbox} alt="Chili Labs का सभी टिकटों वाला व्यू, जिसमें ऑर्डर, प्राथमिकता, स्थिति, ज़िम्मेदार एजेंट, चैनल और SLA के कॉलम हैं" />
              </div>
            </div>
            <div className="show-row flip">
              <div className="show-copy">
                <Reveal className="eyebrow rv up" as="span">
                  समस्या मेन्यू बिल्डर
                </Reveal>
                <Reveal className="serif rv up d1" as="h3">
                  अपना सपोर्ट चलाएँ <em>Amazon की तरह।</em>
                </Reveal>
                <Reveal className="rv up d2" as="p">
                  ग्राहक मेन्यू से अपनी समस्या चुनते हैं: ऑर्डर ट्रैकिंग, कैंसलेशन, पता बदलना, रिटर्न, रिफ़ंड और भी बहुत कुछ। हर अनुरोध तुरंत सही टीम तक पहुँचता है।
                </Reveal>
                <Reveal className="rv up d3" as="div">
                  <ul>
                    <Bullet>लंबे, उलझे हुए ईमेल नहीं</Bullet>
                    <Bullet>टिकट के साथ ऑर्डर और समस्या की वजह मिलती है</Bullet>
                  </ul>
                </Reveal>
              </div>
              <div className="shot rv">
                <img src={images.issueMenu} alt="Chili Labs का समस्या मेन्यू, जो नौ कैटेगरी के साथ ग्राहक से समस्या पूछता है" />
              </div>
            </div>
            <div className="show-row">
              <div className="show-copy">
                <Reveal className="eyebrow rv up" as="span">
                  तुरंत मदद
                </Reveal>
                <Reveal className="serif rv up d1" as="h3">
                  आम सवालों के जवाब <em>ग्राहक खुद पाएँ।</em>
                </Reveal>
                <Reveal className="rv up d2" as="p">
                  एक टैप पर ग्राहक ऑर्डर की स्थिति, ऑर्डर का विवरण, भुगतान, रिफ़ंड, रिटर्न, संपर्क जानकारी में बदलाव और कैंसलेशन के विकल्प पा लेते हैं। इससे आसान सवाल आपकी टिकट कतार तक आते ही नहीं।
                </Reveal>
              </div>
              <div className="shot rv">
                <img src={images.instantHelp} alt="Chili Labs का तुरंत मदद पैनल, जिसमें ऑर्डर की स्थिति, विवरण, भुगतान, रिफ़ंड, रिटर्न, संपर्क बदलने और ऑर्डर कैंसल करने के विकल्प हैं" />
              </div>
            </div>
            <div className="show-row flip">
              <div className="show-copy">
                <Reveal className="eyebrow rv up" as="span">
                  AI से तैयार जवाब
                </Reveal>
                <Reveal className="serif rv up d1" as="h3">
                  समय बचाएँ, <em>AI से जवाब तैयार कराएँ।</em>
                </Reveal>
                <Reveal className="rv up d2" as="p">
                  आपके स्टोर की पॉलिसी पर प्रशिक्षित AI असली ऑर्डर से पहला ड्राफ़्ट लिखता है। आपका एजेंट उसे जाँचता है, ज़रूरत हो तो बदलता है और भेज देता है।
                </Reveal>
                <Reveal className="rv up d3" as="div">
                  <ul>
                    <Bullet>एक क्लिक में भेजें, बदलें, दोबारा बनाएँ या हटाएँ</Bullet>
                    <Bullet>लंबी बातचीत का AI से सारांश</Bullet>
                  </ul>
                </Reveal>
                <Reveal className="plan-tag rv up d4" as="span">
                  Growth और Pro प्लान में
                </Reveal>
              </div>
              <div className="shot rv">
                <img src={images.aiDraft} alt="Chili Labs का टिकट, जिसमें AI से बना जवाब का ड्राफ़्ट भेजने के लिए तैयार है" />
              </div>
            </div>
            <div className="show-row">
              <div className="show-copy">
                <Reveal className="eyebrow rv up" as="span">
                  सपोर्ट पेज
                </Reveal>
                <Reveal className="serif rv up d1" as="h3">
                  आपके स्टोर के लिए एक <em>प्रीमियम</em> सपोर्ट पेज।
                </Reveal>
                <Reveal className="rv up d2" as="p">
                  साधारण संपर्क फ़ॉर्म की जगह अपने कस्टम डोमेन पर साफ़-सुथरा, ब्रांडेड सपोर्ट पेज दें। ग्राहक ऑर्डर नंबर डालें और मदद पाना शुरू करें।
                </Reveal>
              </div>
              <div className="shot rv">
                <img src={images.supportPage} alt="Chili Labs का ब्रांडेड सपोर्ट पेज, जो ऑर्डर नंबर और ईमेल या फ़ोन माँगता है" />
              </div>
            </div>
          </Swipe>
          <Reveal className="feat-cloud rv up">
            <h3>साथ ही App Store लिस्टिंग के बाकी सभी फ़ीचर्स</h3>
            <p>हर Chili Labs वर्कस्पेस में मौजूद।</p>
            <div className="tags">
              {featureTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Reveal>
          <div className="cta-block rv up">
            <BookButton>मेरी सेटअप कॉल बुक करें</BookButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Control() {
  return (
    <section className="sec" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="eyebrow rv up" as="span">
            कंट्रोल आपके हाथ में
          </Reveal>
          <Reveal className="rv blur" as="h2">
            आप तय करें <em>AI कहाँ रुकेगा।</em>
          </Reveal>
          <Reveal className="rv up d1" as="p">
            आम सवालों के जवाब आपके स्टोर के ताज़ा डेटा से तैयार होते हैं। जोखिम भरे, पेचीदा या भावनाओं से जुड़े मामले किसी व्यक्ति तक पहुँचते हैं।
          </Reveal>
        </div>
        <div className="line-grid">
          <Reveal className="lane ai rv left">
            <h3>
              AI ड्राफ़्ट बनाए <span className="lane-tag">आम, दोहराए जाने वाले काम</span>
            </h3>
            <p className="sub">जवाब आपके ऑर्डर, ट्रैकिंग, प्रोडक्ट और पॉलिसी से मिलते हैं। अंदाज़े से कभी नहीं।</p>
            <ul>
              <li><span className="dot">✓</span>मेरा ऑर्डर कहाँ है? ट्रैकिंग और डिलीवरी की तारीखें</li>
              <li><span className="dot">✓</span>शिपिंग से जुड़े सवाल और डिलीवरी का समय</li>
              <li><span className="dot">✓</span>आपकी पॉलिसी के अनुसार रिटर्न और एक्सचेंज के चरण</li>
              <li><span className="dot">✓</span>आपके कैटलॉग से प्रोडक्ट और आम सवालों के जवाब</li>
            </ul>
          </Reveal>
          <Reveal className="lane hu rv right d1">
            <h3>
              आपकी टीम फैसला करे <span className="lane-tag">जहाँ समझ-बूझ से फैसला चाहिए</span>
            </h3>
            <p className="sub">प्राथमिकता के संकेत और SLA टाइमर के साथ सही व्यक्ति तक भेजा जाता है।</p>
            <ul>
              <li><span className="dot">!</span>रिफ़ंड और ऑर्डर में बदलाव</li>
              <li><span className="dot">!</span>डिलीवरी की समस्याएँ और खराब मिले प्रोडक्ट</li>
              <li><span className="dot">!</span>नाराज़ या परेशान ग्राहक</li>
              <li><span className="dot">!</span>जिस जवाब को लेकर AI निश्चित न हो</li>
            </ul>
          </Reveal>
        </div>
        <Reveal className="handoff rv up d2">
          <span className="hi">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
          <div>
            <b>ग्राहक को अपनी बात दोहरानी नहीं पड़ती।</b>
            <p>हर बार टिकट सौंपते समय ऑर्डर, बातचीत और ग्राहक का पिछला विवरण साथ जाता है।</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Compare() {
  const options = [
    {
      title: "एक और एजेंट रखें",
      who: "सबसे पहले यही सूझता है",
      win: false,
      items: [
        [false, "जानकारी ढूँढ़कर देने वाले सवालों के लिए एक और वेतन"],
        [false, "सीज़न के लिए रखे कर्मचारी रिटर्न पॉलिसी सीखने से पहले ही चले जाते हैं"],
        [false, "अगली सेल या अचानक बढ़े ऑर्डर में फिर वही दबाव"],
        [true, "समझ-बूझ वाले फैसले अच्छे से सँभालता है"],
      ],
    },
    {
      title: "Chili Labs",
      tag: "Shopify के लिए बनाया गया",
      who: "AI ड्राफ़्ट बनाए, आपकी टीम फैसला करे",
      win: true,
      items: [
        [true, "जवाब देने से पहले असली ऑर्डर पढ़ता है"],
        [true, "एक इनबॉक्स, SLA अलर्ट, सही व्यक्ति तक टिकट"],
        [true, "मुश्किल टिकट पूरी जानकारी के साथ टीम को सौंपता है"],
        [true, "$29 प्रति माह से शुरू"],
      ],
    },
    {
      title: "सामान्य चैटबॉट",
      who: "फ़ौरन काम चलाने का तरीका",
      win: false,
      items: [
        [false, "ताज़ा ऑर्डर या ट्रैकिंग डेटा नहीं देख सकता"],
        [false, "डिलीवरी की समस्याओं पर पूरे भरोसे से अंदाज़ा लगाता है"],
        [false, "बस थोड़ा संवाद करने वाला सवाल-जवाब पेज, टीम तक पहुँचने का साफ़ रास्ता नहीं"],
        [true, "शुरू करने का खर्च कम"],
      ],
    },
  ] as const;

  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="eyebrow rv up" as="span">
            आपके विकल्प
          </Reveal>
          <Reveal className="rv blur" as="h2">
            भरे हुए इनबॉक्स को सँभालने के तीन रास्ते। <em>बढ़ते काम के साथ सिर्फ़ एक टिकता है।</em>
          </Reveal>
          <Reveal className="rv up d1" as="p">
            पहले दो तो शायद आप आज़मा भी चुके हैं।
          </Reveal>
        </div>
        <Swipe className="cmp swipe" label="तीन विकल्प, तुलना के लिए स्वाइप करें">
          {options.map((option, index) => (
            <Reveal key={option.title} className={`cmp-card rv up${option.win ? " win" : ""}${index ? ` d${index}` : ""}`}>
              <h3>
                {option.title}
                {"tag" in option ? <span className="win-tag">{option.tag}</span> : null}
              </h3>
              <p className="who">{option.who}</p>
              <ul>
                {option.items.map(([yes, text]) => (
                  <li key={text}>
                    <span className={`m ${yes ? "yes" : "no"}`}>{yes ? "✓" : "✕"}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </Swipe>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="eyebrow rv up" as="span">
            प्लान और कीमतें
          </Reveal>
          <Reveal className="rv blur" as="h2">
            एक और कर्मचारी रखने से <em>कहीं कम खर्च।</em>
          </Reveal>
          <Reveal className="rv up d1" as="p">
            आपके मासिक टिकट बढ़ें तो प्लान भी उसी हिसाब से चुनें। हर प्लान में शुरुआत के 15 दिन मुफ़्त ट्रायल मिलता है। बिलिंग Shopify के ज़रिए USD में होती है।
          </Reveal>
        </div>
        <Swipe className="prices swipe" label="प्लान, तुलना के लिए स्वाइप करें">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} className={`price rv up${plan.recommended ? " rec" : ""}${index ? ` d${index}` : ""}`}>
              {plan.tag ? <span className="rec-tag">{plan.tag}</span> : null}
              <h3>{plan.name}</h3>
              <div className="amt">
                {plan.price}
                <small> /माह</small>
              </div>
              <p>{plan.blurb}</p>
              <div className="inc">
                {plan.items.map((item) => (
                  <div key={item}>
                    <span className="m yes">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </Swipe>
        <div className="cta-block rv up">
          <BookButton>मेरी सेटअप कॉल बुक करें</BookButton>
          <p className="cta-note">ट्रायल खत्म होने से पहले अनइंस्टॉल करें, कोई भुगतान नहीं।</p>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="sec" style={{ paddingTop: 24 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal className="eyebrow rv up" as="span">
            आम सवाल
          </Reveal>
          <Reveal className="rv blur" as="h2">
            शुरू करने से पहले <em>आपके सवाल।</em>
          </Reveal>
        </div>
        <div className="faq">
          {faqs.map((item) => (
            <Reveal key={item.q} className="rv up" as="details">
              <summary>
                {item.q}
                <span className="pm">+</span>
              </summary>
              <div className="a">{item.a}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="sec" style={{ paddingTop: 24, paddingBottom: 56 }}>
      <div className="wrap">
        <Reveal className="final-card dark rv zoom">
          <h2>
            अपना स्टोर बढ़ाएँ, <em>सपोर्ट की उलझनें नहीं।</em>
          </h2>
          <p>अगला “मेरा ऑर्डर कहाँ है?” मैसेज आने ही वाला है। उसका जवाब Chili Labs को तैयार करने दें।</p>
          <div className="cta-block">
            <BookButton>मेरी सेटअप कॉल बुक करें</BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="brand">
        <img src={images.logo} alt="" width={26} height={26} />
        <span>Chili Labs</span>
      </div>
      <p>Shopify व्यापारियों के लिए AI ग्राहक सपोर्ट।</p>
      <p style={{ marginTop: 4 }}>© 2026 Chili Labs. सर्वाधिकार सुरक्षित।</p>
    </footer>
  );
}
