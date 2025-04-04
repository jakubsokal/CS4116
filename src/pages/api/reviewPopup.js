import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { inquiry_id, description, rating } = req.body;

    if (!inquiry_id || !description || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 
    const { data: inquiryData, error: inquiryError } = await supabase
      .from("inquiries")
      .select("sender_id,service_id")
      .eq("inquiry_id", inquiry_id)
      .single();

    if (inquiryError || !inquiryData) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    const user_id = inquiryData.sender_id;
    const service_id = inquiryData.service_id;

    // inserts into reviews
    const { error } = await supabase.from("reviews").insert([
      { user_id, service_id, description, rating },
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Delete the inquiry after successful review submission
    const { error: deleteError } = await supabase
      .from("inquiries")
      .delete()
      .eq("inquiry_id", inquiry_id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(201).json({ message: "Review submitted and inquiry deleted successfully" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
