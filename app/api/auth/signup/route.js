import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const password = formData.get("password")?.toString();
    const memoryType = formData.get("memoryType")?.toString() || "anniversary";
    const memoryLabel = formData.get("memoryLabel")?.toString() || "Our Special Day";
    const memoryDate = formData.get("memoryDate")?.toString();
    const profileImage = formData.get("profileImage");

    if (!name || !email || !password || !memoryDate) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    let profileImageUrl = "";
    if (profileImage && typeof profileImage === "object" && profileImage.size > 0) {
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      const result = await uploadToCloudinary(buffer, "memories/profiles");
      profileImageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
      memoryType,
      memoryLabel,
      memoryDate: new Date(memoryDate),
    });

    const token = signToken({ userId: user._id.toString() });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
