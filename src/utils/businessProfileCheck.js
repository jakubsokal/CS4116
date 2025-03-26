import { supabase } from "@/utils/supabase/client";

export const isBusinessProfileIncomplete = async (businessId) => {
  console.log("Checking business profile for ID:", businessId);
  const { data, error } = await supabase
    .from('business')
    .select('description, open_hour, close_hour, profile_picture')
    .eq('business_id', businessId)
    .single();

  console.log("Business profile data:", data);
  console.log("Business profile error:", error);

  if (error) {
    console.error('Error checking business profile:', error);
    return true;
  }

  const isIncomplete = !data.description || !data.open_hour || !data.close_hour;
  console.log("Is profile incomplete:", isIncomplete);
  return isIncomplete;
}; 