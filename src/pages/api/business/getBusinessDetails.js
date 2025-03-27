import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { businessId } = req.body

        try {
            const { data } = await supabase
                .from('business')
                .select('*')
                .eq('business_id', businessId)

            return res.status(200).json({ message: "Successful Search", data: data[0] })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}