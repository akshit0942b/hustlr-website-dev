import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Nav from "@/src/components/Nav";
import HomepageHero from "@/src/components/HomepageHero";
import CtaSection from "@/src/components/CtaSection";
import WhatHustlrOffers from "@/src/components/WhatHustlrOffers";
import HowHustlrWorks from "@/src/components/HowHustlrWorks";
import VisionSection from "@/src/components/VisionSection";

export default function Home() {
  // Scroll logic
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Hustlr</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="relative bg-[#111] text-foreground min-h-[200vh] w-full font-body overflow-x-hidden">
        {/* HEADER BAR */}
        <Nav />
        {/* HERO SECTION CONTAINER */}
        <HomepageHero />
        {/* WHAT HUSTLR OFFERS (Appears after parallax) */}
        <WhatHustlrOffers scrollY={scrollY} />
        {/* HOW HUSTLR WORKS section */}
        <HowHustlrWorks />
        {/* VISION STATEMENT section */}
        <VisionSection />
        {/* Final CTA Section */}
        <CtaSection />
      </main>
    </>
  );
}
