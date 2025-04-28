import { supabase } from '@/utils/supabase/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: '/login',
        })

        if (error) {
            console.error('Error sending password reset email:', error);
            return res.status(500).json({ error: error.message });
        }
        if (!data) {
            return res.status(404).json({ error: 'No data found' });
        }

        return res.status(200).json({ message: 'Password reset email sent successfully', data });
    }
}
