import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const { service_id } = req.query;

    if (!service_id) return res.status(400).json({ error: "Missing serviceId" });

    try {

        const { error: reviewsError } = await supabase.from("reviews").delete().eq("service_id", service_id);
        if (reviewsError) throw reviewsError;

        const { error: tiersError } = await supabase.from("tiers").delete().eq("service_id", service_id);
        if (tiersError) throw tiersError;

        const { error: inquiriesError } = await supabase.from("inquiries").delete().eq("service_id", service_id);
        if (inquiriesError) throw inquiriesError;

        const { error: servicesError } = await supabase.from("services").delete().eq("service_id", service_id);
        if (servicesError) throw servicesError;

        return res.status(200).json({ message: "Service and related data deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
