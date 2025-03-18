"use client";

import "@/styles/Business.css";
import { useState } from "react";

const EditProfileForm = () => {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [availability, setAvailability] = useState("Open");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Business Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>Business Name</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter Business Name"
          required
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Business Description"
          required
        ></textarea>

        <label>Contact Details</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter Contact Info"
          required
        />

        <label>Availability</label>
        <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <button type="submit" className="update-btn">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
