import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('reported')
                .select('*')
                .not('message_id', 'is', null)
                .eq('reviewed', 0)
                .order('created_at', { ascending: true })

            return res.status(200).json({ message: "Successful Search", data: data })
        } catch (error) {
            console.error("Error fetching reported messages:", error)
            return res.status(500).json({ error: error.message })
        }
    }
    
    return res.status(400).json({ error: 'Invalid request' })
}