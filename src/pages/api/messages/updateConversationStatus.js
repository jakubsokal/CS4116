import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "PATCH") {
        try {
            const { chat_id } = req.body;

            if (!chat_id) {
                return res.status(400).json({ error: "Missing chat_id parameter" });
            }

            const { data, error } = await supabase
                .from("conversations")
                .update({ isClosed: 1 })
                .eq("convo_id", chat_id)
                .select()
                .single();

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ 
                message: "Conversation marked as closed successfully", 
                data: data 
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error" 
            });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
} 