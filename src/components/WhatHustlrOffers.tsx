import React, { useState } from "react";

const clientBenefits = [
  "Top 5% Talent Only - We vet every student so you don't have to.",
  "Swipe to Hire - Simplified, quick hiring.",
  "Find Future Employees - Discover students you may want to recruit full-time.",
  "Replacement Guarantee - If it's not right, we fix it.",
];

const studentBenefits = [
  "Easy job discovery — Swipe, match, and start fast.",
  "Work with real clients — No fake gigs, ever.",
  "Gain real world experience — Build a strong portfolio.",
  "Get paid fast & fair — Escrow-protected payouts.",
];

function splitBenefit(benefit: string): { main: string; info: string } {
  const match = benefit.match(/(.+?)[\u2013\u2014-]+(.+)/);
  if (match) {
    return {
      main: match[1].trim(),
      info: match[2].trim(),
    };
  }
  return { main: benefit, info: "" };
}

const WhatHustlrOffers = ({ scrollY }: { scrollY: number }) => {
  const imgEndScroll = 800; // When images are gone
  // "What Hustlr Offers" section fades in after images are mostly gone
  const offersOpacity = Math.min(
    Math.max((scrollY - imgEndScroll + 200) / 200, 0),
    1
  );

  // Tabs
  const [tab, setTab] = useState("clients");
  const benefits = tab === "clients" ? clientBenefits : studentBenefits;

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4 transition-opacity duration-500"
      style={{
        opacity: offersOpacity,
        pointerEvents: offersOpacity < 0.1 ? "none" : "auto",
        marginTop: "20vh" /* Push this section down initially */,
      }}
    >
      <h2 className=" font-serif text-xl sm:text-2xl md:text-4xl font-normal mb-8 sm:mb-16 text-white">
        What Hustlr Offers
      </h2>
      {/* Tabs */}
      <div className="flex justify-center mb-8 gap-4 sm:gap-16">
        <button
          className={`px-4 sm:px-8 py-2 rounded-t-lg font-semibold transition-all duration-300 text-base sm:text-lg md:text-xl ${
            tab === "clients"
              ? "bg-white text-black shadow"
              : "bg-transparent text-white border-b-2 border-transparent hover:border-white"
          }`}
          onClick={() => setTab("clients")}
        >
          For Clients
        </button>
        <button
          className={`px-4 sm:px-8 py-2 rounded-t-lg font-semibold transition-all duration-300 text-base sm:text-lg md:text-xl ${
            tab === "students"
              ? "bg-white text-black shadow"
              : "bg-transparent text-white border-b-2 border-transparent hover:border-white"
          }`}
          onClick={() => setTab("students")}
        >
          For Students
        </button>
      </div>
      {/* Benefits */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
        {benefits.map((benefit, i) => {
          const { main, info } = splitBenefit(benefit);
          return (
            <div
              key={benefit}
              className="group relative flex flex-col items-center justify-center w-full aspect-square max-w-[280px] mx-auto  bg-[#111] text-white rounded-2xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-white/10"
              style={{
                opacity: offersOpacity,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-0"></div>
              <div className="flex flex-col items-center justify-center h-full w-full px-4 sm:px-6 text-center transition-all duration-300 z-10">
                <span
                  className="font-ovo text-lg sm:text-xl font-normal break-words transition-all duration-300 group-hover:text-black"
                  style={{ fontFamily: "'Ovo', serif" }}
                >
                  {main}
                </span>
                <span
                  className="opacity-0 group-hover:opacity-100 mt-3 sm:mt-4 text-base sm:text-lg font-ovo font-normal text-black transition-all duration-300 break-words"
                  style={{ fontFamily: "'Ovo', serif" }}
                >
                  {info}
                </span>
              </div>
              {/* Shadow/enlarge on hover */}
              <style jsx>{`
                .group:hover,
                .group:focus {
                  box-shadow:
                    0 8px 32px 0 rgba(0, 0, 0, 0.25),
                    0 1.5px 8px 0 #fff2;
                  transform: scale(1.05);
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhatHustlrOffers;
