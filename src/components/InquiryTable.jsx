"use client";

import React from "react";
import "@/styles/InquiryTable.css"
/*The reports will be replaced with db data when its created */
const AdminTable = ({reports}) => {

    return(
        <div className="container  .mx-auto ">
          <div className="heading">
        <h2 >View Your Service Inquiries:</h2>
      </div>
      <div className="table">
            <table className="table table-striped table-bordered ">
            <thead className="table">
          <tr>
            <th >Name</th>
            <th>Service </th>
            <th>Date</th>
            <th>View Inquiry</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr key={index}>
                <td>{report.business}</td>
                <td>{report.service}</td>
                <td>{report.date}</td>
                <td>
                  <a href={report.reviewLink} className="btn btn-primary btn-sm">
                    Inquiry details
                  </a>
                </td>
                <td>
                  
                  <button className="accept_button">Accept</button>
                  <button className="reject_button">Decline</button>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No reports available
              </td>
            </tr>
          )}
        </tbody>
            </table>
        </div>
        </div>
    );
};
export default AdminTable;