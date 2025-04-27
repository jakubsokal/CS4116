"use client"

import Navbar from "@/components/Navbar"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "@/styles/admin.css"
import "@/styles/Chat.css"

export default function AdminDashboard() {
    const [reports, setReports] = useState([])
    const { session, loading } = useSessionCheck()
    const router = useRouter()
    const [sessionLoading, setSessionLoading] = useState(true);
    const [reportReason, setReportReason] = useState("");
    const [report_id, setReportId] = useState("");
    const [review_id, setReviewId] = useState("");
    const [user_id, setUserId] = useState("");
    const [removeModal, setRemoveModalOpen] = useState(false);
    const [dismissModal, setDismissModalOpen] = useState(false);
    
    const removeReasons = [
        "Inappropriate Content",
        "Spam",
        "Harassment",
        "Offensive Language"
    ];

    const dismissReasons = [
        "Not Spam",
        "Not Harassment",
        "Not Offensive",
        "Not Inappropriate"
    ]

    useEffect(() => {
        const fetchData = async () => {
            const checkSession = async () => {
                if (session == null) {
                    router.push("/login")
                } else if (session.user.permission !== 2) {
                    router.push("/")
                }
            }
            async function getReports() {
                const res = await fetch(`/api/admin/getReportedReviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await res.json();

                if (result.data) {
                    setReports(result.data);
                }
            }

            if (!loading) {
                await checkSession();
                getReports();
                setSessionLoading(false);
            }
        };

        fetchData();
    }, [loading, session, router]);

    const handleRemove = async (report_id, review_id, target_id, reason) => {
        setRemoveModalOpen(false);
        const res = await fetch(`/api/admin/reportedReview`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId: session.user.user_id, report_id: report_id, review_id: review_id, target_id: target_id, reason: reason })
        });

        const result = await res.json();

        if (result) {
            setReportReason("");
            alert("Message Removed Successfully")
            setReports((prevReports) => {
                return prevReports.filter((report) => report.report_id !== report_id);
            })

        } else {
            console.error("Error removing message:", result);
        }
    }

    const handleOnOpenRemove = (report_id, review_id, target_id) => {
        setReportId(report_id);
        setReviewId(review_id);
        setUserId(target_id);
        setRemoveModalOpen(true);
    }

    const handleOnOpenDismiss = (report_id, review_id, target_id) => {
        setReportId(report_id);
        setReviewId(review_id);
        setUserId(target_id);
        setDismissModalOpen(true);
    }

    const handleDismiss = async (report_id, review_id, target_id, reason) => {
        setDismissModalOpen(false);
        const res = await fetch(`/api/admin/reportedReview`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId: session.user.user_id, report_id: report_id, review_id: review_id, target_id: target_id, reason: reason })
        });

        const result = await res.json();

        if (result) {
            setReportReason("");
            alert("Report Dismissed Successfully")
            setReports((prevReports) => {
                return prevReports.filter((report) => report.report_id !== report_id);
            })

        } else {
            console.error("Error dismissing report:", result);
        }
    }

    if (loading || sessionLoading) {
        return <Loading />
    }

    return (
        <div>
            <Navbar />
            <div className="cs4116-admin-container">
                <div className="cs4116-admin-logs">
                    <h2 className="cs4116-admin-logs-title">Reported Reviews</h2>
                    <table className="cs4116-admin-logs-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Review ID</th>
                                <th>Target ID</th>
                                <th>Reported by</th>
                                <th>Contents</th>
                                <th>Reason</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={`${report.report_id}-${index}`}>
                                    <td>{report.report_id}</td>
                                    <td>{report.review_id}</td>
                                    <td>{report.user_id}</td>
                                    <td>{report.reported_by}</td>
                                    <td>{report.contents}</td>
                                    <td>{report.reason}</td>
                                    <td>{new Date(report.created_at).toLocaleDateString('en-GB')}</td>
                                    <td>
                                        <div className="cs4116-admin-reported-message-container">
                                            <button className="cs4116-admin-reported-message-remove-button" onClick={() => handleOnOpenRemove(report.report_id, report.review_id, report.user_id)}>Remove</button>
                                            <button className="cs4116-admin-reported-message-dismiss-button" onClick={() => handleOnOpenDismiss(report.report_id, report.review_id, report.user_id)}>Dismiss</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {removeModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Remove Message</h3>
                            {removeReasons.map((reason) => (
                                <label key={reason} className="report-reason-option" style={{color: 'black'}}>
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                    />
                                    {reason}
                                </label>
                            ))}
                            <p>Are you sure you want to remove this message?</p>
                            <div className="modal-buttons">
                                <button onClick={() => setRemoveModalOpen(false)}>Cancel</button>
                                <button onClick={() => {
                                     if (reportReason !== "") {
                                        handleRemove(report_id, review_id, user_id, reportReason);
                                    } else {
                                        alert("Please select a reason before removing the message.");
                                    }
                                }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {dismissModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Dismiss Report</h3>
                            {dismissReasons.map((reason) => (
                                <label key={reason} className="report-reason-option" style={{color: 'black'}}>
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                    />
                                    {reason}
                                </label>
                            ))}
                            <p>Are you sure you want to dismiss this report?</p>
                            <div className="modal-buttons">
                                <button onClick={() => setDismissModalOpen(false)}>Cancel</button>
                                <button
                                    onClick={() => {
                                        if (reportReason !== "") {
                                            handleDismiss(report_id, review_id, user_id, reportReason);
                                        } else {
                                            alert("Please select a reason before dismissing the report.");
                                        }
                                    }}
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}