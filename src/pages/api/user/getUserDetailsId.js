import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { userId } = req.query
        try {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', userId)

            const combinedData = data.map(user => ({
                user_id: userId,
                name: `${user.first_name} ${user.last_name}`,
                image: user.profile_picture,
                email: user.email,
                permission: user.permission,
                last_used: user.last_used,
                status: user.status,
                warnings: user.warnings,
                created_at: user.created_at,
            }))

            return res.status(200).json({ message: "Successful Search", data: combinedData[0] })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}