

import { supabase } from "@/utils/supabase/client";

//fetches inquiries
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("inquiries").select(`
      inquiry_id,
      sender_id,
      receiver_id,
      created_at,
      users:sender_id (first_name, last_name)
    `);


    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }
  //updates the status of inquiry
  if (req.method === "PATCH") {
    
    const { inquiry_id, status } = req.body;

    const { data, error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("inquiry_id", inquiry_id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
  }

  //Deletes inquiry from inquiry table
  if (req.method === "DELETE") {

    const { inquiry_id } = req.body;

    const { error } = await supabase.from("inquiries").delete().eq("inquiry_id", inquiry_id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Inquiry deleted" });
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}


