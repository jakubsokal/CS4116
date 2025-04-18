"use client";

import React from "react";
import "@/styles/ReviewPopup.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";

const InquiryPopup = ({ serviceId,receiver_id, onClose }) => {
  const { session, loading } = useSessionCheck(); // logged in user_id

  const handleSendInquiry = async () => {
    const sender_id = session?.user?.user_id;

    // logs to confirm the values exist can check in browser console
    console.log("Sending Inquiry:");
    console.log("Sender ID:", sender_id);
    console.log("Receiver ID:", receiver_id);
    console.log("Service ID:", serviceId);

    if (!sender_id || !serviceId || !receiver_id) {
      console.error("Missing sender, service, or receiver info");
      return;
    }

    try {
      const response = await fetch("/api/sendInquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id,
          receiver_id, 
          service_id: serviceId,
          created_at: new Date().toISOString(),
          status: 0,
        }),
        
      });

      const text = await response.text(); 
  
      const result = JSON.parse(text); 
  
      if (!response.ok) {
        throw new Error(result?.error || "Failed to send inquiry.");
      }
  
      console.log("Inquiry success", result);
      onClose();
    } catch (err) {
      console.error("Inquiry error", err.message);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Send Inquiry</h2>
        <button onClick={handleSendInquiry} disabled={loading}>
          Confirm
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default InquiryPopup;
