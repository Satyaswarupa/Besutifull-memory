import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUserId } from "@/lib/auth";
import GalleryView from "@/components/GalleryView";

export default async function GalleryPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await connectDB();
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).lean();

  const plainPosts = posts.map((p) => ({
    ...p,
    _id: p._id.toString(),
    user: p.user.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <GalleryView initialPosts={plainPosts} />;
}
