"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SettingsModal from "@/components/SettingsModal";

export default function Navbar({ loggedIn, userImage }) {
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();
  const showProfileLink = loggedIn && pathname !== "/profile";

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/40 border-b border-white/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href={loggedIn ? "/profile" : "/"} className="flex items-center gap-2">
            <span className="text-2xl">💕</span>
            <span className="text-xl font-bold gradient-text">Memories</span>
          </Link>

          {loggedIn ? (
            <nav className="flex items-center gap-3">
              {showProfileLink && (
                <Link
                  href="/profile"
                  className="text-sm font-medium text-rose-deep hover:opacity-70 px-2"
                >
                  Profile
                </Link>
              )}
              <button
                onClick={() => setShowSettings(true)}
                aria-label="Open profile settings"
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/70 shadow-md hover:opacity-80 transition ring-2 ring-rose/20 bg-blush flex items-center justify-center"
              >
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base">💗</span>
                )}
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="btn-secondary !py-2 !px-4 text-sm">
                Login
              </Link>
              <Link href="/signup" className="btn-primary !py-2 !px-4 text-sm">
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
