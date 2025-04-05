"use client";

import useBusinessSessionCheck from "@/api/business/useBusinessSessionCheck";
import BusinessNavbar from "@/components/BusinessNavbar";
import Loading from "@/components/Loading";
import "@/styles/Business.css";
import "@/styles/style.css";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";

const AddServicePage = () => {
  const { business, loading } = useBusinessSessionCheck();

  const [formData, setFormData] = useState({
    service_name: "",
    category: "",
    description: "",
    location: "",
    //price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!business?.business_id) return;

    const newService = {
      service_name: formData.service_name,
      category_id: parseInt(formData.category),
      description: formData.description,
      location: formData.location,
      business_id: business.business_id,
      //price: parseFloat(formData.price),
    };

    const { data, error } = await supabase
      .from("services")
      .insert([newService])
      .select()

    if (error) {
      console.error("error:", error.message);
    } else {
      console.log("success:", data);

      setFormData({
        service_name: "",
        description: "",
        category: "",
        location: "",
        //price: "",
    });
  }};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading || !business) {
    return (
      <div>
        <BusinessNavbar />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <BusinessNavbar />
      <div className="form-container">
        <h1>Add New Service</h1>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="service_name">Service Name</label>
            <input
              type="text"
              id="service_name"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="1">Soccer</option>
              <option value="2">Football</option>
              <option value="3">Hurling</option>
              <option value="4">Rugby</option>
              <option value="5">Basketball</option>
              <option value="6">Gym</option>
              <option value="7">Swimming</option>
              <option value="8">Running</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              <option value="1">Clare</option>
              <option value="2">Limerick</option>
              <option value="3">Waterford</option>
              <option value="4">Tipperary</option>
              <option value="5">Cork</option>
              <option value="6">Kerry</option>
              <option value="7">Galway</option>
              <option value="8">Kilkenny</option>
              <option value="9">Wexford</option>
              <option value="10">Wicklow</option>
              <option value="11">Dublin</option>
              <option value="12">Kildare</option>
              <option value="13">Meath</option>
            </select>
          </div>

          <button type="submit" className="business-buttons">Add Service</button>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;

