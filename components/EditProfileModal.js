"use client";

import { useState } from "react";

export default function EditProfileModal({ user, onClose, onSaved }) {
  const [bio, setBio] = useState(user.bio || "");
  const [name, setName] = useState(user.name || "");
  const [memoryLabel, setMemoryLabel] = useState(user.memoryLabel || "");
  const [memoryDate, setMemoryDate] = useState(
    user.memoryDate ? new Date(user.memoryDate).toISOString().slice(0, 10) : ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("bio", bio);
      data.append("name", name);
      data.append("memoryLabel", memoryLabel);
      data.append("memoryDate", memoryDate);
      if (imageFile) data.append("profileImage", imageFile);

      const res = await fetch("/api/user", { method: "PATCH", body: data });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Could not save your changes.");
        setLoading(false);
        return;
      }

      onSaved(json.user);
    } catch {
      setError("Could not save your changes.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-md animate-pop-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <label htmlFor="editProfileImage" className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blush flex items-center justify-center text-3xl group-hover:opacity-80 transition">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>📷</span>
                )}
              </div>
            </label>
            <input
              id="editProfileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Tell your story..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="pt-2 border-t border-rose/20">
            <p className="text-sm font-semibold mb-2 mt-3">Countdown date 💗</p>
            <div>
              <label className="block text-sm font-medium mb-1">Label</label>
              <input
                className="input-field"
                value={memoryLabel}
                onChange={(e) => setMemoryLabel(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="input-field"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
