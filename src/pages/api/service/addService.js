import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method === "POST") {

        const combined = req.body;

        if (!combined) return res.status(400).json({ error: "Missing serviceId" });

        try {
            const service = combined.service;
            const tiers = combined.tiers;

            await supabase
                .from("services")
                .insert(service);

            const { data, error } = await supabase
                .from("services")
                .select("service_id")
                .eq("business_id", service.business_id)
                .eq("service_name", service.service_name)
                .eq("description", service.description)
                .eq("category_id", service.category_id);

            if (data.length > 0) {
                await supabase
                    .from("tiers")
                    .insert(tiers.map((tier) => ({
                        ...tier,
                        service_id: data[0].service_id,
                    })));
            }

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: "Service added" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    return res.status(500).json({ error: "Invalid Request" });
}