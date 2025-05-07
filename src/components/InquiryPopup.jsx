"use client";

import React from "react";
import "@/styles/ReviewPopup.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";

const InquiryPopup = ({ serviceId, receiver_id, onClose }) => {
  const { session, loading } = useSessionCheck(); // logged in user_id

  const handleSendInquiry = async () => {
    const sender_id = session?.user?.user_id;

    if (!sender_id || !serviceId || !receiver_id) {
      console.error("Missing sender, service, or receiver info");
      return;
    }
    try {
      const response = await fetch("/api/inquiries/sendInquiry", {
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

      if (!response.ok) {
        throw new Error("Failed to send inquiry.");
      }

      const text = await response.text();

      const result = JSON.parse(text);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to send inquiry.");
      }

      console.log("Inquiry sent successfully", result);
      const res = await fetch("/api/conversations/createConversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: session?.user?.user_id,
          receiver_id: receiver_id,
          inquiry_id: result.inquiry.inquiry_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create conversation.");
      }

      console.log("Inquiry success");
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
