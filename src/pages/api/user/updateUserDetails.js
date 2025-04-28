import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        const { user_id, first_name, last_name } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Missing user_id" });
        }

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    first_name,
                    last_name
                })
                .eq('user_id', user_id);

            if (error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ message: "User details updated successfully" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(400).json({ error: 'Invalid request' });
} 