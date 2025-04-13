import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {

        try {
            const { data ,error } = await supabase
                .from('reported')
                .select('*')
                .eq('reviewed', 0)
                .not('review_id', 'is', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error inserting report:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ data: data, message: "Successful Report" })
        } catch (error) {
            console.error('Error inserting report:', error);
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}