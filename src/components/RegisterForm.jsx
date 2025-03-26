"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/RegisterForm.css";
import { FaUser, FaLock, FaBuilding, FaEnvelope } from "react-icons/fa";

const RegisterForm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        businessName: "",
        location: "",
    });

    const [isBusiness, setIsBusiness] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLocationChange = (location) => {
        setFormData({ ...formData, location });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User Data Submitted:", formData);
        router.push("/");
    };

    const toggleRegistrationType = () => {
        setIsBusiness(!isBusiness);
    };

    return (
        <div className="register-wrapper">
            <h1>Create Account</h1>

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
                                required
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
                                required
                                onChange={handleChange}
                            />
                            <FaUser className="icon" />
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
                                required
                                onChange={handleChange}
                            />
                            <FaBuilding className="icon" />
                        </div>
                        <div className="input-box">
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
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

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
