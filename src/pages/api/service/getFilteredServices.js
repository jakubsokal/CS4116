import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { words, location, category, minRating, maxRating } = req.query

      let queryBuilder = supabase
      .from("services")
      .select("*")

      if (words) {
      const stopWords = ["and", "or", "the", "a", "an", "of", "in", "on", "at", "to", "for", "with"]
      const filteredWords = words
        .toLowerCase()
        .split(" ")
        .filter((word) => !stopWords.includes(word) && word.trim() !== "")

      if (filteredWords.length > 0) {
        const orCondition = filteredWords
        .map((word) => `service_name.ilike.%${word}%`)
        .join(",")
        queryBuilder = queryBuilder.or(orCondition)
      }
    }

      if (location) {
        queryBuilder = queryBuilder.eq("location", location)
      }

      if (category) {
        const categoriesArray = category.split(",").map(Number);
        queryBuilder = queryBuilder.in('category_id', categoriesArray);
      }

      if (minRating !== undefined && minRating !== null && minRating !== "") {
        queryBuilder = queryBuilder.gte("avg_rating", minRating)
      }

      if (maxRating !== undefined && maxRating !== null && maxRating !== "") {
        queryBuilder = queryBuilder.lte("avg_rating", maxRating)
      }


      const { data, error } = await queryBuilder

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
