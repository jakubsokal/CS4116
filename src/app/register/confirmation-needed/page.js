"use client"

import React, { Suspense } from "react"
import "@/styles/confirmed.css"
import { useSearchParams } from "next/navigation"
import Loading from "@/components/Loading"

export default function ConfirmationNeeded() {
    return (
        <Suspense fallback={<Loading />}>
            <ConfirmationNeededPage />
        </Suspense>
    )
}

const ConfirmationNeededPage = () => {
    const searchParams = useSearchParams()
    const handleResendEmail = async () => { 
        const email = searchParams.get("email").replace(/%40/g, "@");
        const response = await fetch("/api/user/resend-confirmation-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json()

        if (response.ok) {
            alert(result.message)
        } else {
            alert(result.error)
        }
    }
    return (
        <div className="cs4116-confirmed-container">
            <div className="cs4116-confirmed-items">
                <h1 className="cs4116-confirmed-heading">Please check your email</h1>
                <p className="cs4116-confirmed-text">
                    Please check your email for a confirmation link. If you do not see it in your inbox, please check your spam folder.
                </p>
                <p onClick={handleResendEmail} className="cs4116-confirmed-text href">
                    If you have not recived the confirmation email, click here.
                </p>
            </div>
        </div>
    );
}
