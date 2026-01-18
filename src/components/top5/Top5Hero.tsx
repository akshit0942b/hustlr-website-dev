import React from "react";
import { motion } from "framer-motion";
import MixedHeadline from "../MixedHeadline";
import Counter from "../Counter";

const Top5Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6"
          //
        >
          Only the Top <Counter end={5} />
          <span>%</span> Make It In
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8"
        >
          <MixedHeadline text="Because clients deserve excellence — and students deserve to rise to it." />
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4"
        >
          <MixedHeadline text="At Hustlr, we believe freelancing isn't just about doing work — it's about doing it with grit, creativity, and ownership. That's why only the top 5% of applicants ever make it onto the platform." />
        </motion.p>
      </div>
    </section>
  );
};

export default Top5Hero;
