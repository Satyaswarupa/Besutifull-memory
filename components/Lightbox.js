"use client";

import { useEffect, useRef, useState } from "react";

function formatDateTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function Lightbox({ posts, startIndex, onClose, onEdit, onDelete }) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = itemRefs.current[startIndex];
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });

    function handleKey(e) {
      if (e.key === "Escape") {
        if (editingId) { setEditingId(null); return; }
        if (confirmDeleteId) { setConfirmDeleteId(null); return; }
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startIndex, onClose, editingId, confirmDeleteId]);

  function startEdit(post) {
    setEditingId(post._id);
    setTempTitle(post.title);
    setTempDesc(post.description || "");
    setError("");
  }

  async function handleSave(postId) {
    if (!tempTitle.trim()) { setError("Title cannot be empty."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: tempTitle.trim(), description: tempDesc }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Could not save."); return; }
      onEdit?.(json.post);
      setEditingId(null);
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(postId) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) { setError("Could not delete."); return; }
      onDelete?.(postId);
      onClose();
    } catch {
      setError("Could not delete.");
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] w-9 h-9 rounded-full bg-white/15 backdrop-blur text-white text-lg flex items-center justify-center hover:bg-white/25 transition"
        aria-label="Close"
      >
        ✕
      </button>

      <div
        ref={containerRef}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory"
      >
        {posts.map((post, i) => {
          const isEditing = editingId === post._id;
          const isConfirmDelete = confirmDeleteId === post._id;

          return (
            <div
              key={post._id}
              ref={(el) => (itemRefs.current[i] = el)}
              className="h-full w-full snap-start flex items-center justify-center p-4 sm:p-8"
            >
              <div className="max-w-2xl w-full rounded-3xl overflow-hidden bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl animate-pop-in">

                {/* Title */}
                <div className="px-5 pt-4 pb-3">
                  {isEditing ? (
                    <input
                      className="w-full bg-white/15 border border-white/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/60"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <h2 className="text-base sm:text-lg font-semibold text-white leading-snug">
                      {post.title}
                    </h2>
                  )}
                </div>

                {/* Image */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full max-h-[52vh] object-contain bg-black/20"
                />

                {/* Footer */}
                <div className="px-5 py-4">
                  {/* Description */}
                  <div className="flex items-end justify-between gap-4 mb-3">
                    {isEditing ? (
                      <textarea
                        className="flex-1 bg-white/15 border border-white/30 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/60 resize-none"
                        rows={2}
                        placeholder="Description…"
                        value={tempDesc}
                        onChange={(e) => setTempDesc(e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-white/65 whitespace-pre-wrap leading-relaxed flex-1">
                        {post.description || ""}
                      </p>
                    )}
                    <span className="text-[11px] text-white/40 font-medium shrink-0 text-right">
                      {formatDateTime(post.createdAt)}
                    </span>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 mb-2">{error}</p>
                  )}

                  {/* Action buttons */}
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingId(null); setError(""); }}
                        className="flex-1 text-xs font-medium py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(post._id)}
                        disabled={saving}
                        className="flex-1 text-xs font-semibold py-2 rounded-xl bg-gradient-to-r from-rose to-lilac text-white hover:opacity-85 transition"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  ) : isConfirmDelete ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-white/60 flex-1">Delete this memory?</span>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deleting}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition"
                      >
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => startEdit(post)}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition"
                      >
                        <PencilIcon /> Edit
                      </button>
                      <button
                        onClick={() => { setConfirmDeleteId(post._id); setError(""); }}
                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
                      >
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
