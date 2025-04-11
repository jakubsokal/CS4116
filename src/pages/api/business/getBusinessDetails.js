import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { businessId, userId } = req.query

        try {
            const type = userId ? 'user_id' : 'business_id'
            const businessSearch = userId ? userId : businessId

            console.log("type", type)
            console.log("businessSearch", businessSearch)

            const { data } = await supabase
                .from('business')
                .select('*')
                .eq(type, businessSearch)

            return res.status(200).json({ message: "Successful Search", data: data[0] })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}