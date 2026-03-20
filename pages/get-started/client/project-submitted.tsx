import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Loader } from "lucide-react";
import Nav from "@/src/components/Nav";

const REDIRECT_DELAY_MS = 2500;

export default function ClientProjectSubmittedPage() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void router.push("/admin");
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Project Submitted - Hustlr</title>
      </Head>

      <Nav />

      <main className="min-h-screen bg-[#f4f4f4] pt-16 md:pt-20">
        <section className="mx-auto flex min-h-[72vh] w-full max-w-[1200px] flex-col items-center justify-center px-6 text-center">
          <div className="flex items-center gap-3">
            <h1
              className="text-4xl tracking-tight text-black/90 sm:text-5xl"
              style={{
                fontFamily: 'var(--font-the-seasons), "FONTSPRING DEMO - The Seasons", serif',
                fontWeight: 700,
                fontStyle: "normal",
              }}
            >
              Project Submitted
            </h1>
            <img
              src="/images/celebration.png"
              alt="Celebration"
              className="h-12 w-12 object-contain mix-blend-multiply sm:h-14 sm:w-14"
            />
          </div>

          <div className="mt-10 flex flex-col items-center gap-2">
            <Loader className="h-12 w-12 animate-spin text-black/70" />
            <p className="text-[11px] font-semibold tracking-wide text-black/60">LOADING...</p>
          </div>

          <p className="mt-9 text-[1.35rem] font-semibold leading-tight text-black/80 sm:text-[1.55rem]">
            Redirecting you to your dashboard to start finding students..
          </p>
        </section>
      </main>
    </>
  );
}
