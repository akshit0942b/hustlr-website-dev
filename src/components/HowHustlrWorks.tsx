import React, { useState } from "react";

const HowHustlrWorks = () => {
  const clientSteps = [
    "Join and get verified — Upload ID and business documents for a trusted ecosystem.",
    "Post your gig — Set your scope, timeline, and budget.",
    "Swipe and shortlist — Discover top 5% student talent instantly.",
    "Chat and hire — Connect, brief, and fund via escrow.",
    "Approve and pay — Release payment after delivery, with replacement guarantee.",
    "Trust built-in every step of the way. Verified clients only. Quality guaranteed or we replace.",
  ];

  const studentSteps = [
    "Apply to Hustlr — Share resume and personal details.",
    "Get shortlisted — Skill test, portfolio check, and test project.",
    "Clear AI interview — Prove you're top 5% material.",
    "Swipe to find gigs — Discover paid, real-world projects.",
    "Deliver and earn — Submit, get rated, and paid via escrow.",
    "Top 5% only: Real gigs, verified clients, fast payments",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [tab, setTab] = useState("clients");
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 mt-32">
      <h2 className=" font-serif text-2xl sm:text-4xl font-normal mb-16 text-white">
        How Hustlr Works
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-16 gap-16">
        <button
          className={`px-8 py-2 rounded-t-lg font-semibold transition-all duration-300 text-lg sm:text-1xl ${
            tab === "clients"
              ? "bg-white text-black shadow"
              : "bg-transparent text-white border-b-2 border-transparent hover:border-white"
          }`}
          onClick={() => {
            setTab("clients");
            setActiveStep(0);
          }}
        >
          For Clients
        </button>
        <button
          className={`px-8 py-2 rounded-t-lg font-semibold transition-all duration-300 text-lg sm:text-1xl ${
            tab === "students"
              ? "bg-white text-black shadow"
              : "bg-transparent text-white border-b-2 border-transparent hover:border-white"
          }`}
          onClick={() => {
            setTab("students");
            setActiveStep(0);
          }}
        >
          For Students
        </button>
      </div>

      {/* Timeline */}
      <div className="w-full max-w-6xl mx-auto">
        {/* Timeline dots and lines */}
        <div className="flex flex-wrap justify-center items-center mb-8 sm:mb-16 px-4 gap-2 sm:gap-0">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setActiveStep(index)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-base sm:text-lg transition-all duration-300 ${
                  index <= activeStep
                    ? "bg-white text-black"
                    : "bg-white/20 text-white/50"
                }`}
              >
                {index + 1}
              </button>
              {index < 4 && (
                <div
                  className={`h-1 w-16 sm:w-32 transition-all duration-300 ${
                    index < activeStep ? "bg-white" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="relative h-48 sm:h-64">
          {(tab === "clients" ? clientSteps : studentSteps).map(
            (step, index) => {
              if (index === 5) return null; // Skip trust message for now

              return (
                <div
                  key={step}
                  className={`absolute w-full transition-all duration-500 ${
                    index === activeStep
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col items-center px-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-normal mb-2 sm:mb-4 text-center">
                      {step.split(" — ")[0]}
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl text-center">
                      {step.split(" — ")[1]}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Trust message */}
        <div
          className="font-ovo mt-4 sm:mt-8 text-base sm:text-lg md:text-2xl text-white/90 text-center px-4"
          style={{ fontFamily: "'Ovo', serif" }}
        >
          {tab === "clients" ? clientSteps[5] : studentSteps[5]}
        </div>
      </div>
    </section>
  );
};

export default HowHustlrWorks;
