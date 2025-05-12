import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  uploadPropertyImage,
  getPropertyImageUrl,
  deletePropertyImage,
} from "@/lib/api";

export function usePropertyImages() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Upload multiple images and return their paths
  const uploadImages = async (propertyId: string, files: File[]) => {
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Create a unique file path
        const fileExt = file.name.split(".").pop();
        const fileName = `${propertyId}/${uuidv4()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await uploadPropertyImage(filePath, file);

        if (error) {
          throw new Error(error.message);
        }

        // Return the path and public URL
        return {
          path: data?.path || filePath,
          url: getPropertyImageUrl(filePath),
        };
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
      return [];
    } finally {
      setUploading(false);
    }
  };

  // Delete an image by path
  const deleteImage = async (path: string) => {
    try {
      const { error } = await deletePropertyImage(path);

      if (error) {
        setError(error.message);
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete image");
      return false;
    }
  };

  return {
    uploading,
    error,
    uploadImages,
    deleteImage,
    getImageUrl: getPropertyImageUrl,
  };
}
