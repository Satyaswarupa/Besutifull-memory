"use client";

import LoveBackground from "@/components/LoveBackground";
import StarsBackground from "@/components/StarsBackground";
import BubblesBackground from "@/components/BubblesBackground";
import FirefliesBackground from "@/components/FirefliesBackground";
export default function DynamicBackground({ animation = "hearts" }) {
  switch (animation) {
    case "stars":     return <StarsBackground />;
    case "bubbles":   return <BubblesBackground />;
    case "fireflies": return <FirefliesBackground />;
    default:          return <LoveBackground />;
  }
}
