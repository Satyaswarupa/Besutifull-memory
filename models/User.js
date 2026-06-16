import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    memoryLabel: { type: String, default: "Our Special Day" },
    memoryType: {
      type: String,
      enum: ["anniversary", "marriage", "birthday", "custom"],
      default: "anniversary",
    },
    memoryDate: { type: Date, required: true },
    backgroundAnimation: {
      type: String,
      enum: ["hearts", "stars", "bubbles", "fireflies"],
      default: "hearts",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
