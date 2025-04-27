import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method === "PATCH") {
        const data = req.body;

        if (!data) return res.status(400).json({ error: "Missing businessId" });

        try {
            const { error } = await supabase
                .from("business")
                .update({
                    business_name: data.business_name,
                    description: data.description,
                    location: data.location,
                    phone_number: data.phone_number,
                    avg_rating: data.avg_rating,
                    open_hour: data.open_hour,
                    close_hour: data.close_hour,
                })
                .eq("business_id", data.business_id);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: `Business ${data.business_name} updated` });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}