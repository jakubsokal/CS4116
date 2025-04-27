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
      .select("sender_id, service_id, receiver_id")
      .eq("inquiry_id", inquiry_id)
      .single();

    if (inquiryError || !inquiryData) {
      console.error("Error fetching inquiry data:", inquiryError);
      return res.status(404).json({ error: "Inquiry not found" });
    }

    const user_id = inquiryData.sender_id;
    const service_id = inquiryData.service_id;
    const receiver_id = inquiryData.receiver_id;

    // inserts into reviews
    const { error } = await supabase.from("reviews").insert([
      { user_id, service_id, description, rating },
    ]);

    const { data: business } = await supabase
      .from("business")
      .select("avg_rating")
      .eq("user_id", receiver_id)
      .single();

    const newRating = (business.avg_rating + rating) / 2;

    const { error: updateError } = await supabase
      .from("business")
      .update({ avg_rating: newRating })
      .eq("user_id", receiver_id);

      const { data: service } = await supabase
      .from("services")
      .select("avg_rating")
      .eq("service_id", service_id)
      .single();

      const newServiceRating = (service.avg_rating + rating) / 2;

      const { error: updateServiceError } = await supabase
      .from("services")
      .update({ avg_rating: newServiceRating })
      .eq("service_id", service_id);

    if (error) {
      console.error("Error inserting review:", error);
      return res.status(500).json({ error: error.message });
    }

    // Delete the inquiry after successful review submission
    const { error: deleteError } = await supabase
      .from("inquiries")
      .update({ isReviewed: 1 })
      .eq("inquiry_id", inquiry_id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(201).json({ message: "Review submitted and inquiry deleted successfully" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
