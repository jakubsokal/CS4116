import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message_id, review_id, user_id, reported_by, contents, reason } = req.body;

    if (!user_id || !reported_by || !contents) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if ((!message_id && !review_id) || (message_id && review_id)) {
      return res.status(400).json({ error: 'Either message_id or review_id must be provided, but not both' });
    }

    const { data, error } = await supabase
      .from('reported')
      .insert([
        {
          message_id,
          review_id,
          user_id,
          reported_by,
          contents,
          reason,
          reviewed: 0
        }
      ]);

    if (error) {
      console.error('Error inserting report:', error);
      return res.status(500).json({ error: 'Failed to create report' });
    }

    return res.status(200).json({ message: 'Report created successfully', data });
  } catch (error) {
    console.error('Error in createReport:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 