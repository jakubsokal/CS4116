"use client";

import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BusinessNavbar from "./BusinessNavbar";
import Loading from "./Loading";

const BusinessProfileEdit = () => {
  const { session, loading } = useSessionCheck();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const[formData, setFormData] = useState({
    business_name: "",
    description: "",
    location: "",
    phone_number: "",
    avg_rating: "",
    open_hour: "",
    close_hour: "",
  });

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
    } else if (session?.user?.permission !== 1) {
      router.push("/");
    } else {
      const fetchBusiness = async () => {
        const res = await fetch(`/api/business/getBusinessDetails?userId=${session.user.user_id}`);
        const result = await res.json();
        
        if (res.ok && result.data) {
          setBusiness(result.data);
        
        setFormData({
          business_name: result.data.business_name || "",
          description: result.data.description || "",
          location: result.data.location || "",
          phone_number: result.data.phone_number || "",
          avg_rating: result.data.avg_rating?.toString() ?? "",
          open_hour: result.data.open_hour?.toString() ?? "",
          close_hour: result.data.close_hour?.toString() ?? "",
        });
      }
    };
    fetchBusiness();
    }
  }, [loading, session, router]);


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!business?.business_id) return;

    const res = await fetch("/api/business/updateBusinessDetails", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business_id: business.business_id, ...formData }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Profile updated!");
      router.push("/business/viewProfile");
    } else {
      alert("Failed to update profile");
      console.error(result.error);
    }
  };

  if (loading || !business) return <Loading />;

  return (
    <div>
      <BusinessNavbar />
    <br />
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
          name="phone_number"
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
  </div>
  );
};


export default BusinessProfileEdit;
