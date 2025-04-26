import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { chatId } = req.query;

  if (!chatId) {
    return res.status(400).json({ error: 'Missing chatId parameter' });
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('inquiry_id')
    .eq('convo_id', chatId)
    .single(); 

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  return res.status(200).json({ inquiry_id: data.inquiry_id });
}
