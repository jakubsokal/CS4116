"use client";

import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSessionCheck from "@/utils/hooks/useSessionCheck";

const BusinessProfileEdit = () => {
  const { session, loading } = useSessionCheck();
  const router = useRouter();

  const[formData, setFormData] = useState({
    business_name: "",
    description: "",
    location: "",
    phone_number: "",
    avg_rating: "",
    open_hour: "",
    close_hour: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
   
    if (session?.user?.permission !== 1) return;{
        setFormData({
          business_name: session.business.business_name || "",
          description: session.business.description || "",
          location: session.business.location || "",
          phone_number: session.business.phone_number || "",
          avg_rating: session.business.avg_rating?.toString() ?? "",
          open_hour: session.business.open_hour?.toString() ?? "",
          close_hour: session.business.close_hour?.toString() ?? "",
        });
      }
    }, [session]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session.business?.businessId) return;

    const { error } = await supabase
      .from("business")
      .update({
        business_name: formData.business_name,
        description: formData.description,
        location: formData.location,
        phone_number: formData.phone_number,
        open_hour: formData.open_hour,
        close_hour: formData.close_hour,
      })
      .eq("business_id", business.business_id);

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      router.push("/business/viewProfile");
    }
  };

  if (loading) {
    return (
      <div className="business-profile-wrapper">
        <div className="business-profile-container">
          <p>Loading business information...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="business-profile-wrapper">
      <div className="business-profile-container">
      <h2>Edit Business Profile</h2>
      <form onSubmit={handleSubmit}>

      <div className="business-form-row">
        <label htmlFor="business_name">Business Name</label>
        <input
          type="text"
          name="business_name"
          value={formData.business_name}
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
        <label htmlFor="phone_number">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required />
        </div>

        <div className="business-form-row">
        <label htmlFor="avg_rating">Average Rating</label>
        <input
          type="text"
          name="avg_rating"
          value={formData.avg_rating}
          readOnly />
        </div>

        <div className="business-form-row">
          <label htmlFor="open_hour">Opening Time</label>
          <input
            type="text"
            name="open_hour"
            value={formData.open_hour}
            onChange={handleChange}
            placeholder="Opening Time"
            required />
        </div>

        <div className="business-form-row">
        <label htmlFor="close_hour">Closing Time</label>
          <input
            type="text"
            name="close_hour"
            value={formData.close_hour}
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


export default BusinessProfileEdit;
