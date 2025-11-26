// fileUploader.ts
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB per file
  fileFilter: (req, file, cb) => {
    console.log("file", file);
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images and PDFs are allowed!"));
  },
});

export const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Unique pretty filename
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // auto detect image/pdf
        public_id: fileName,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result); // full Cloudinary response
      }
    );

    stream.end(file.buffer); // memoryStorage buffer
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[]
) => {
  return await Promise.all(files.map(uploadToCloudinary));
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
};
