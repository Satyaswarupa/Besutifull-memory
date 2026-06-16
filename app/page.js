import Link from "next/link";

const STEPS = [
  {
    icon: "💍",
    title: "Pick Your Special Date",
    text: "Choose your anniversary, your marriage date, or a little one's birthday — whatever date you want to count down to.",
  },
  {
    icon: "⏳",
    title: "Watch the Countdown",
    text: "Your profile shows a live countdown to that day, so the moment that matters never sneaks up on you.",
  },
  {
    icon: "📸",
    title: "Collect Your Moments",
    text: "Add photos with a title and description to build a beautiful gallery of memories you can revisit anytime.",
  },
  {
    icon: "💌",
    title: "Relive Every Memory",
    text: "Tap any photo to open it full-screen with its story, date and time, and scroll through your whole timeline.",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase text-rose/80 mb-3">
          Welcome to Memories
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
          Keep your love story,{" "}
          <span className="gradient-text">one memory at a time</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/60">
          Save the date that means the most — your anniversary, your wedding
          day, or your child&apos;s birthday — and build a living photo album of
          the moments along the way.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="btn-primary text-center">
            Create your space 💕
          </Link>
          <Link href="/login" className="btn-secondary text-center">
            I already have an account
          </Link>
        </div>
      </section>

      {/* Step cards */}
      <section className="mt-16 grid sm:grid-cols-2 gap-5">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 animate-pop-in bg-white/10 border border-white/15 backdrop-blur-xl"
          >
            <div className="text-3xl mb-3">{step.icon}</div>
            <h3 className="font-bold text-base text-white mb-1">{step.title}</h3>
            <p className="text-sm text-white/55 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-8 rounded-2xl p-6 sm:p-8 text-center bg-white/10 border border-white/15 backdrop-blur-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
          How it works <span className="animate-heartbeat inline-block">❤️</span>
        </h2>
        <p className="text-sm sm:text-base text-white/55 max-w-xl mx-auto leading-relaxed">
          Sign up with a profile photo and your name, then pick the date you
          care about most — an anniversary, your marriage date, or your
          child&apos;s birthday. From there, add a short bio, watch your countdown
          tick down, and drop in photos with titles and descriptions to build
          your personal Pinterest-style memory wall.
        </p>
      </section>

    </div>
  );
}
