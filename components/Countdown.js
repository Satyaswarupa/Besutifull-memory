"use client";

import { useEffect, useState } from "react";

function getTimeParts(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = now.getTime() - target.getTime();

  if (diff < 0) {
    // Future date — count down to it
    const abs = Math.abs(diff);
    return {
      days: Math.floor(abs / (1000 * 60 * 60 * 24)),
      hours: Math.floor((abs / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((abs / (1000 * 60)) % 60),
      seconds: Math.floor((abs / 1000) % 60),
      future: true,
    };
  }

  // Past date — count up (elapsed time)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    future: false,
  };
}

export default function Countdown({ targetDate, label }) {
  const [time, setTime] = useState(() => getTimeParts(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeParts(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!time) return null;

  const units = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Min" },
    { value: time.seconds, label: "Sec" },
  ];

  return (
    <div className="text-center">
      <p className="text-base text-rose/90 mb-2" style={{ fontFamily: "var(--font-dancing)" }}>
        {time.future ? `Countdown to ${label}` : `Since ${label}`} 💗
      </p>
      <div className="flex items-center justify-center gap-1">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="bg-white/10 backdrop-blur border border-white/20 rounded-md px-1.5 py-1 min-w-[34px]"
          >
            <div className="text-sm font-extrabold gradient-text">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[8px] uppercase tracking-wide text-white/45">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
