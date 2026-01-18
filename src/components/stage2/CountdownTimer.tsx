import React, { useEffect, useState } from "react";

type Time = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function CountdownTimer({ deadline }: { deadline: string | number }) {
  const calculateTimeDiff = () => {
    const now = new Date().getTime();
    const end = new Date(deadline).getTime();
    const diff = end - now;

    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((absDiff / 1000) % 60);

    return { diff, time: { days, hours, minutes, seconds } };
  };

  const [timeData, setTimeData] = useState(calculateTimeDiff());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(calculateTimeDiff());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const { diff, time } = timeData;

  if (diff <= 0) {
    return (
      <p className="font-sans font-bold text-lg text-center text-red-700">
        ⚠️ Overdue by{" "}
        <span className="font-medium text-red-900">
          {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
        </span>
      </p>
    );
  }

  return (
    <p className="font-sans font-bold text-lg text-center text-slate-700">
      ⏳ Time Left:{" "}
      <span className="font-medium text-black">
        {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
      </span>
    </p>
  );
}
