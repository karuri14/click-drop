import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAnalytics(userId?: string) {
  const [analytics, setAnalytics] = useState<{
    totalListings: number;
    totalLeads: number;
    totalViews: number;
    conversionRate: string;
    topPerformingListing: any | null;
    recentLeads: any[];
  }>({
    totalListings: 0,
    totalLeads: 0,
    totalViews: 0,
    conversionRate: "0%",
    topPerformingListing: null,
    recentLeads: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // Get total listings count
      const { count: listingsCount, error: listingsError } = await supabase
        .from("property_listings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (listingsError) throw new Error(listingsError.message);

      // Get all property IDs for this user
      const { data: propertyIds, error: propertyIdsError } = await supabase
        .from("property_listings")
        .select("id")
        .eq("user_id", userId);

      if (propertyIdsError) throw new Error(propertyIdsError.message);

      const ids = propertyIds.map((p) => p.id);

      // Get total leads count
      const { count: leadsCount, error: leadsError } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .in("property_id", ids);

      if (leadsError) throw new Error(leadsError.message);

      // Get total views count
      const { count: viewsCount, error: viewsError } = await supabase
        .from("property_views")
        .select("*", { count: "exact", head: true })
        .in("property_id", ids);

      if (viewsError) throw new Error(viewsError.message);

      // Calculate conversion rate
      const conversionRate =
        viewsCount > 0
          ? ((leadsCount / viewsCount) * 100).toFixed(2) + "%"
          : "0%";

      // Get top performing listing (most leads)
      const { data: topListingData, error: topListingError } = await supabase
        .from("leads")
        .select("property_id, count")
        .in("property_id", ids)
        .group("property_id")
        .order("count", { ascending: false })
        .limit(1);

      if (topListingError) throw new Error(topListingError.message);

      let topPerformingListing = null;

      if (topListingData && topListingData.length > 0) {
        const { data: listingDetails, error: listingDetailsError } =
          await supabase
            .from("property_listings")
            .select("*")
            .eq("id", topListingData[0].property_id)
            .single();

        if (listingDetailsError) throw new Error(listingDetailsError.message);

        topPerformingListing = listingDetails;
      }

      // Get recent leads
      const { data: recentLeadsData, error: recentLeadsError } = await supabase
        .from("leads")
        .select("*")
        .in("property_id", ids)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentLeadsError) throw new Error(recentLeadsError.message);

      setAnalytics({
        totalListings: listingsCount || 0,
        totalLeads: leadsCount || 0,
        totalViews: viewsCount || 0,
        conversionRate,
        topPerformingListing,
        recentLeads: recentLeadsData || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId]);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}
