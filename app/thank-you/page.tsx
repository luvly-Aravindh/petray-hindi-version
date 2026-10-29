import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYou } from "./thank-you";

export const metadata: Metadata = {
  title: "धन्यवाद | Chili Labs",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYou />
    </Suspense>
  );
}
