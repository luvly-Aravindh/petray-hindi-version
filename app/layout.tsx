import type { Metadata } from "next";
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sans = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chili Labs | Shopify के अंदर AI कस्टमर सपोर्ट",
  description:
    "Chili Labs आपके Shopify ऑर्डर की असली जानकारी से आपके ब्रांड के अंदाज़ में जवाब तैयार करता है। रिफ़ंड, जटिल मामलों और नाराज़ ग्राहकों की ज़िम्मेदारी आपकी टीम को मिलती है। मुफ़्त ट्रायल शुरू करें।",
};

const pixel = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2096489001744442');
fbq('track', 'PageView');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {children}
        <Script id="meta-pixel" strategy="afterInteractive">
          {pixel}
        </Script>
      </body>
    </html>
  );
}
