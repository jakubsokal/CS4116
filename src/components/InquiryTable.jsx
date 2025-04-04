"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "@/styles/InquiryTable.css";

import ReviewPopup from "./ReviewPopup"; 


const AdminTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);  

  useEffect(() => {
    // Fetching inquiries from API instead of db
    const fetchData = async () => {
      try {
        const response = await fetch("/api/inquiries");
        const data = await response.json();
        setInquiries(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleAction = async (inquiry) => {
    try {
      // Call API insstead of supabase
      const response = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_id: inquiry.inquiry_id, status: 1 }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setSelectedInquiry(inquiry);
      setShowReviewPopup(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDecline = async (inquiryId) => {
    try {
      // delete inquiry
      const response = await fetch("/api/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiry_id: inquiryId }),
      });

      if (!response.ok) throw new Error("Failed to delete inquiry");

      setInquiries(inquiries.filter((inq) => inq.inquiry_id !== inquiryId));
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
              <th>Date</th>
              <th>View Inquiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length > 0 ? (
              inquiries.map((inquiry, index) => (
                <tr key={index}>
                  <td>
                    {inquiry.users?.first_name} {inquiry.users?.last_name}
                  </td>
                  <td>{inquiry.created_at }</td>
                  <td>
                    <a href={`/inquiry/${inquiry.inquiry_id}`} className="btn btn-primary btn-sm">
                      Inquiry details
                    </a>
                  </td>
                  <td>
                    <button className="accept_button" onClick={() => handleAction(inquiry)}>
                      Accept
                    </button>
                    <button className="reject_button" onClick={() => handleDecline(inquiry.inquiry_id)}>
                      Decline
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No inquiries available
                </td>
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

export default AdminTable;
