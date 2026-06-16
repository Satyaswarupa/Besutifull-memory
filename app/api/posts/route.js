import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getCurrentUserId } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectDB();
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    posts: posts.map((p) => ({
      ...p,
      _id: p._id.toString(),
      user: p.user.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString() || "";
    const image = formData.get("image");

    if (!title) {
      return NextResponse.json({ error: "Please add a title for your memory." }, { status: 400 });
    }

    if (!image || typeof image !== "object" || image.size === 0) {
      return NextResponse.json({ error: "Please choose an image to upload." }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "memories/posts");

    await connectDB();
    const post = await Post.create({
      user: userId,
      imageUrl: result.secure_url,
      title,
      description,
    });

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
    console.error("Create post error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
