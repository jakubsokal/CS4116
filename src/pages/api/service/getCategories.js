import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {

            const data = await supabase
                .from("category")
                .select("*")
               

            return res.status(200).json({...data, message: "Select all categories" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    return res.status(500).json({ error: "Invalid Request" });
}