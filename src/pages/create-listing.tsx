import React from "react";
import { useNavigate } from "react-router-dom";
import PropertyListingForm from "@/components/PropertyListingForm";
import { usePropertyListings } from "@/hooks/usePropertyListings";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addListing } = usePropertyListings();
  const { uploadImages } = usePropertyImages();

  const handleSubmit = async (data) => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }

      // Create a unique ID for the property
      const propertyId = uuidv4();

      // Upload images first
      let imageUrls = [];
      if (data.images && data.images.length > 0) {
        const uploadedImages = await uploadImages(propertyId, data.images);
        imageUrls = uploadedImages.map((img) => img.url);
      }

      // Create the property listing
      const newListing = {
        id: propertyId,
        user_id: user.id,
        title: data.title,
        price: data.price,
        description: data.description,
        location: data.location,
        cta_type: data.ctaType,
        image_url: imageUrls[0] || null,
        images: imageUrls,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = await addListing(newListing);

      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create New Property Listing
        </h1>
        <PropertyListingForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
