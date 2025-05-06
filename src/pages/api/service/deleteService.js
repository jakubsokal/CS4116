import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const { service_id } = req.query;

    if (!service_id) return res.status(400).json({ error: "Missing serviceId" });

    try {
        const { data: reviews, error: reviewsFetchError } = await supabase
            .from("reviews")
            .select("review_id")
            .eq("service_id", service_id);

        if (reviewsFetchError) throw reviewsFetchError;

        for (const review of reviews) {
            const { data: reports, error: reportsError } = await supabase
                .from("reported")
                .select("review_id")
                .eq("review_id", review.review_id);

            if (reportsError) throw reportsError;

        if (!reports || reports.length === 0) {
            const { error: deleteReviewError } = await supabase
                    .from("reviews")
                    .delete()
                    .eq("review_id", review.review_id);
            if (deleteReviewError) throw deleteReviewError;
        } else {
            const { error: updateReviewError } = await supabase
                .from("reviews")
                .update({ service_id: null })
                .eq("review_id", review.review_id);
            
            if (updateReviewError) throw updateReviewError;
        }
    }
        const { error: tiersError } = await supabase.from("tiers").delete().eq("service_id", service_id);
        if (tiersError) throw tiersError;

        const { error: reportsError } = await supabase.from("reported").delete().eq("service_id", service_id);

        const { error: inquiriesError } = await supabase.from("inquiries").update({ isDeleted: 1 }).eq("service_id", service_id);
        if (inquiriesError) throw inquiriesError;

        const { error: servicesError } = await supabase.from("services").update({ isDeleted: 1 }).eq("service_id", service_id);
        if (servicesError) throw servicesError;

        return res.status(200).json({ message: "Service and related data deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
