import { useState, useEffect } from "react";
import {
  getPropertyListings,
  createPropertyListing,
  updatePropertyListing,
  deletePropertyListing,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";

export function usePropertyListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all property listings
  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getPropertyListings();

      if (error) {
        setError(error.message);
        return;
      }

      setListings(data || []);
    } catch (err) {
      setError("Failed to fetch property listings");
    } finally {
      setLoading(false);
    }
  };

  // Create a new property listing
  const addListing = async (listing: any) => {
    try {
      const { data, error } = await createPropertyListing(listing);

      if (error) {
        setError(error.message);
        return null;
      }

      // Update local state
      setListings((prev) => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError("Failed to create property listing");
      return null;
    }
  };

  // Update an existing property listing
  const updateListing = async (id: string, updates: any) => {
    try {
      const { data, error } = await updatePropertyListing(id, updates);

      if (error) {
        setError(error.message);
        return false;
      }

      // Update local state
      setListings((prev) =>
        prev.map((listing) => (listing.id === id ? data[0] : listing)),
      );
      return true;
    } catch (err) {
      setError("Failed to update property listing");
      return false;
    }
  };

  // Delete a property listing
  const removeListing = async (id: string) => {
    try {
      const { error } = await deletePropertyListing(id);

      if (error) {
        setError(error.message);
        return false;
      }

      // Update local state
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete property listing");
      return false;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchListings();

    // Subscribe to changes
    const subscription = supabase
      .channel("property_listings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "property_listings" },
        (payload) => {
          console.log("Change received!", payload);
          fetchListings(); // Refetch all listings when changes occur
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    listings,
    loading,
    error,
    fetchListings,
    addListing,
    updateListing,
    removeListing,
  };
}
