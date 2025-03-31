"use client";

import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import { useState } from "react";

const BusinessProfile = () => {

  const[formData, setFormData] = useState({
    businessName: "",
    description: "",
    location: "",
    phoneNumber: "",
    averageRating: "",
    openingHour: "",
    closingHour: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile Updated");
  };

  return (
    <div className="business-profile-wrapper">
      <div className="business-profile-container">
      <h2>Edit Business Profile</h2>
      <form onSubmit={handleSubmit}>

      <div className="business-form-row">
        <label htmlFor="businessName">Business Name</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          placeholder="Business Name"
          required />
        </div>

        <div className="business-form-row">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Business Description"
          required />
        </div>

        <div className="business-form-row">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Business Location"
          required />
        </div>

        <div className="business-form-row">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required />
        </div>

        <div className="business-form-row">
        <label htmlFor="averageRating">Average Rating</label>
        <input
          type="text"
          name="averageRating"
          value={formData.averageRating}
          readOnly />
        </div>

        <div className="business-form-row">
          <label htmlFor="openTime">Opening Time</label>
          <input
            type="text"
            name="openTime"
            value={formData.openingHour}
            onChange={handleChange}
            placeholder="Opening Time"
            required />
        </div>

        <div className="business-form-row">
        <label htmlFor="closingTime">Closing Time</label>
          <input
            type="text"
            name="closeTime"
            value={formData.closingHour}
            onChange={handleChange}
            placeholder="Closing Time"
            required />
        </div>

        <button type="submit" className="update-profile-button">Update Profile</button>
      </form>
    </div>
  </div>
  );
};


export default BusinessProfile;
