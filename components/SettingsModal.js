"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackgroundPicker from "@/components/BackgroundPicker";

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function FieldRow({ label, display, isEditing, onEdit, onSave, onCancel, saving, children }) {
  return (
    <div className="py-3.5 border-b border-white/10 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
          {label}
        </span>
        {!isEditing && (
          <button onClick={onEdit} className="text-white/30 hover:text-rose/80 transition p-0.5">
            <PencilIcon />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2 mt-1">
          {children}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-white/20 text-white/60 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-gradient-to-r from-rose to-lilac text-white hover:opacity-85 transition"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white/70 leading-relaxed break-words">{display}</p>
      )}
    </div>
  );
}

export default function SettingsModal({ onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [memoryLabel, setMemoryLabel] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState("hearts");
  const [savingBg, setSavingBg] = useState(false);

  const [editingField, setEditingField] = useState(null);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [tempLabel, setTempLabel] = useState("");
  const [tempDate, setTempDate] = useState("");

  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(({ user }) => {
        setName(user.name || "");
        setBio(user.bio || "");
        setMemoryLabel(user.memoryLabel || "");
        setMemoryDate(
          user.memoryDate ? new Date(user.memoryDate).toISOString().slice(0, 10) : ""
        );
        setPhotoUrl(user.profileImage || null);
        setBackgroundAnimation(user.backgroundAnimation || "hearts");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function startEdit(field) {
    setEditingField(field);
    setError("");
    if (field === "name") setTempName(name);
    if (field === "bio") setTempBio(bio);
    if (field === "countdown") { setTempLabel(memoryLabel); setTempDate(memoryDate); }
  }

  function cancelEdit() { setEditingField(null); setError(""); }

  async function saveField() {
    setSaving(true);
    setError("");
    try {
      const nextName  = editingField === "name"      ? tempName  : name;
      const nextBio   = editingField === "bio"       ? tempBio   : bio;
      const nextLabel = editingField === "countdown" ? tempLabel : memoryLabel;
      const nextDate  = editingField === "countdown" ? tempDate  : memoryDate;

      const data = new FormData();
      data.append("name", nextName);
      data.append("bio", nextBio);
      data.append("memoryLabel", nextLabel);
      data.append("memoryDate", nextDate);

      const res  = await fetch("/api/user", { method: "PATCH", body: data });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Could not save."); return; }

      if (editingField === "name")      setName(tempName);
      if (editingField === "bio")       setBio(tempBio);
      if (editingField === "countdown") { setMemoryLabel(tempLabel); setMemoryDate(tempDate); }
      setEditingField(null);
      router.refresh();
    } catch { setError("Could not save."); }
    finally   { setSaving(false); }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPhotoFile(file);
    setNewPhotoPreview(URL.createObjectURL(file));
  }

  async function savePhoto() {
    if (!newPhotoFile) return;
    setSavingPhoto(true);
    setError("");
    try {
      const data = new FormData();
      data.append("profileImage", newPhotoFile);
      data.append("name", name);
      data.append("bio", bio);
      data.append("memoryLabel", memoryLabel);
      data.append("memoryDate", memoryDate);

      const res  = await fetch("/api/user", { method: "PATCH", body: data });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Could not save photo."); return; }

      setPhotoUrl(json.user.profileImage);
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      router.refresh();
    } catch { setError("Could not save photo."); }
    finally  { setSavingPhoto(false); }
  }

  async function saveBackground(animId) {
    setBackgroundAnimation(animId);
    setSavingBg(true);
    try {
      const data = new FormData();
      data.append("backgroundAnimation", animId);
      data.append("name", name);
      data.append("bio", bio);
      data.append("memoryLabel", memoryLabel);
      data.append("memoryDate", memoryDate);
      await fetch("/api/user", { method: "PATCH", body: data });
      router.refresh();
    } catch { /* silent */ }
    finally { setSavingBg(false); }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const displayDate = memoryDate
    ? new Date(memoryDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Not set";

  const countdownDisplay = memoryLabel ? `${memoryLabel} · ${displayDate}` : displayDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl w-full max-w-sm animate-pop-in max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white tracking-wide">Profile</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:bg-white/15 hover:text-white transition text-lg"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="py-14 text-center text-white/35 text-sm">Loading…</div>
        ) : (
          <>
            {/* Avatar */}
            <div className="flex flex-col items-center pt-6 pb-2 gap-2">
              <label htmlFor="settingsPhoto" className="cursor-pointer relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 shadow-lg ring-2 ring-rose/30 bg-blush flex items-center justify-center text-3xl">
                  {(newPhotoPreview || photoUrl) ? (
                    <img src={newPhotoPreview || photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>💗</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-base">📷</span>
                </div>
              </label>
              <input id="settingsPhoto" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              {newPhotoFile && (
                <button
                  onClick={savePhoto}
                  disabled={savingPhoto}
                  className="text-[11px] font-semibold text-white bg-gradient-to-r from-rose to-lilac rounded-full px-4 py-1.5 hover:opacity-80 transition"
                >
                  {savingPhoto ? "Saving…" : "Save Photo"}
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="px-5 pb-2">
              <FieldRow label="Name" display={name || "—"} isEditing={editingField === "name"} onEdit={() => startEdit("name")} onSave={saveField} onCancel={cancelEdit} saving={saving}>
                <input className="input-field text-sm" value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus />
              </FieldRow>

              <FieldRow label="Bio" display={bio || "No bio yet"} isEditing={editingField === "bio"} onEdit={() => startEdit("bio")} onSave={saveField} onCancel={cancelEdit} saving={saving}>
                <textarea className="input-field resize-none text-sm" rows={3} placeholder="Tell your story…" value={tempBio} onChange={(e) => setTempBio(e.target.value)} autoFocus />
              </FieldRow>

              <FieldRow label="Countdown" display={countdownDisplay} isEditing={editingField === "countdown"} onEdit={() => startEdit("countdown")} onSave={saveField} onCancel={cancelEdit} saving={saving}>
                <input className="input-field text-sm" placeholder="Label (e.g. Anniversary)" value={tempLabel} onChange={(e) => setTempLabel(e.target.value)} autoFocus />
                <input type="date" className="input-field text-sm" value={tempDate} onChange={(e) => setTempDate(e.target.value)} />
              </FieldRow>
            </div>

            {/* Background Animation */}
            <div className="px-5 pt-1 pb-3 border-t border-white/10 mt-1">
              <div className="flex items-center justify-between mb-2 pt-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                  Background
                </span>
                {savingBg && (
                  <span className="text-[10px] text-white/40">Saving…</span>
                )}
              </div>
              <BackgroundPicker value={backgroundAnimation} onChange={saveBackground} />
            </div>

            {error && <p className="px-5 pb-2 text-xs text-red-400 text-center">{error}</p>}
          </>
        )}

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-3 flex items-center gap-3">
          <Link
            href="/gallery"
            onClick={onClose}
            className="flex-1 text-center text-sm font-medium text-rose/80 py-2 rounded-xl bg-rose/10 hover:bg-rose/20 transition"
          >
            📸 Gallery
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 text-center text-sm font-medium text-white/40 hover:text-white/70 py-2 rounded-xl hover:bg-white/10 transition"
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}
