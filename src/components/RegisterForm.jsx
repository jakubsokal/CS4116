"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/RegisterForm.css";
import { FaUser, FaLock, FaBuilding, FaEnvelope, FaFileUpload, FaSearchLocation, FaDoorOpen, FaDoorClosed } from "react-icons/fa";
import { register } from "@/api/register/register";

const RegisterForm = () => {
    const router = useRouter();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [edited, setEdited] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('No file selected');
    const [isTimePickerClose, setIsTimePickerClose] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const OpenTimeRef = useRef(null);
    const CloseTimeRef = useRef(null);
    const [selectedCloseTime, setSelectedCloseTime] = useState('');
    const [selectedOpenTime, setSelectedOpenTime] = useState('');

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        location: "",
        profilePicture: "",
        phoneNumber: "",
        closeHour: "",
        openHour: ""
    });

    useEffect(() => {
        console.log("Form data changed:", JSON.stringify(formData) === JSON.stringify({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            businessName: "",
            location: "",
            profilePicture: "",
            phoneNumber: "",
            closeHour: "",
            openHour: ""
        }));
    }, [formData]);

    const [isBusiness, setIsBusiness] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEdited(true);
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFormData({ ...formData, profilePicture: uploadedFile });
            setFileName(uploadedFile.name);
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

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            setEdited(false)
            return false;
        }
        if (isBusiness && (!formData.businessName || !formData.location)) {
            setMessage({ type: 'error', text: 'Please fill in all business details' });
            setEdited(false)
            return false;
        }
        if (!isBusiness && (!formData.firstName || !formData.lastName)) {
            setMessage({ type: 'error', text: 'Please fill in all personal details' });
            setEdited(false)
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const result = await register({
                email: formData.email,
                password: formData.password,
                isBusiness: isBusiness,
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                profilePicture: formData.profilePicture,
                phoneNumber: formData.phoneNumber,
                closeHour: formData.closeHour,
                openHour: formData.openHour,
                location: formData.location
            });

            if (result.status === 400 || result.status === 500) {
                throw new Error(result.error);
            }

            setMessage({
                type: 'success',
                text: 'Registration successful! Please check your email to verify your account before logging in.'
            });

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                businessName: "",
                location: "",
            });

            setTimeout(() => {
                router.push(`/register/confirmation-needed?email=${encodeURIComponent(formData.email)}`);
            }, 3000);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            if (!error.message.includes("For security purposes, you can only request this")) {
                setEdited(false)
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleRegistrationType = () => {
        setIsBusiness(!isBusiness);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            businessName: "",
            location: "",
            profilePicture: "",
            phoneNumber: "",
            closeHour: "",
            openHour: ""
        });
        setFileName('No file selected');
        setSelectedCloseTime('');
        setSelectedOpenTime('');
    };

    return (
        <div className="register-wrapper">
            <h1>Create Account</h1>
            <div className="register-error">
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className={`toggle-registration-type ${isBusiness ? "business" : ""}`}>
                <label>
                    <input
                        type="radio"
                        name="registrationType"
                        checked={!isBusiness}
                        onChange={toggleRegistrationType}
                    />
                    <FaUser /> Customer
                </label>
                <label>
                    <input
                        type="radio"
                        name="registrationType"
                        checked={isBusiness}
                        onChange={toggleRegistrationType}
                    />
                    <FaBuilding /> Business
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={`form-fields ${isBusiness ? "business" : "customer"} ${isBusiness ? "active" : ""}`}>
                    <div className="customer-fields">
                        <div className="input-box">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                required={!isBusiness}
                                onChange={handleChange}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                required={!isBusiness}
                                onChange={handleChange}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <label className="cs4116-custom-upload">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {fileName === 'No file selected' ? (
                                    <span>Upload Logo</span>
                                ) : (
                                    <span className="file-name">{fileName}</span>
                                )}
                            </label>
                            <FaFileUpload className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                required
                                onChange={handleChange}
                            />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                required
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                required
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>
                    </div>

                    <div className="business-fields">
                        <div className="input-box">
                            <input
                                type="text"
                                name="businessName"
                                placeholder="Business Name"
                                value={formData.businessName}
                                required={isBusiness}
                                onChange={handleChange}
                            />
                            <FaBuilding className="icon" />
                        </div>
                        <div className="input-box">
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required={isBusiness}
                                className="county-select"
                            >
                                <option value="">Select County</option>
                                {[
                                    "Antrim", "Armagh", "Carlow", "Cavan", "Clare", "Cork", "Derry",
                                    "Donegal", "Down", "Dublin", "Fermanagh", "Galway", "Kerry",
                                    "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford",
                                    "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon",
                                    "Sligo", "Tipperary", "Tyrone", "Waterford", "Westmeath",
                                    "Wexford", "Wicklow"
                                ].map((county) => (
                                    <option key={county} value={county}>
                                        {county}
                                    </option>
                                ))}
                            </select>
                            <FaSearchLocation className="icon" />
                        </div>
                        <div className="input-box">
                            <label className="cs4116-custom-upload">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {fileName === 'No file selected' ? (
                                    <span>Upload Logo</span>
                                ) : (
                                    <span className="file-name">{fileName}</span>
                                )}
                            </label>
                            <FaFileUpload className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber || ""}
                                required={isBusiness}
                                onChange={handleChange}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box" onClick={toggleTimePicker}>
                            Opening Hour
                            <input
                                ref={OpenTimeRef}
                                className={isTimePickerOpen ? "" : "hidden-input"}
                                type="time"
                                name="openHour"
                                value={selectedOpenTime || ""}
                                onChange={handleTimeChange}
                                required={isBusiness}
                            />
                            <FaDoorOpen className="icon" />
                        </div>
                        <div className="input-box" onClick={toggleTimePicker}>
                            Closing Hour
                            <input
                                ref={CloseTimeRef}
                                className={isTimePickerClose ? "" : "hidden-input"}
                                type="time"
                                name="closeHour"
                                value={selectedCloseTime || ""}
                                onChange={handleTimeChange}
                                required={isBusiness}
                            />
                            <FaDoorClosed className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                required
                                onChange={handleChange}
                            />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                required
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                required
                                onChange={handleChange}
                            />
                            <FaLock className="icon" />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`submit-button${isBusiness ? "" : "-customer"}`}
                    disabled={isLoading || !edited || JSON.stringify(formData) === JSON.stringify({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        businessName: "",
                        location: "",
                        profilePicture: "",
                        phoneNumber: "",
                        closeHour: "",
                        openHour: ""
                    })}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
