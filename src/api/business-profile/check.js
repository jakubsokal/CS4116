import { supabase } from "@/utils/supabase/server";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessId } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    const { data: businessData, error: businessError } = await supabase
      .from('business')
      .select('description, open_hour, close_hour')
      .eq('business_id', businessId)
      .single();

    if (businessError) {
      console.error('Error fetching business data:', businessError);
      return res.status(500).json({ error: 'Failed to fetch business data' });
    }

    const isIncomplete = !businessData.description || 
                        !businessData.open_hour || 
                        !businessData.close_hour;

    return res.status(200).json({ isIncomplete });
  } catch (error) {
    console.error('Error checking business profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 