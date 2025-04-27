import { supabase } from "@/utils/supabase/client";

// /pages/api/inquiries.js
export default async function handler(req, res) {
  if (req.method === "GET") {

    const { receiverId } = req.query;

    const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select(`
      inquiry_id,
      sender_id,
      receiver_id,
      service_id,
      created_at,
      users:sender_id (first_name, last_name)
    `)
    .eq("receiver_id", receiverId)
    .eq("status", 0);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Fetch all services
    const { data: services, error: serviceError } = await supabase
      .from("services")
      .select("service_id, service_name");

    if (serviceError) {
      return res.status(500).json({ error: serviceError.message });
    }

    // Map service_name to each inquiry
    const enrichedInquiries = inquiries.map((inq) => {
      const service = services.find(s => s.service_id === inq.service_id);
      return {
        ...inq,
        service_name: service?.service_name || "Unknown Service"
      };
    });

    return res.status(200).json(enrichedInquiries);
  }

  if (req.method === "PATCH") {
    const { inquiry_id } = req.body;

    const { data, error } = await supabase
      .from("inquiries")
      .update({ status: 1 })
      .eq("inquiry_id", inquiry_id)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Inquiry accepted successfully", inquiry: data });
  }

  if (req.method === "DELETE") {
    const { inquiry_id } = req.body;

    const { error } = await supabase
      .from("inquiries")
      .update({ status: 1 })
      .eq("inquiry_id", inquiry_id);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ message: "Inquiry declined successfully" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
