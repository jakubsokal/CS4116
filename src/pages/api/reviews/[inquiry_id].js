// pages/review/[inquiry_id].js
import { useRouter } from "next/router";
import { useState } from "react";

export default function ReviewPage() {
  const router = useRouter();
  const { inquiry_id } = router.query;

  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !description) {
      alert("Please complete all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviewPopup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_id, rating, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert("Thank you for your review!");
      router.push("/messages");
    } catch (error) {
      alert("Failed to submit review: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h2>Leave a Review</h2>
      <label>Rating (1–5):</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        disabled={submitting}
      />
      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={submitting}
      />
      <button onClick={handleSubmit} disabled={submitting}>
        Submit
      </button>
    </div>
  );
}
