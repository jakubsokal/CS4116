"use client";

import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import BusinessNavbar from "./BusinessNavbar";
import Loading from "./Loading";
import "@/styles/editProfile.css";
import LocationSelection from "./LocationSelection";

const BusinessProfileEdit = () => {
  const { session, loading } = useSessionCheck();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({
    business_name: "",
    description: "",
    location: "",
    phone_number: "",
    open_hour: "",
    close_hour: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isTimePickerClose, setIsTimePickerClose] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const OpenTimeRef = useRef(null);
  const CloseTimeRef = useRef(null);
  const [selectedCloseTime, setSelectedCloseTime] = useState('');
  const [selectedOpenTime, setSelectedOpenTime] = useState('');
  const [onSubmit, setOnSubmit] = useState("")

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
            open_hour: result.data.open_hour?.toString() ?? "",
            close_hour: result.data.close_hour?.toString() ?? "",
          });
          setSelectedOpenTime(result.data.open_hour?.toString() ?? "");
          setSelectedCloseTime(result.data.close_hour?.toString() ?? "");
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
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!business?.business_id) return;

    try {
      const res = await fetch("/api/business/updateBusinessDetails", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ business_id: business.business_id, ...formData }),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push("/business/viewProfile");
        }, 2000);
      } else {
        setError("Failed to update profile");
        console.error(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/user/updatePassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess('Password updated successfully');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === "openHour") {
      setSelectedOpenTime(value);
      setFormData({ ...formData, openHour: value });
    } else if (name === "closeHour") {
      setSelectedCloseTime(value);
      setFormData({ ...formData, closeHour: value });
    }
  };

  const toggleTimePicker = () => {
    if (!isTimePickerClose) {
      setIsTimePickerClose(true);
      setTimeout(() => {
        if (CloseTimeRef.current) {
          CloseTimeRef.current.showPicker();
        }
      }, 0);
    } else if (!isTimePickerOpen) {
      setIsTimePickerOpen(true);
      setTimeout(() => {
        if (OpenTimeRef.current) {
          OpenTimeRef.current.showPicker();
        }
      }, 0);
    }
  };

  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: e,
    }));

    setOnSubmit("")
  };

  if (loading || !business) return <Loading />;

  return (
    <div>
      <BusinessNavbar />
      <br />
      <div className="business-profile-wrapper">
        <div className="business-profile-container">
          <h2>Edit Business Profile</h2>

          {error && <div className="business-error">{error}</div>}
          {success && <div className="business-success">{success}</div>}

          <form className="cs4116-edit-form" onSubmit={handleSubmit}>
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
            <LocationSelection value={onSubmit} onCountyChange={handleLocationChange} isCustomStyle={true} />
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

            <div className="business-form-row" onClick={toggleTimePicker}>
              <label htmlFor="open_hour">Opening Time</label>
              <input
                ref={OpenTimeRef}
                type="time"
                name="open_hour"
                value={selectedOpenTime || ""}
                onChange={handleTimeChange}
                placeholder="Opening Time"
                required />
            </div>

            <div className="business-form-row" onClick={toggleTimePicker}>
              <label htmlFor="close_hour">Closing Time</label>
              <input
                ref={CloseTimeRef}
                className={isTimePickerClose ? "" : "hidden-input"}
                type="time"
                name="closeHour"
                value={selectedCloseTime || ""}
                onChange={handleTimeChange}
                required
              />
            </div>

            <button type="submit" className="update-profile-button">Update Profile</button>
          </form>

          <div className="business-divider">
            <h3 className="business-subtitle">Change Password</h3>
          </div>

          {passwordError && <div className="business-error">{passwordError}</div>}
          {passwordSuccess && <div className="business-success">{passwordSuccess}</div>}

          <form className="cs4116-edit-form" onSubmit={handlePasswordSubmit}>
            <div className="business-form-row">
              <label htmlFor="current_password">Current Password</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="business-form-row">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="business-form-row">
              <label htmlFor="confirm_password">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className="update-profile-button">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileEdit;
