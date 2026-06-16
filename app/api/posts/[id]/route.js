import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUserId } from "@/lib/auth";
import { getPublicIdFromUrl, deleteFromCloudinary } from "@/lib/cloudinary";

export async function PATCH(request, { params }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const { id } = await params;
    const { title, description } = await request.json();
    if (!title?.trim()) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    await connectDB();
    const post = await Post.findOne({ _id: id, user: userId });
    if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

    post.title = title.trim();
    post.description = description || "";
    await post.save();

    const plain = post.toObject();
    return NextResponse.json({
      post: {
        ...plain,
        _id: plain._id.toString(),
        user: plain.user.toString(),
        createdAt: plain.createdAt.toISOString(),
        updatedAt: plain.updatedAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("Update post error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const post = await Post.findOneAndDelete({ _id: id, user: userId });
    if (!post) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const publicId = getPublicIdFromUrl(post.imageUrl);
    if (publicId) await deleteFromCloudinary(publicId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete post error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
