"use client";

import { useState } from "react";
import Masonry from "react-masonry-css";
import AddPostModal from "@/components/AddPostModal";
import Lightbox from "@/components/Lightbox";
import UploadProgress from "@/components/UploadProgress";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  640: 2,
};

function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 90));
      }
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(json);
        else reject(new Error(json.error || "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    xhr.open("POST", "/api/posts");
    xhr.send(formData);
  });
}

export default function GalleryView({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [adding, setAdding] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  async function handleUpload(formData) {
    setUploadProgress(0);
    try {
      const json = await uploadWithProgress(formData, setUploadProgress);
      setUploadProgress(100);
      setPosts((prev) => [json.post, ...prev]);
      setTimeout(() => setUploadProgress(null), 700);
    } catch {
      setUploadProgress(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <UploadProgress progress={uploadProgress} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">Our Gallery</h1>
          <p className="text-sm text-foreground/60 mt-1">Every memory, in one place 💕</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary !px-5 !py-3 text-xl leading-none">
          +
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center animate-pop-in">
          <div className="text-4xl mb-3">📷</div>
          <h2 className="text-lg font-bold mb-1">No memories yet</h2>
          <p className="text-sm text-foreground/60">
            Tap the + button to add your first photo memory.
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {posts.map((post, i) => (
            <button
              key={post._id}
              onClick={() => setActiveIndex(i)}
              className="block w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 animate-pop-in"
            >
              <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover block" />
            </button>
          ))}
        </Masonry>
      )}

      {adding && (
        <AddPostModal
          onClose={() => setAdding(false)}
          onUploadStart={(formData) => {
            setAdding(false);
            handleUpload(formData);
          }}
        />
      )}

      {activeIndex !== null && (
        <Lightbox
          posts={posts}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onEdit={(updated) =>
            setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
          }
          onDelete={(id) => {
            setPosts((prev) => prev.filter((p) => p._id !== id));
            setActiveIndex(null);
          }}
        />
      )}
    </div>
  );
}
