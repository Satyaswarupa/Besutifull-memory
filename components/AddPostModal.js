"use client";

import { useState } from "react";

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_BELOW = 1.5 * 1024 * 1024; // already-small files are left alone

async function compressImage(file) {
  if (file.size <= SKIP_COMPRESSION_BELOW) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function AddPostModal({ onClose, onUploadStart }) {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [compressing, setCompressing] = useState(false);

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCompressing(true);
    const finalFile = await compressImage(file);
    setImageFile(finalFile);
    setPreview(URL.createObjectURL(finalFile));
    setCompressing(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (compressing) return;
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
            {compressing ? (
              <div className="text-center text-foreground/50">
                <div className="text-4xl mb-2 animate-pulse">📷</div>
                <p className="text-sm">Preparing photo…</p>
              </div>
            ) : preview ? (
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
            <button type="submit" disabled={compressing} className="btn-primary flex-1">
              {compressing ? "Preparing…" : "Add Memory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
