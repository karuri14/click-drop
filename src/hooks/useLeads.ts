import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useLeads(propertyId?: string) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads for a specific property or all leads if no propertyId is provided
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("leads").select("*");

      if (propertyId) {
        query = query.eq("property_id", propertyId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setLeads(data || []);
    } catch (err) {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead
  const createLead = async (leadData: any) => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select();

      if (error) {
        setError(error.message);
        return null;
      }

      // Update local state
      setLeads((prev) => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      setError("Failed to create lead");
      return null;
    }
  };

  // Set up real-time subscription if propertyId is provided
  useEffect(() => {
    fetchLeads();

    if (propertyId) {
      // Subscribe to changes for this specific property
      const subscription = supabase
        .channel(`leads_for_property_${propertyId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "leads",
            filter: `property_id=eq.${propertyId}`,
          },
          (payload) => {
            console.log("New lead received!", payload);
            // Add the new lead to the state
            setLeads((prev) => [payload.new as any, ...prev]);
          },
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [propertyId]);

  return {
    leads,
    loading,
    error,
    fetchLeads,
    createLead,
  };
}
