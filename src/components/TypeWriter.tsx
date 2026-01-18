import { useEffect, useState } from "react";

export type UseSplitTypewriterResult = [string, string];

export interface UseSplitTypewriter {
  (
    fullText: string,
    breakAfter: number,
    speed?: number
  ): UseSplitTypewriterResult;
}

export function useSplitTypewriter(
  fullText: string,
  breakAfter: number,
  speed: number = 90
): UseSplitTypewriterResult {
  const [typed, setTyped] = useState<UseSplitTypewriterResult>(["", ""]);
  useEffect(() => {
    setTyped(["", ""]);
    let i = 0;
    let j = 0;
    let part = 0;
    const before = fullText.slice(0, breakAfter);
    const after = fullText.slice(breakAfter);
    const interval = setInterval(() => {
      if (part === 0) {
        setTyped(() => [before.slice(0, i + 1), ""]);
        i++;
        if (i === before.length) part = 1;
      } else if (part === 1) {
        setTyped((prev) => [prev[0], after.slice(0, j + 1)]);
        j++;
        if (j === after.length) clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [fullText, breakAfter, speed]);
  return typed;
}
