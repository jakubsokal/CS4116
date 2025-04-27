"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import Loading from "@/components/Loading";
import "@/styles/Business.css";
import "@/styles/style.css";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import LocationSelection from "@/components/LocationSelection";
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import OutlinedInput from "@mui/material/OutlinedInput"

export default function AddServicePage() {
  const { session, loading } = useSessionCheck();
  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCateogry] = useState("");
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  const [onSubmit, setOnSubmit] = useState("")
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const checkSession = async () => {
        if (session == null) {
          router.push("/login")
        } else if (session.user.permission !== 1) {
          router.push("/")
        }
      }

      const getCategories = async () => {
        const res = await fetch(`/api/service/getCategories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await res.json();

        if (result.data) {
          setCategories(result.data);
        } else {
          console.error(result.error);
        }
      }

      async function getServices() {
        if (!business?.business_id) return;
        const res = await fetch(`/api/business/getBusinessServices?businessId=${session.business.business_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await res.json();

        if (result.data) {
          setLogs(result.data);
        }
      }

      if (!loading) {
        await checkSession();
        await getCategories();
        await getServices();
      }
    };

    fetchData();
  }, [loading, session, router, business?.business_id]);

  const [formData, setFormData] = useState({
    service_name: "",
    category: "",
    description: "",
    location: "",
  });

  const [tierData, settierData] = useState([
    {
      service_id: "",
      name: "",
      price: "",
      description: "",
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session.business?.business_id) return;

    const newService = {
      service_name: formData.service_name,
      category_id: selectedCategory,
      description: formData.description,
      location: formData.location,
      business_id: session.business.business_id,
    };

    const tierDetails = tierData.map((tier) => ({
      name: tier.name,
      price: parseFloat(tier.price),
      description: tier.description,
    }));

    const combined = {
      service: newService,
      tiers: tierDetails,
    };

    const res = await fetch(`/api/service/addService`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(combined),
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message)
      setFormData({
        service_name: "",
        description: "",
        category: "",
        location: "",
      });

      setSelectedCateogry("")

      settierData([
        {
          service_id: "",
          name: "",
          price: "",
          description: "",
        }
      ])

      setOnSubmit("Select County")
    } else {
      alert(result.error)
    }
  };

  const CategoryChange = (event) => {
    setSelectedCateogry(event.target.value)
    setIsCategoryDisabled(true)
    setTimeout(() => {
      setIsCategoryDisabled(false)
    }, 600)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTierChange = (e) => {
    const { name, value } = e.target;
    settierData((prev) => {
      const updatedTierData = [...prev];
      const index = parseInt(name.split("-")[1]) - 1;
      updatedTierData[index] = {
        ...updatedTierData[index],
        [name.split("-")[0]]: value,
      };
      return updatedTierData;
    });
  };

  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: e,
    }));

    setOnSubmit("")
  };

  if (loading || !business) {
    <div>
      <BusinessNavbar />
      <Loading />
    </div>
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
                  id="demo-multiple-name-label"
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
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={selectedCategory}
                  onChange={CategoryChange}
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
                      disabled={isCategoryDisabled}
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

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <LocationSelection value={onSubmit} onCountyChange={handleLocationChange} isCustomStyle={true} />
          </div>

          <div className="form-group">
            <label htmlFor="tier">Tiers</label>

            <div className="tier-container">
              {tierData && tierData.map((tier, index) => (
                <div key={index} className="tier-group">
                  <div className="form-group">
                    <label htmlFor={`name-${index + 1}`}>Tier Name</label>
                    <input
                      type="text"
                      id={`name-${index + 1}`}
                      name={`name-${index + 1}`}
                      value={tier.name}
                      onChange={handleTierChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`price-${index + 1}`}>Price</label>
                    <input
                      type="number"
                      id={`price-${index + 1}`}
                      name={`price-${index + 1}`}
                      value={tier.price}
                      onChange={handleTierChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`description-${index + 1}`}>Description</label>
                    <textarea
                      className="form-description"
                      id={`description-${index + 1}`}
                      name={`description-${index + 1}`}
                      value={tier.description}
                      onChange={handleTierChange}
                      required
                    />
                  </div>
                  {tierData && tierData.length > 1 && (
                    <button
                      type="button"
                      className="remove-tier-button"
                      onClick={() => {
                        settierData((prev) => prev.filter((_, i) => i !== index));
                      }}
                    >
                      Remove Tier
                    </button>
                  )}
                </div>
              ))}
              {tierData && tierData.length < 5 && (
                <button
                  type="button"
                  className="add-tier-button"
                  onClick={() => {
                    settierData((prev) => [
                      ...prev,
                      { service_id: "", name: "", price: "", description: "" },
                    ]);
                  }}
                >
                  +
                </button>
              )}
            </div>
          </div>

          <button type="submit" className="business-buttons">Add Service</button>
        </form>
      </div>
    </div>
  );
};

