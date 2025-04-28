"use client"

import React, { useState } from "react"
import "@/styles/confirmed.css"
import { useRouter } from "next/navigation"

export default function Confirmed() {
    const router = useRouter()
    const [email, setEmail] = useState("");


    const handleReset = async () => {
        try {
            const user = await fetch(`/api/user/getUserDetailsEmail?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!user.ok) throw new Error("User not found");

            const res = await fetch("/api/user/resetPassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const result = await res.json()

            if (!res.ok) throw new Error(result.error || "An unknown error occurred while sending reset link")

            alert("Reset link sent to your email")
            router.push("/login")
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    }

    return (
        <div className="cs4116-confirmed-container">
            <div className="cs4116-confirmed-items">
                <h1 className="cs4116-confirmed-heading">Reset Password</h1>
                <p className="cs4116-confirmed-text">
                    Please enter your email for a link to reset your password.
                </p>
                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        className="cs4116-confirmed-input"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </form>
                <button
                    className="cs4116-confirmed-button"
                    onClick={() => handleReset()}
                >
                    Send Reset Link
                </button>
            </div>
        </div>
    );
}
