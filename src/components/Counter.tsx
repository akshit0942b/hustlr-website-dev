import { useEffect, useState } from "react";

export default function Counter({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const currentCount = Math.round(progress * end);
      setCount(currentCount);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [end, duration]);

  return (
    <span>
      {/* {count === 4 ? (
        <span className="font-ovo" style={{ fontFamily: "'Ovo', serif" }}>
          4
        </span>
      ) : (
        count
      )} */}
      {count}
    </span>
  );
}
