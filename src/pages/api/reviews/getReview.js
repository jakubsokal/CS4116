import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { serviceId } = req.body

        try {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('service_id', serviceId)

            return res.status(200).json({ message: "Successful Search", data: data })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}