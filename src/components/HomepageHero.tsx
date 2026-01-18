import React, { useEffect, useState } from "react";
// import MixedHeadline from "./MixedHeadline";
import { useSplitTypewriter } from "./TypeWriter";

const HomepageHero = () => {
  const heroHeadline = "Hire The Top 5% of India's Student Talent";
  const breakAfter = heroHeadline.indexOf("5%") + "5%".length;
  const heroSubtitle =
    "Hustlr is the fastest, easiest way to hire pre-vetted Gen Z students for design, content, tech, and research gigs — in hours, not weeks. Swipe right, get matched.";

  const [typedBefore, typedAfter] = useSplitTypewriter(
    heroHeadline,
    breakAfter,
    90
  );

  const isTyping = typedBefore.length + typedAfter.length < heroHeadline.length;

  return (
    <section className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Left side content */}
      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left max-w-2xl">
        <h1
          className=" font-serif text-3xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight font-normal"
          style={{
            fontFamily: "'The Seasons', serif",
            color: "#fff",
            textShadow: "0 2px 32px #fff2, 0 0px 0px #fff",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          {/* Remove MixedHeadline usage, just show the text */}
          {typedBefore}
          {typedBefore.length === breakAfter && <br />}
          {typedAfter}
          {isTyping && (
            <span className="inline-block w-2 h-7 align-middle bg-white ml-1 animate-pulse" />
          )}
        </h1>
        <p
          className="font-body text-base sm:text-lg md:text-xl text-white/90 mt-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {heroSubtitle}
        </p>
        <div className="flex flex-col items-center sm:items-start mt-8">
          <a
            href="/get-started"
            className="px-6 sm:px-8 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:scale-105 hover:bg-[#111] hover:text-white border border-white transition-all duration-300"
          >
            Hire Now
          </a>
          <p
            className="text-sm sm:text-base md:text-xl text-white/60 mt-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            3000+ students on the waitlist
          </p>
        </div>
      </div>

      {/* Right side 3D images */}
      <div className="relative w-[45%] h-[80vh] hidden lg:block">
        <div className="absolute top-[10%] right-[10%] w-[240px] h-[480px] transform perspective-1000 animate-fadeInTop">
          <img
            src="/images/client.png"
            alt="Client UI"
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
            style={{
              transform: "rotateY(-20deg) rotateX(5deg) translateZ(100px)",
              transformStyle: "preserve-3d",
              transition: "transform 0.3s ease-out",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
            onError={(e) => {
              console.error("Error loading client image:", e);
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="absolute top-[25%] right-[65%] w-[240px] h-[480px] transform perspective-1000 animate-fadeInBottom">
          <img
            src="/images/freelancer.png"
            alt="Freelancer UI"
            className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
            style={{
              transform: "rotateY(20deg) rotateX(5deg) translateZ(100px)",
              transformStyle: "preserve-3d",
              transition: "transform 0.3s ease-out",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
            onError={(e) => {
              console.error("Error loading freelancer image:", e);
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;
