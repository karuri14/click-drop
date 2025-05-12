import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropertyListingForm from "@/components/PropertyListingForm";
import { usePropertyListings } from "@/hooks/usePropertyListings";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateListing } = usePropertyListings();
  const { uploadImages } = usePropertyImages();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/property_listings?id=eq.${id}&select=*`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await response.json();
        if (data && data.length > 0) {
          setListing(data[0]);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      if (!user || !id) {
        navigate("/login");
        return;
      }

      // Upload any new images
      let imageUrls = listing.images || [];
      if (data.images && data.images.length > 0) {
        const uploadedImages = await uploadImages(id, data.images);
        const newImageUrls = uploadedImages.map((img) => img.url);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update the property listing
      const updatedListing = {
        title: data.title,
        price: data.price,
        description: data.description,
        location: data.location,
        cta_type: data.ctaType,
        image_url: imageUrls[0] || listing.image_url,
        images: imageUrls,
        updated_at: new Date().toISOString(),
      };

      const success = await updateListing(id, updatedListing);

      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Listing not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Transform the listing data to match the form structure
  const formData = {
    title: listing.title,
    price: listing.price,
    description: listing.description,
    location: listing.location,
    ctaType: listing.cta_type || "both",
    images: listing.images || [],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit Property Listing
        </h1>
        <PropertyListingForm
          onSubmit={handleSubmit}
          initialData={formData}
          isEditing={true}
        />
      </div>
    </div>
  );
}
