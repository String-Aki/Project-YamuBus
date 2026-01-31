import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000,
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "yamubus_uploads",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      timeout: 120000,
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

const uploadToCloudinaryBase64 = async (buffer, options = {}) => {
  const base64String = `data:image/png;base64,${buffer.toString("base64")}`;
  
  const uploadOptions = {
    folder: "yamubus_uploads",
    resource_type: "auto",
    timeout: 180000,
    ...options,
  };

  return cloudinary.uploader.upload(base64String, uploadOptions);
};

const processCloudinaryUploads = (fieldNames) => {
  return async (req, res, next) => {
    try {
      if (!req.files) {
        return next();
      }

      for (const fieldName of fieldNames) {
        const files = req.files[fieldName];
        if (files && files.length > 0) {
          for (const file of files) {            
            const result = await uploadToCloudinaryBase64(file.buffer, {
              folder: "yamubus_uploads",
            });
            file.path = result.secure_url;
            file.cloudinaryId = result.public_id;
          }
        }
      }

      next();
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500);
      next(new Error("Failed to upload files to cloud storage"));
    }
  };
};

export { upload, uploadToCloudinary, processCloudinaryUploads };
export default upload;