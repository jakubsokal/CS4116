import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { adminId, userDetails, reason } = req.body
        const type = userDetails.includes('@') ? 'email' : 'user_id'
        try {
            const { data } = await supabase
                .from('users')
                .select('user_id, warnings, status')
                .eq(type, userDetails)
                .single()

            if (data == null) {
                return res.status(404).json({ error: "User not found" })
            } else if (data.status === 0) {
                return res.status(403).json({ error: "User is already banned" })
            }

            await supabase
                .from('users')
                .update({ status: 0 })
                .eq(type, userDetails)

            await supabase
                .from('admin')
                .insert({
                    admin_id: adminId,
                    target_id: data.user_id,
                    action_taken: 'Banned',
                    reason: reason,
                })

            return res.status(200).json({ message: "User banned successfully" })
        } catch (error) {
            console.error("Error banning user:", error)
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}