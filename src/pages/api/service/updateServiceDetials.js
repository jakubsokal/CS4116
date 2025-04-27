import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method === "PATCH") {
        const data = req.body;
        
        if (!data) return res.status(400).json({ error: "Missing serviceId" });

        try {
            const { error } = await supabase
                .from("services")
                .update({
                    service_name: data.service_name,
                    description: data.description,
                    category_id: data.category_id,
                    location: data.location
                })
                .eq("service_id", data.service_id);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: `Service ${data.service_name} updated` });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    return res.status(500).json({ error: "Invalid Request" });
}