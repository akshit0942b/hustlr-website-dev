import React from "react";
import MixedHeadline from "../MixedHeadline";
import { motion } from "framer-motion";

const stagesArr = [
  {
    number: 1,
    title: "Language, Personality & Profile Review",
    description: "We screen for clarity, credibility, and character.",
    items: [
      "College & CGPA",
      "Work experience",
      "Technical skills",
      "Communication style",
      "Overall professionalism",
    ],
  },
  {
    number: 2,
    title: "Portfolio & Skill Assessment",
    description:
      "Past work speaks volumes. Students submit a project demo, plus complete a skill-specific challenge. We assess:",
    items: [
      "Problem-solving approach",
      "Depth of understanding",
      "Craftsmanship & design rationale",
    ],
  },
  {
    number: 3,
    title: "The Test Project (1-3 Weeks)",
    description:
      "Real work. Real pressure. Real results. We assign a hands-on, realistic task that tests:",
    items: [
      "Attention to detail",
      "Time & project management",
      "Execution quality under deadline",
    ],
  },
  {
    number: 4,
    title: "Conversational AI Live Screening",
    description:
      "Not just smart — sharp on the spot. An AI-driven live session tests:",
    items: [
      "Their test project knowledge",
      "Communication clarity",
      "Adaptability & creativity",
      "Deeper thinking and professionalism",
    ],
  },
  {
    number: 5,
    title: "Final Approval",
    description:
      "Only the top 5% who pass all previous stages are onboarded to Hustlr. And we don't stop there — regular quality audits ensure our standards stay sky-high.",
  },
];

function Stage({
  number,
  title,
  description,
  items,
  delay,
}: {
  number: number;
  title: string;
  description: string;
  items?: string[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className=" bg-[#111]/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
    >
      <div className="flex items-start gap-6">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">
          <MixedHeadline text={number.toString()} />
        </div>
        <div>
          <h3 className="text-2xl font-normal mb-4">
            <MixedHeadline text={title} />
          </h3>
          <p className="text-white/80 mb-6">
            <MixedHeadline text={description} />
          </p>
          {items && (
            <ul className="list-disc pl-6">
              {items.map((item, index) => (
                <li key={index} className="text-white/80">
                  <MixedHeadline text={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const VettingProcess = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-normal mb-8 sm:mb-16 text-center"
        >
          The 5<span style={{ fontFamily: "'Ovo', serif" }}>-</span>Stage
          Vetting Process
        </motion.h2>
        <p className="text-lg sm:text-xl text-white/80 text-center mb-8 sm:mb-16 max-w-3xl mx-auto px-4">
          <MixedHeadline text="Each student goes through a rigorous, multi-step screening inspired by the world's top talent networks — to ensure every project on Hustlr gets done right." />
        </p>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {stagesArr.map((stage, index) => (
            <Stage
              key={index}
              number={stage.number}
              title={stage.title}
              description={stage.description}
              items={stage.items}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VettingProcess;
