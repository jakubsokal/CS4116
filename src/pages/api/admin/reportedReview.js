import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { adminId, review_id, target_id, reason } = req.body

            await supabase
                .from('reported')
                .update({ reviewed: 1 })
                .eq('review_id', review_id)

            const { data, error } = await supabase
                .from('reviews')
                .update({ isDeleted: 1 })
                .eq('review_id', review_id)

            await supabase
                .from('admin')
                .insert({
                    admin_id: adminId,
                    target_id: target_id,
                    action_taken: 'Removed Review',
                    reason: reason,
                })

            return res.status(200).json({ message: "Review Removed Successfully" })
        } catch (error) {
            console.error("Error fetching reported messages:", error)
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'PATCH') {
        try {

            const { adminId, review_id, target_id, reason } = req.body

            const { data } = await supabase
                .from('reported')
                .update({ reviewed: 1 })
                .eq('review_id', review_id)

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