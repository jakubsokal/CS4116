import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { words } = req.query
      const stopWords = ["and", "or", "the", "a", "an", "of", "in", "on", "at", "to", "for", "with"]

      const filteredWords = words
        .toLowerCase()
        .split(" ")
        .filter((word) => !stopWords.includes(word) && word.trim() !== "")

      if (filteredWords.length === 0) {
        return res.status(400).json({ error: "Please enter more specific search terms." })
      }

      const orCondition = filteredWords
        .map((word) => `service_name.ilike.%${word}%`)
        .join(",")

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .or(orCondition)

      if (error) {
        throw new Error(error.message)
      }

      return res.status(200).json({ message: "Successful Search", data: data })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(400).json({ error: "Invalid request" })
}
