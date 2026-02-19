import { ThemeProvider } from "@/components/theme-provider";
import { AppProps } from "next/app";
import "@/styles/globals.css"; // Ensure global styles are imported
import { Toaster } from "sonner";
import { ovo, theSeasons } from "@/src/fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <div className={`${ovo.variable} ${theSeasons.variable}`}>
      <Toaster richColors closeButton />
      <Component {...pageProps} />
    </div>
    // </ThemeProvider>
  );
}
