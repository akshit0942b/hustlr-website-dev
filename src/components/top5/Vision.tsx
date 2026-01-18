import React from "react";
import MixedHeadline from "../MixedHeadline";
import { motion } from "framer-motion";

const Vision = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8"
        >
          <MixedHeadline text="Hustlr's Vision" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8"
        >
          <MixedHeadline text="To redefine the standard for hiring top college talent — with speed, trust, and zero compromises." />
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg text-white/60"
        >
          <MixedHeadline text="We're building the first platform that truly cares for both students and clients. Because when we protect the hustle — everyone wins." />
        </motion.p>
      </div>
    </section>
  );
};

export default Vision;
