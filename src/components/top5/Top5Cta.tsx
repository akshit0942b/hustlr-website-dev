import React from "react";
import MixedHeadline from "../MixedHeadline";
import { motion } from "framer-motion";

const Top5Cta = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8"
        >
          <MixedHeadline text="Ready to Hire or Hustle?" />
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8 sm:mb-12"
        >
          <p className="text-lg sm:text-xl text-white/80">
            <MixedHeadline text="For clients: Hire Gen Z's top 5% — fast, verified, and guaranteed." />
          </p>
          <p className="text-lg sm:text-xl text-white/80">
            <MixedHeadline text="For students: Earn, grow, and build your future. No noise. No scams. Just real work." />
          </p>
        </motion.div>
        <motion.a
          href="/get-started"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-black font-semibold text-base sm:text-lg shadow-lg hover:scale-105 hover:bg-black hover:text-white border border-white transition-all duration-300"
        >
          Get Started with Hustlr
        </motion.a>
      </div>
    </section>
  );
};

export default Top5Cta;
