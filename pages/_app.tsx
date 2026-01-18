import { ThemeProvider } from "@/components/theme-provider";
import { AppProps } from "next/app";
import "@/styles/globals.css"; // Ensure global styles are imported
import { Toaster } from "sonner";
export default function App({ Component, pageProps }: AppProps) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <>
      <Toaster richColors closeButton />
      <Component {...pageProps} />
    </>
    // </ThemeProvider>
  );
}
