import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query
        try {
            const { data } = await supabase
                .from('users')
                .select('user_id, first_name, last_name')
                .eq('user_id', userId)
            
            const combinedData = data.map(user => ({
                user_id: userId,
                name: `${user.first_name} ${user.last_name}`,
            }))

            return res.status(200).json({ message: "Successful Search", data: combinedData[0] })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    
    return res.status(400).json({ error: 'Invalid request' })
}