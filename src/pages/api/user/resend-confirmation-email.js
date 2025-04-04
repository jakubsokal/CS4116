import { supabase } from '@/utils/supabase/client'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                  emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
                }
              })

              if (error) {
                return res.status(400).json({ error: error.message })
              }

            return res.status(200).json({ message: "Resent confirmation email successfully" })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    
    return res.status(400).json({ error: 'Invalid request' })
}