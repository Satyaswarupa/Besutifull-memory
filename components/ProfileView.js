"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Countdown from "@/components/Countdown";
import AddPostModal from "@/components/AddPostModal";
import Lightbox from "@/components/Lightbox";
import UploadProgress from "@/components/UploadProgress";

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

const galleryBreakpoints = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 2,
  480: 2,
};

export default function ProfileView({ initialUser, initialPosts }) {
  const [user, setUser] = useState(initialUser);
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

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <UploadProgress progress={uploadProgress} />
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* ── Profile sidebar ── */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-6 shrink-0">
          <div className="rounded-3xl p-6 sm:p-8 animate-pop-in bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">

            {/* ── MOBILE layout (hidden on lg+) ── */}
            <div className="lg:hidden">
              <h1 className="text-3xl gradient-text text-left mb-4" style={{ fontFamily: "var(--font-dancing)" }}>
                {user.name}
              </h1>
              <div className="flex flex-row items-center gap-4">
                {/* Profile image */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blush flex items-center justify-center text-4xl">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>💗</span>
                    )}
                  </div>
                  <span className="absolute inset-0 rounded-full border-2 border-rose/40 animate-ping-slow pointer-events-none" />
                </div>
                {/* Countdown next to image */}
                <div className="flex-1 min-w-0">
                  <Countdown targetDate={user.memoryDate} label={user.memoryLabel} />
                </div>
              </div>
              {/* Bio below the row */}
              <p className="text-sm text-white/70 mt-4 whitespace-pre-wrap leading-relaxed text-left">
                {user.bio || "No bio yet — tell your story!"}
              </p>
            </div>

            {/* ── DESKTOP layout (hidden on mobile) ── */}
            <div className="hidden lg:block text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg bg-blush flex items-center justify-center text-4xl">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>💗</span>
                  )}
                </div>
                <span className="absolute inset-0 rounded-full border-2 border-rose/40 animate-ping-slow pointer-events-none" />
              </div>

              <h1 className="text-3xl sm:text-4xl mt-4 gradient-text" style={{ fontFamily: "var(--font-dancing)" }}>
                {user.name}
              </h1>

              <p className="text-sm sm:text-base text-white/70 mt-2 whitespace-pre-wrap leading-relaxed">
                {user.bio || "No bio yet — tell your story!"}
              </p>

              <div className="mt-6 pt-5 border-t border-rose/20">
                <Countdown targetDate={user.memoryDate} label={user.memoryLabel} />
              </div>

            </div>

          </div>
        </aside>

        {/* ── Gallery main ── */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-white/60">
              Every memory, in one place 💕
            </p>
            <button
              onClick={() => setAdding(true)}
              className="btn-primary !px-3 !py-1.5 text-base sm:!px-5 sm:!py-3 sm:text-xl leading-none"
            >
              +
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center animate-pop-in">
              <div className="text-5xl mb-3">📷</div>
              <h3 className="text-lg font-bold mb-1">No memories yet</h3>
              <p className="text-sm text-foreground/60">
                Tap the + button to add your first photo memory.
              </p>
            </div>
          ) : (
            <Masonry
              breakpointCols={galleryBreakpoints}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {posts.map((post, i) => (
                <button
                  key={post._id}
                  onClick={() => setActiveIndex(i)}
                  className="block w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200 animate-pop-in"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto object-cover block"
                  />
                </button>
              ))}
            </Masonry>
          )}
        </section>
      </div>

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
