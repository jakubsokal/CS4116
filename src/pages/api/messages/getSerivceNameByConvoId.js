import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { InquiryId } = req.query;

            if (!InquiryId) {
                return res.status(400).json({ error: "Missing InquiryId parameter" });
            }

            const { data, error } = await supabase
                .from("inquiries")
                .select(`
                    inquiry_id,
                    service_id,
                    services:service_id (
                        service_name
                    )
                `)
                .eq("inquiry_id", InquiryId);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
} 