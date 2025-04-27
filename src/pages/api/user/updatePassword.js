import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'PATCH') {
        const { email, current_password, new_password } = req.body;

        if (!email || !current_password || !new_password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: current_password
            });

            if (signInError) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: new_password
            });

            if (updateError) {
                return res.status(500).json({ error: updateError.message });
            }

            return res.status(200).json({ message: "Password updated successfully" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
} 