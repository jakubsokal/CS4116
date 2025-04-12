import { supabase } from '@/utils/supabase/client'
import { COMPILER_NAMES } from 'next/dist/shared/lib/constants';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const report = req.body.report

        if (!report || !report.userReview.review_id || !report.userReview.user_id) {
            return res.status(400).json({ error: 'Invalid report data' });
        }

        try {
            const { error } = await supabase
                .from('reported')
                .insert([
                    {
                        review_id: report.userReview.review_id,
                        contents: report.userReview.description,
                        user_id: report.userReview.user_id,
                        reported_by: report.reported.user_id,
                        reason: "Inappropriate Content",
                    },
                ]);

            if (error) {
                console.error('Error inserting report:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: "Successful Report" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}