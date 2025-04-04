"use client"

import React from "react"
import "@/styles/confirmed.css"
import { useRouter } from "next/navigation"

export default function Confirmed() {
  const router = useRouter()
  return (
    <div className="cs4116-confirmed-container">
      <div className="cs4116-confirmed-items">
        <h1 className="cs4116-confirmed-heading">Email Confirmed</h1>
        <p className="cs4116-confirmed-text">
          Thank you for confirming your email address.
        </p>
        <p onClick={() => router.push("/login")} className="cs4116-confirmed-text href">
          Click here to login now!.
        </p>
      </div>
    </div>
  );
}
