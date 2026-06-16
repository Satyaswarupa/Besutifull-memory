"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MEMORY_TYPES = [
  { value: "anniversary", label: "Anniversary 💞", placeholder: "Our Anniversary" },
  { value: "marriage", label: "Marriage Date 💍", placeholder: "Our Wedding Day" },
  { value: "birthday", label: "Child's Birthday 🎂", placeholder: "Emma's Birthday" },
  { value: "custom", label: "Custom Date ✨", placeholder: "Something Special" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    memoryType: "anniversary",
    memoryLabel: "",
    memoryDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.memoryDate) {
      setError("Please pick a date to count down to.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("memoryType", form.memoryType);
      data.append(
        "memoryLabel",
        form.memoryLabel ||
          MEMORY_TYPES.find((m) => m.value === form.memoryType)?.placeholder ||
          "Our Special Day"
      );
      data.append("memoryDate", form.memoryDate);
      if (imageFile) data.append("profileImage", imageFile);

      const res = await fetch("/api/auth/signup", { method: "POST", body: data });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const activeType = MEMORY_TYPES.find((m) => m.value === form.memoryType);

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-16">
      <div className="glass-card rounded-3xl p-6 sm:p-8 animate-pop-in">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1">
          Create your <span className="gradient-text">Memories</span> space
        </h1>
        <p className="text-center text-sm text-foreground/60 mb-6">
          A little space to count down to the day you love most.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <label htmlFor="profileImage" className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blush flex items-center justify-center text-3xl group-hover:opacity-80 transition">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>📷</span>
                )}
              </div>
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-xs text-foreground/50">Tap to add a profile photo</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              required
              className="input-field"
              placeholder="Jordan"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              type="password"
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </div>

          <div className="pt-2 border-t border-rose/20">
            <p className="text-sm font-semibold mb-2 mt-3">What date do you want to remember? 💗</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {MEMORY_TYPES.map((type) => (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => update("memoryType", type.value)}
                  className={`text-sm rounded-xl py-2 px-2 border transition ${
                    form.memoryType === type.value
                      ? "bg-rose text-white border-rose shadow"
                      : "bg-white/70 border-rose/20 text-foreground/70 hover:border-rose/50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Label (optional)</label>
              <input
                className="input-field"
                placeholder={activeType?.placeholder}
                value={form.memoryLabel}
                onChange={(e) => update("memoryLabel", e.target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                required
                type="date"
                className="input-field"
                value={form.memoryDate}
                onChange={(e) => update("memoryDate", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating your space..." : "Sign Up 💕"}
          </button>
        </form>

        <p className="text-center text-sm text-foreground/60 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-deep font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
