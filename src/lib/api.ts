import { supabase } from "./supabase";

// Property listings API functions
export const getPropertyListings = async () => {
  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};

export const getPropertyListingById = async (id: string) => {
  const { data, error } = await supabase
    .from("property_listings")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

export const createPropertyListing = async (listing: any) => {
  const { data, error } = await supabase
    .from("property_listings")
    .insert([listing])
    .select();

  return { data, error };
};

export const updatePropertyListing = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("property_listings")
    .update(updates)
    .eq("id", id)
    .select();

  return { data, error };
};

export const deletePropertyListing = async (id: string) => {
  const { error } = await supabase
    .from("property_listings")
    .delete()
    .eq("id", id);

  return { error };
};

// User profiles API functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select();

  return { data, error };
};

// Storage functions for property images
export const uploadPropertyImage = async (filePath: string, file: File) => {
  const { data, error } = await supabase.storage
    .from("property_images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  return { data, error };
};

export const getPropertyImageUrl = (path: string) => {
  const { data } = supabase.storage.from("property_images").getPublicUrl(path);

  return data.publicUrl;
};

export const deletePropertyImage = async (path: string) => {
  const { error } = await supabase.storage
    .from("property_images")
    .remove([path]);

  return { error };
};
