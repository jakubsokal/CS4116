"use client"

import Navbar from "@/components/Navbar"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "@/styles/admin.css"

export default function AdminDashboard() {
    const [logs, setLogs] = useState([])
    const { session, loading, status } = useSessionCheck()
    const router = useRouter()

    useEffect(() => {
        async function getLogs() {
            const res = await fetch(`/api/admin/getAdminLogs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await res.json();

            console.log("Admin logs:", result.data)

            if (result.data) {
                setLogs(result.data);
            }
        }

        if (!loading) {
            getLogs();
        }
    }, [loading]);

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <Navbar />
            <div className="cs4116-admin-container">
                <div className="cs4116-admin-controls">
                    <div className="cs4116-admin-item">
                        <p className="cs4116-admin-text">
                            Here you can ban a user using their email or user ID
                        </p>
                        <button className="cs4116-admin-button">
                            Ban user
                        </button>
                    </div>
                    <div className="cs4116-admin-item">
                        <p className="cs4116-admin-text">
                            Here you view reported messages
                        </p>
                        <button className="cs4116-admin-button">
                            Reported Messages
                        </button>
                    </div>
                    <div className="cs4116-admin-item">
                        <p className="cs4116-admin-text">
                            Here you can view reported reviews
                        </p>
                        <button className="cs4116-admin-button">
                            Reported reviews
                        </button>
                    </div>
                </div>
                <div className="cs4116-admin-logs">
                    <h2 className="cs4116-admin-logs-title">Admin Logs</h2>
                    <table className="cs4116-admin-logs-table">
                        <thead>
                            <tr>
                                <th>Log ID</th>
                                <th>Admin ID</th>
                                <th>Target ID</th>
                                <th>Reason</th>
                                <th>Action</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={`${log.action_id}-${index}`}>
                                    <td>{log.log_id}</td>
                                    <td>{log.admin_id}</td>
                                    <td>{log.target_id}</td>
                                    <td>{log.reason}</td>
                                    <td>{log.action_taken == 1 ? "User Banned" : log.action_taken == 2 ? "Removed Review" : log.action_taken == 3 ? "Removed Message" : "No Action"}</td>
                                    <td>{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}