

import { supabase } from "@/lib/supabaseclient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("inquiries").select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
