import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: "Missing user ID" });
            }

            const { data: messageRequests, error } = await supabase
                .from("message_request")
                .select("*")
                .eq("receiver_id", userId)
                .eq("status", 0) // Only get pending requests
                .order("created_at", { ascending: false });

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ 
                message: "Message requests fetched successfully",
                data: messageRequests
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error" 
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 