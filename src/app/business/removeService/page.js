"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import Loading from "@/components/Loading";
import LocationSelection from "@/components/LocationSelection";
import "@/styles/Business.css";
import "@/styles/style.css";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import useSessionCheck from "@/utils/hooks/useSessionCheck";


const RemoveServicePage = () => {
  const { session, loading } = useSessionCheck();
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});

  const locationRef = useRef(null);

  const categoryMap = {
    1: "Soccer",
    2: "Football",
    3: "Hurling",
    4: "Rugby",
    5: "Basketball",
    6: "Gym",
    7: "Swimming",
    8: "Running"
  };

  useEffect(() => {
    if (session?.user?.permission !== 1) return;

    const fetchServices = async () => {
      const res = await fetch(`/api/business/getBusinessServices?business_id=1`);
      const result = await res.json();
      if (result.data) {
        setServices(result.data);
      } else {
        console.error(result.error);
      }
    };
    fetchServices();
  }, [session]);

  // location dropdown
  useEffect(() => {
    if (editing === null) return;

    const observer = new MutationObserver(() => {
      const selected = locationRef.current?.querySelector('[role="button"]')?.innerText;
      if (selected && selected !== editData.location) {
        setEditData((prev) => ({ ...prev, location: selected }));
      }
    });

    if (locationRef.current) {
      observer.observe(locationRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [editing, editData.location]);


  const handleRemove = async (id) => {

    const res = await fetch(`/api/service/getServiceDetails?service_id=${id}`, {
      method: "DELETE",
    });
    const result = await res.json();

    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.service_id !== id));
    } else {
      console.error("Delete failed:", result.error);
    }
  };

  const handleEditClick = (service) => {
    setEditing(service.service_id);
    setEditData({
      service_name: service.service_name,
      description: service.description,
      category_id: service.category_id,
      location: service.location
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === "category_id" ? parseInt(value) : value
    }));
  };

  const handleConfirm = async () => {
    const { error } = await supabase
      .from("services")
      .update({
        service_name: editData.service_name,
        description: editData.description,
        category_id: editData.category_id,
        location: editData.location
      })
      .eq("service_id", editing);

    if (error) {
      console.error("Update error:", error.message);
    } else {
      setServices(services.map(service =>
        service.service_id === editing ? { ...service, ...editData } : service
      ));
      setEditing(null);
    }
  };

  if (loading) {
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
      <br />
      <div className="services-container">
        <h1>Current Services</h1>
        {services.length === 0 ? (
          <p className="cs-no-services">You have no services available at the moment</p>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service.service_id} className="service-item">
                <div className="service-info">
                  {editing === service.service_id ? (
                    <>
                      <input
                        type="text"
                        name="service_name"
                        value={editData.service_name}
                        onChange={handleEditChange}
                        className="cs-input"
                      />
                      <div className="cs-service-fields">
                        <span className="cs-label">Description:</span>
                        <textarea
                          name="description"
                          value={editData.description}
                          onChange={handleEditChange}
                          className="cs-input"
                        />
                      </div>

                      <div className="cs-service-fields">
                        <span className="cs-label">Category:</span>
                        <select
                          name="category_id"
                          value={editData.category_id || ""}
                          onChange={handleEditChange}
                          className="cs-input"
                        >
                          <option value="">Select a category</option>
                          {Object.entries(categoryMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="cs-service-fields">
                        <span className="cs-label">Location:</span>
                        <div ref={locationRef}>
                          <div className="cs-location-service">
                            <LocationSelection />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{service.service_name}</h3>
                      <div className="cs-service-fields">
                        <span className="cs-label">Description:</span>
                        <span className="cs-value">{service.description}</span>
                      </div>
                      <div className="cs-service-fields">
                        <span className="cs-label">Category:</span>
                        <span className="cs-value">{categoryMap[service.category_id]}</span>
                      </div>
                      <div className="cs-service-fields">
                        <span className="cs-label">Location:</span>
                        <span className="cs-value">{service.location}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="cs-service-buttons">
                  {editing === service.service_id ? (
                    <button
                      type="button"
                      className="cs-confirm-services-button"
                      onClick={handleConfirm}
                    >
                      Confirm Changes
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="cs-remove-services-button"
                        onClick={() => handleRemove(service.service_id)}
                      >
                        Remove Service
                      </button>
                      <button
                        type="button"
                        className="cs-edit-services-button"
                        onClick={() => handleEditClick(service)}
                      >
                        Edit Service
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveServicePage;