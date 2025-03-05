"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import "@/styles/RegisterForm.css";
import { FaUser, FaLock } from "react-icons/fa";

const RegisterForm = () => {
    const router = useRouter(); 
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        interests: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                interests: checked
                    ? [...prevData.interests, value]
                    : prevData.interests.filter(interest => interest !== value)
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User Data Submitted:", formData);
        router.push("/"); 
    };

    return (
        <div className="register-wrapper">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                </div>
                <div className="input-box">
                    <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input type="text" name="email" placeholder="Email" required onChange={handleChange} />
                </div>
                <div className="input-box">
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    <FaLock className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" name="password" placeholder="Confirm Password" required onChange={handleChange} />
                    <FaLock className="icon" />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
