import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Post from "@/models/Post";
import { getCurrentUserId } from "@/lib/auth";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  await connectDB();
  const [user, posts] = await Promise.all([
    User.findById(userId).select("-password").lean(),
    Post.find({ user: userId }).sort({ createdAt: -1 }).lean(),
  ]);

  if (!user) redirect("/login");

  const plainUser = {
    ...user,
    _id: user._id.toString(),
    memoryDate: user.memoryDate.toISOString(),
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };

  const plainPosts = posts.map((p) => ({
    ...p,
    _id: p._id.toString(),
    user: p.user.toString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <ProfileView initialUser={plainUser} initialPosts={plainPosts} />;
}
