import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Nav from "@/src/components/Nav";
import MixedHeadline from "@/src/components/MixedHeadline";
import Link from "next/link";

export default function GetStarted() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get user type from URL query parameter using Next.js router
    const type = router.query.type;
    if (type === "student" || type === "client") {
      setUserType(type);
    }
  }, [router.query.type]);

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Get Started - Hustlr</title>
      </Head>

      <main className="min-h-screen  bg-[#111] text-white">
        {/* HEADER BAR */}
        <Nav />

        {/* Hero section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6"
            >
              <MixedHeadline text="Get Early Access to Hustlr" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8"
            >
              <MixedHeadline text="The fastest, smartest way to hire or earn — coming soon." />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base sm:text-lg text-white/60 mb-8 sm:mb-12 px-4"
            >
              <MixedHeadline text="Over 3,000 people have already signed up. Join the waitlist to get first access to India's top 5% of student freelancers — before everyone else." />
            </motion.p>

            {/* Email Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="flex justify-center gap-4 mt-4">
                <Link
                  href={"/get-started/student/login"}
                  type="button"
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    userType === "student"
                      ? "bg-white text-black"
                      : "bg-transparent text-white border border-white/30"
                  }`}
                >
                  <MixedHeadline text="I'm a Student" />
                </Link>
                <Link
                  href={"/get-started/client/verify"}
                  type="button"
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    userType === "client"
                      ? "bg-white text-black"
                      : "bg-transparent text-white border border-white/30"
                  }`}
                >
                  <MixedHeadline text="I'm a Client" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
