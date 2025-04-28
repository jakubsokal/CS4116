import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { InquiryId } = req.query
            const { data, error } = await supabase
                .from('inquiries')
                .select(`services:service_id (service_name)`)
                .eq('inquiry_id', InquiryId);
                
                if (error) {
                console.error('Error fetching conversations:', error);
                return res.status(500).json({ error: error.message })
            }
            
            if (!data) {
                return res.status(404).json({ error: "No conversations found" })
            }
            
            return res.status(200).json({ message: "Successful Search", data })

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    }
    return res.status(400).json({ error: "Invalid request" })
}