import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUserId } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const bio = formData.get("bio");
    const name = formData.get("name");
    const memoryLabel = formData.get("memoryLabel");
    const memoryDate = formData.get("memoryDate");
    const profileImage = formData.get("profileImage");

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (bio !== null) user.bio = bio.toString();
    if (name) user.name = name.toString().trim();
    if (memoryLabel) user.memoryLabel = memoryLabel.toString();
    if (memoryDate) user.memoryDate = new Date(memoryDate.toString());

    if (profileImage && typeof profileImage === "object" && profileImage.size > 0) {
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      const result = await uploadToCloudinary(buffer, "memories/profiles");
      user.profileImage = result.secure_url;
    }

    await user.save();

    const { password, ...userData } = user.toObject();
    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
