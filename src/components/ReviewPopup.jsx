import React, { useState } from "react";
import { supabase } from "@/lib/supabaseclient";
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
  
  // Insert the review into the database
  const { error } = await supabase.from("reviews").insert([{
    review_id: inquiry.inquiry_id,
    user_id: inquiry.sender_id,  // User ID
    service_id: inquiry.reciever_id, // The service ID
    description: description,
    rating: rating,
  }]);

  if (error) {
    console.error("Error submitting review:", error);
    alert("Error submitting review!");
  } else {
    alert("Review submitted successfully!");
    
    // After submitting the review, inquiry gets deleted
    const { error: deleteError } = await supabase
      .from("inquiries")
      .delete()
      .eq("inquiry_id", inquiry.inquiry_id);

    if (deleteError) {
      console.error("Error deleting inquiry:", deleteError);
      alert("Error deleting inquiry after review!");
    } else {
      alert("Inquiry deleted after review submission.");
    }

    setShowReviewPopup(false); 
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
