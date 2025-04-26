import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { adminId, message_id, target_id, reason } = req.body

            await supabase
                .from('reported')
                .update({ reviewed: 1 })
                .eq('message_id', message_id)

            const { error } = await supabase
                .from('message')
                .update({ isDeleted: 1 })
                .eq('message_id', message_id)

            if (error) {
                console.error("Error deleting message:", error)
            }

            await supabase
                .from('admin')
                .insert({
                    admin_id: adminId,
                    target_id: target_id,
                    action_taken: 'Removed Message',
                    reason: reason,
                })

            return res.status(200).json({ message: "Message Removed Successfully" })
        } catch (error) {
            console.error("Error fetching reported messages:", error)
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'PATCH') {
        try {
            const { adminId, message_id, target_id, reason } = req.body

            const { data } = await supabase
                .from('reported')
                .update({ reviewed: 1 })
                .eq('message_id', message_id)

            await supabase
                .from('admin')
                .insert({
                    admin_id: adminId,
                    target_id: target_id,
                    action_taken: 'Dismissed a Report',
                    reason: reason,
                })


            return res.status(200).json({ message: "Successful Search", data: data })
        } catch (error) {
            console.error("Error fetching reported messages:", error)
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: 'Invalid request' })
}