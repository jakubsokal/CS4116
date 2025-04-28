"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useCallback, useEffect, use } from "react"
import Rating from "@mui/material/Rating"
import Stack from "@mui/material/Stack"
import "@/styles/review.css"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"

export default function ReviewPage() {
  const { inquiry_id } = useParams()
  const router = useRouter()
  const [rating, setRating] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [wait, setWait] = useState(true)
  const [inquiryData, setInquiryData] = useState(null)
  const { session, loading } = useSessionCheck()

  const getInquiryDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/inquiries/getInquiryById?inquiryId=${inquiry_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Failed to fetch inquiry details")

      const data = await res.json()
      setInquiryData(data.data)
      setWait(false)
    }
    catch (err) {
      console.error(err)
      alert(err.message)
      if (err.message === "Failed to fetch inquiry details") router.push("/messages")
    }
  }, [inquiry_id, router])

  useEffect(() => {
    getInquiryDetails()
  }, [getInquiryDetails])

  const handleSubmit = async () => {
    if (!rating || !description) {
      alert("Please fill in all fields")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews/reviewPopup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_id: inquiry_id,
          rating,
          description,
        }),
      })

      if (!res.ok) throw new Error("Failed to submit review")

      alert("Review submitted!")
      router.push("/messages")
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (loading) return

    if (inquiryData?.sender_id !== session?.user?.user_id) {
      router.push("/messages")
    }
  }, [session?.user?.user_id, inquiryData, router, loading])

  useEffect(() => {
    if (loading) return
    if (inquiryData?.isReviewed) {
      alert("You have already submitted a review for this inquiry.")
      router.push("/messages")
    }
  }, [inquiryData, router, loading])

  if (wait || loading) {
    return <Loading />
  }

  return (
    <div className="cs4116-review-container">
      <div className="cs4116-review-items">
        <h2 className="cs4116-review-heading">Please leave a Review</h2>
        <Stack className="cs4116-review-stack">
          <Rating
            className="cs4116-review-rating"
            name="half-rating"
            defaultValue={0}
            precision={0.5}
            onChange={(event, newValue) => setRating(newValue)}
          />
        </Stack>
        <br />
        <textarea
          className="cs4116-review-text"
          placeholder="Write your feedback"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <br />
        <button
          className="cs4116-review-button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Submit Review
        </button>
      </div>
    </div>
  )
}
