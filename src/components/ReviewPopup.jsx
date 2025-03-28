import React, { useState } from "react";

import "@/styles/ReviewPopup.css";

//takes the inquiry detials from inquiry Pop-Up
const ReviewPopup = ({ inquiry, setShowReviewPopup }) => {
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
//ensures a rating + descrption are entered
const handleSubmit = async () => {
  if (!rating || !description) {
    alert("Please fill in all fields!");
    return;
  }
//updated to do
  try {
    const response = await fetch("/api/reviewPopup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inquiry_id: inquiry.inquiry_id,  
        description,
        rating,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit review");
    }

    alert("Review submitted successfully, and inquiry deleted.");
    setShowReviewPopup(false);
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
};

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Leave a Review</h2>
        <label>Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rate (1-5)"
        />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your review"
        />
        <button onClick={handleSubmit}>Submit Review</button>
        <button onClick={() => setShowReviewPopup(false)}>Close</button>
      </div>
    </div>
  );
};

export default ReviewPopup;
