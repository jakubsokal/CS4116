"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "@/styles/InquiryTable.css";

import ReviewPopup from "./ReviewPopup";
import useSessionCheck from "@/utils/hooks/useSessionCheck";

const InquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const { session } = useSessionCheck();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/inquiries/inquiries?receiverId=${session?.user?.user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await response.json();

        if (response.ok) {
          setInquiries(data);
          
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    if (session?.user?.user_id) {
      fetchData();
    }
  }, [session]);

  const handleAccept = async (inquiry) => {
    try {


      const res = await fetch("/api/inquiries/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_id: inquiry.inquiry_id,
        }),
      });

      if (!res.ok) throw new Error("Failed to update inquiry status");
      
      const result = await res.json();
      alert(result.message);

      setInquiries(prev => prev.filter(inq => inq.inquiry_id !== inquiry.inquiry_id));
    } catch (error) {
      console.error("Error handling accept:", error);
      alert(error.message);
    }
  };

  const handleDecline = async (inquiryId) => {
    try {
      const response = await fetch("/api/inquiries/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_id: inquiryId }),
      });

      if (!response.ok) throw new Error("Failed to decline inquiry");

      const result = await response.json();
      alert(result.message);

      setInquiries(prev => prev.filter(inq => inq.inquiry_id !== inquiryId));
    } catch (error) {
      console.error("Error handling decline:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="heading">
        <h2>View Your Service Inquiries:</h2>
      </div>
      <div className="table">
        <table className="table table-striped table-bordered">
          <thead className="table">
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry, index) => (
                <tr key={index}>
                  <td>{inquiry.users?.first_name} {inquiry.users?.last_name}</td>
                  <td>{inquiry.service_name}</td>
                  <td>{inquiry.created_at}</td>
                  <td>
                    <button className="accept_button" onClick={() => handleAccept(inquiry)}>Accept</button>
                    <button className="reject_button" onClick={() => handleDecline(inquiry.inquiry_id)}>Decline</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No inquiries available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showReviewPopup && (
        <ReviewPopup
          inquiry={selectedInquiry}
          setShowReviewPopup={setShowReviewPopup}
        />
      )}
    </div>
  );
};

export default InquiryTable;
