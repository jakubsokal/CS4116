"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import Loading from "@/components/Loading";
import LocationSelection from "@/components/LocationSelection";
import { useEffect, useState } from "react";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Box } from "@mui/system";

import "@/styles/Business.css";
import "@/styles/style.css";
import "@/styles/services.css";

const RemoveServicePage = () => {
  const { session, loading } = useSessionCheck();
  const [services, setServices] = useState([]);
  const [editData, setEditData] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const checkSession = async () => {
        if (session == null) {
          router.push("/login");
        } else if (session.user.permission !== 1) {
          router.push("/");
        }
      };

      const getCategories = async () => {
        const res = await fetch(`/api/service/getCategories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (result.data) {
          setCategories(result.data);
        } else {
          console.error(result.error);
        }
      };

      const getServices = async () => {
        const res = await fetch(`/api/business/getBusinessServices?businessId=${session.business.business_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();

        if (result.data) {
          setServices(result.data);
        } else {
          console.error(result.error);
        }
      };

      if (!loading) {
        await checkSession();
        await getCategories();
        await getServices();
      }
    };
    fetchData();
  }, [session, loading]);

  const handleRemove = async (id) => {

    const res = await fetch(`/api/service/deleteService?service_id=${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();

    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.service_id !== id));
      alert("Service deleted successfully!");
    } else {
      console.error("Delete failed:", result.error);
    }
  };

  const handleEditClick = (service) => {
    setEditData({
      service_id: service.service_id,
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

  const handleServiceUpdate = async () => {

    const res = await fetch(`/api/service/updateServiceDetials`, {
      method: "PATCH",
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData),
    });

    const result = await res.json();


    if (!res.ok) {
      console.error("Update error:", res.error);
    } else {
      alert(result.message);
      setServices(services.map(service =>
        service.service_id === editData.service_id ? { ...service, ...editData } : service
      ));
      setEditData({});
    }
  };

  if (loading) {
    return (
      <div>
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
                  {editData.service_id === service.service_id ? (
                    <>
                      <span className="cs-label">Name:</span>
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
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <FormControl
                            fullWidth
                            margin="normal"
                            sx={{
                              backgroundColor: "transparent",
                              borderRadius: "5px",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <InputLabel
                              id="edit-category-label"
                              sx={{
                                fontWeight: "500",
                                fontSize: "0.9rem",
                                fontStyle: "normal",
                                color: "white",
                                borderColor: "white",
                              }}
                            >
                              Select Category
                            </InputLabel>
                            <Select
                              labelId="edit-category-label"
                              id="edit-category"
                              name="category_id"
                              value={editData.category_id || ""}
                              onChange={handleEditChange}
                              input={<OutlinedInput label="Select Category" />}
                              sx={{
                                background: "#ffffff1a",
                                color: "white",
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff3",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff3",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff3",
                                },
                                "& .MuiSelect-icon": {
                                  color: "white",
                                },
                              }}
                            >
                              {categories.map((category) => (
                                <MenuItem
                                  key={category.category_id}
                                  value={category.category_id}
                                  sx={{
                                    fontSize: "0.9rem",
                                    color: "#333",
                                    "&:hover": {
                                      backgroundColor: "#f0f0f0",
                                    },
                                  }}
                                >
                                  {category.category_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                      <div className="cs-service-fields">
                        <span className="cs-label">Location:</span>
                        <div>
                          <div className="cs-location-service">
                            <LocationSelection
                              value={service.location}
                              onCountyChange={(value) =>
                                setEditData((prev) => ({
                                  ...prev,
                                  location: value,
                                }))
                              }
                              isCustomStyle={true}
                            />
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
                        <span className="cs-value">{categories[service.category_id - 1].category_name}</span>
                      </div>
                      <div className="cs-service-fields">
                        <span className="cs-label">Location:</span>
                        <span className="cs-value">{service.location}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="cs-service-buttons">
                  {editData.service_id === service.service_id ? (
                    <button
                      type="button"
                      className="cs-confirm-services-button"
                      onClick={handleServiceUpdate}
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