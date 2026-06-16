import { Roboto, Dancing_Script } from "next/font/google";
import "./globals.css";
import LoveBackground from "@/components/LoveBackground";
import Navbar from "@/components/Navbar";
import { getCurrentUserId } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Memories — Our Love Story",
  description: "Save the dates and moments that matter most to you.",
};

export default async function RootLayout({ children }) {
  const userId = await getCurrentUserId();

  let userImage = null;
  if (userId) {
    await connectDB();
    const u = await User.findById(userId).select("profileImage").lean();
    userImage = u?.profileImage || null;
  }

  return (
    <html lang="en" className={`${roboto.variable} ${dancing.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <LoveBackground />
        <Navbar loggedIn={!!userId} userImage={userImage} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
