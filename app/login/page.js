"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/gallery");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="glass-card rounded-3xl p-6 sm:p-8 animate-pop-in">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1">
          Welcome <span className="gradient-text">back</span>
        </h1>
        <p className="text-center text-sm text-foreground/60 mb-6">
          Pick up right where your love story left off.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In 💖"}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-5">
          New here?{" "}
          <Link href="/signup" className="text-rose-deep font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
