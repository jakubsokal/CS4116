import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const { businessId } = req.query;

    if (!businessId) return res.status(400).json({ error: "Missing businessId" });

    try {
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .eq("business_id", businessId)
            .eq("isDeleted", 0)
            .order("service_id", { ascending: true });

        if (error) throw error;

        return res.status(200).json({ message: "Services fetched", data });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
