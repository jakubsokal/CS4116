"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import "@/styles/Business.css";
import "@/styles/style.css";
import { useState } from "react";

const AddServicePage = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    category: "",
    price: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Service data:", formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <BusinessNavbar />
      <div className="form-container">
        <h1>Add New Service</h1>
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
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
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="soccer">Soccer</option>
              <option value="football">Football</option>
              <option value="hurling">Hurling</option>
              <option value="rugby">Rugby</option>
              <option value="basketball">Basketball</option>
              <option value="gym">Gym</option>
              <option value="swimming">Swimming</option>
              <option value="running">Running</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (€)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="5"
              required
            />
          </div>

          <button type="submit" className="business-buttons">Add Service</button>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage;