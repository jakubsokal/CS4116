"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/RegisterForm.css";
import { FaUser, FaLock, FaBuilding, FaEnvelope } from "react-icons/fa";
import { register } from "@/api/register/register";

const RegisterForm = () => {
    const router = useRouter();
    const [message, setMessage] = useState({ type: '', text: '' });
    const [edited, setEdited] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

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
        setEdited(true);
        setFormData({ ...formData, [name]: value });
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
            setEdited(false)
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
        });
    };

    return (
        <div className="register-wrapper">
            <h1>Create Account</h1>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

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
                    className="submit-button"
                    disabled={isLoading || !edited || JSON.stringify(formData) === JSON.stringify({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        businessName: "",
                        location: "",
                    })}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
