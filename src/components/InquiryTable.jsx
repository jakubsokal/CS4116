"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "@/styles/InquiryTable.css";
import { supabase } from "@/lib/supabaseclient";
import ReviewPopup from "./ReviewPopup"; 

/*for now i have it that:
1)business accpepts inquiry = status cahnges to 1, pop up is generated asking for a review 
2)once a user submits a reviw added to reviews table (now they are verified) and the inquiry is removed from inquiries
3)if bsuiness declines the inquiry is deleted
future changes:
1)the pop up will have to be on client side rn its on same page as inquiry
2)view inquiry detials will open the chat page 
3)the review should be linked to a service not the business will have to change that once added*/

const AdminTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);  

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select(`
          inquiry_id,
          sender_id,
          receiver_id,
          created_at,
          users:sender_id (first_name, last_name)
        `);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setInquiries(data);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (inquiry) => {  
    const { data, error } = await supabase
      .from("inquiries")
      .update({ status: 1 })
      .eq("inquiry_id", inquiry.inquiry_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating status:", error);
    } else {
      setSelectedInquiry(inquiry);  
      setShowReviewPopup(true);  // Show the review pop-up
    }
  };

  const handleDecline = async (inquiryId) => {
    const { error } = await supabase.from("inquiries").delete().eq("inquiry_id", inquiryId);
    if (!error) {
      setInquiries(inquiries.filter((inq) => inq.inquiry_id !== inquiryId));
    } else {
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
