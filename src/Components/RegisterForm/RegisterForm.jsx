import React, { useState } from 'react';
import './RegisterForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const interestsOptions = [
    "Physiotherapy", "Gym", "Personal Trainer", "Psychologist", "Nutritionist", "Sauna", "Ice Bath", "Yoga", "General Fitness",
    "Running", "Hurling", "Football", "Soccer", "Rugby", "Tennis"
];

const RegisterForm = () => {
    const navigate = useNavigate();
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
        navigate("/");
    };

    return (
        <div className='register-wrapper'>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="input-box">
                    <input type="text" name="name" placeholder='Name' required onChange={handleChange} />
                </div>
                <div className="input-box">
                    <input type="text" name="username" placeholder='Username' required onChange={handleChange} />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input type="password" name="password" placeholder='Password' required onChange={handleChange} />
                    <FaLock className='icon' />
                </div>

                <div className="interests-section">
                    <h3>Select Your Interests:</h3>
                    <div className="interests-options">
                        {interestsOptions.map((interest, index) => (
                            <label key={index} className="interest-label">
                                <input 
                                    type="checkbox" 
                                    name="interests" 
                                    value={interest} 
                                    onChange={handleChange} 
                                />
                                {interest}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
