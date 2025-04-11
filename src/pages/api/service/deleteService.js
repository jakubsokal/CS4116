import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const { service_id } = req.query;

    if (!serviceId) return res.status(400).json({ error: "Missing serviceId" });

    try {

        await supabase.from("reviews").delete().eq("service_id", service_id);

        await supabase.from("tiers").delete().eq("service_id", service_id);

        const { error } = await supabase.from("services").delete().eq("service_id", service_id);

        if (error) throw error;

        return res.status(200).json({ message: "Service and related data deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
