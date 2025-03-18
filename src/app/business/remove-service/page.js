"use client";

import { useState } from "react";
import BusinessNavbar from "@/components/BusinessNavbar";
import "@/styles/Business.css";
import "@/styles/style.css";

export default function RemoveServicePage() {
  // Mock data - replace with actual data fetching
  const [services, setServices] = useState([
    { id: 1, name: "Personal Training", category: "Gym", price: "€50/hour" },
    { id: 2, name: "Swimming Lessons", category: "Swimming", price: "€30/hour" },
    { id: 3, name: "Soccer Training", category: "Soccer", price: "€40/hour" },
  ]);

  const handleRemove = (id) => {
    // TODO: Implement actual service removal logic
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div>
      <BusinessNavbar />
      <div className="services-container">
        <h1>Remove Services</h1>
        {services.length === 0 ? (
          <p className="no-services">No services available</p>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-item">
                <div className="service-info">
                  <h3>{service.name}</h3>
                  <p>Category: {service.category}</p>
                  <p>Price: {service.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(service.id)}
                  className="remove-button"
                >
                  Remove Service
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 