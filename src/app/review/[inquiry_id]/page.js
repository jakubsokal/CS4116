// app/review/[inquiryId]/page.jsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ReviewPage() {
  const { inquiry_id } = useParams();
  const router = useRouter();
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !description) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews/reviewPopup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_id: inquiry_id,
          rating,
          description,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      alert("Review submitted!");
      router.push("/messages"); // or go back to homepage
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Leave a Review</h2>
      <input
        type="number"
        placeholder="Rating (1-5)"
        min={1}
        max={5}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Write your feedback"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <br />
      <button onClick={handleSubmit} disabled={submitting}>
        Submit Review
      </button>
    </div>
  );
}
