"use client";

import { useState } from "react";

export default function AddPostModal({ onClose, onUploadStart }) {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!imageFile) { setError("Please choose a photo to add."); return; }
    if (!title.trim()) { setError("Please give this memory a title."); return; }

    const data = new FormData();
    data.append("image", imageFile);
    data.append("title", title.trim());
    data.append("description", description);

    onUploadStart(data);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-md animate-pop-in max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Add a New Memory 💗</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="postImage"
            className="block w-full aspect-square rounded-2xl border-2 border-dashed border-rose/30 bg-white/60 flex items-center justify-center cursor-pointer overflow-hidden hover:border-rose/60 transition"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-foreground/50">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">Tap to choose a photo</p>
              </div>
            )}
          </label>
          <input
            id="postImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="input-field"
              placeholder="A perfect afternoon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="What made this moment special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
