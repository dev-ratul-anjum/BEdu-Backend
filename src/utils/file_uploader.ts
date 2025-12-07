// fileUploader.ts
import { v2 as cloudinary } from "cloudinary";
import multer, { memoryStorage } from "multer";
import path from "path";

const storage = memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed_types = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    if (allowed_types.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only images and PDFs are allowed!"));
  },
});

export const upload_to_cloudinary = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    // Cloudinary config
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Unique pretty filename
    const file_ext = path.extname(file.originalname);
    const file_name =
      file.originalname
        .replace(file_ext, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // auto detect image/pdf
        public_id: file_name,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result); // full Cloudinary response
      }
    );

    stream.end(file.buffer); // memoryStorage buffer
  });
};

export const upload_multiple_to_cloudinary = async (
  files: Express.Multer.File[]
) => {
  return await Promise.all(files.map(upload_to_cloudinary));
};

export const file_uploader = {
  upload,
  upload_to_cloudinary,
  upload_multiple_to_cloudinary,
};
