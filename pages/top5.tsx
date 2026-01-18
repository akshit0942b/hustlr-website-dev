import { useEffect, useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Nav from "@/src/components/Nav";
import MixedHeadline from "@/src/components/MixedHeadline";
import Top5Hero from "@/src/components/top5/Top5Hero";
import Top5Cta from "@/src/components/top5/Top5Cta";
import VettingProcess from "@/src/components/top5/VettingProcess";
import Vision from "@/src/components/top5/Vision";

export default function Top5() {
  return (
    <>
      <Head>
        <title>Top 5% - Hustlr</title>
      </Head>

      <main className="min-h-screen  bg-[#111] text-white">
        {/* HEADER BAR */}
        <Nav />

        {/* Hero Section */}
        <Top5Hero />

        {/* Vetting Process Section */}
        <VettingProcess />

        {/* Vision Section */}
        <Vision />

        {/* CTA Section */}
        <Top5Cta />
      </main>
    </>
  );
}
