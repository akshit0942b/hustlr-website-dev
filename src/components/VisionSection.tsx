import React from "react";

const VisionSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 py-32">
      <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-24 text-white">
        Hustlr<span style={{ fontFamily: "'Poppins', sans-serif" }}>'</span>s
        Promise
      </h2>
      <div
        className="max-w-4xl mx-auto bg-[#1a1a1a] rounded-3xl p-12 sm:p-16 shadow-2xl"
        style={{
          boxShadow:
            "0 0 50px rgba(255,255,255,0.1), 0 0 100px rgba(255,255,255,0.05), inset 0 0 20px rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3
          className="text-2xl sm:text-4xl md:text-3xl font-normal mb-8 text-white"
          style={{
            fontFamily: "'The Seasons', serif",
            lineHeight: "1.6",
          }}
        >
          To redefine the standard for hiring top college talent — with speed,
          trust, and zero compromises
        </h3>

        <p
          className="text-xl sm:text-1xl text-white/80 mb-6 leading-relaxed"
          style={{ fontFamily: "'Ovo', serif", lineHeight: "1.6" }}
        >
          At Hustlr, we're building the first freelance platform that truly
          cares for both sides — where trust isn't a feature, it's a commitment.
        </p>

        <div className="space-y-4">
          <p className="text-2xl sm:text-2xl text-white font-normal">
            This is the new future of freelancing.
            <br />
            <span className="mt-4 block">
              Powered by Gen Z. Protected by Hustlr.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
