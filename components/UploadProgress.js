"use client";

export default function UploadProgress({ progress }) {
  if (progress === null) return null;

  return (
    <div className="fixed top-[57px] left-0 right-0 z-[39] h-[5px] bg-black/20">
      <div
        className="h-full bg-gradient-to-r from-rose to-lilac transition-all duration-300 ease-out shadow-[0_0_10px_2px_rgba(255,107,157,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
