import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export function getPublicIdFromUrl(url) {
  // e.g. https://res.cloudinary.com/cloud/image/upload/v1234/memories/posts/abc.jpg
  // → memories/posts/abc
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const withoutVersion = parts[1].replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
}

export function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
