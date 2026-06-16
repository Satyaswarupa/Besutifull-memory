"use client";

export const BG_ANIMATIONS = [
  { id: "hearts",    label: "Hearts",    emoji: "💗", bg: "#3b1040" },
  { id: "stars",     label: "Stars",     emoji: "✨", bg: "#0d1628" },
  { id: "bubbles",   label: "Bubbles",   emoji: "🫧", bg: "#071828" },
  { id: "fireflies", label: "Fireflies", emoji: "🌟", bg: "#081408" },
];

export default function BackgroundPicker({ value, onChange, className = "" }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-2">
        {BG_ANIMATIONS.map((anim) => {
          const active = value === anim.id;
          return (
            <button
              type="button"
              key={anim.id}
              onClick={() => onChange(anim.id)}
              className={`rounded-xl py-3 px-1 flex flex-col items-center gap-1.5 border transition-all ${
                active
                  ? "border-rose shadow-lg shadow-rose/20 scale-105"
                  : "border-white/15 hover:border-rose/40"
              }`}
              style={{ background: anim.bg }}
            >
              <span className="text-xl leading-none">{anim.emoji}</span>
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                {anim.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
