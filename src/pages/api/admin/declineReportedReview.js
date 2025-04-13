import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const reportId = req.query.reportId
        console.log(reportId)
        try {
            const { data ,error } = await supabase
                .from('reported')
                .delete()
                .eq('report_id', reportId)

            if (error) {
                console.error('Error inserting report:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ data: data, message: "Successful Declined Report" })
        } catch (error) {
            console.error('Error inserting report:', error);
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}