"use client"

import Navbar from "@/components/Navbar"
import Loading from "@/components/Loading"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "@/styles/admin.css"
import AdminSearch from "@/components/AdminSearch"

export default function AdminDashboard() {
    const [logs, setLogs] = useState([])
    const { session, loading } = useSessionCheck()
    const router = useRouter()
    const [userAction, setUserAction] = useState("")
    const [reason, setReason] = useState("")
    const [sessionLoading, setSessionLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const checkSession = async () => {
                if (session == null) {
                    router.push("/login")
                } else if (session.user.permission !== 2) {
                    router.push("/")
                }
            }
            async function getLogs() {
                const res = await fetch(`/api/admin/getAdminLogs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await res.json();

                if (result.data) {
                    setLogs(result.data);
                }
            }

            if (!loading) {
                await checkSession();
                getLogs();
                setSessionLoading(false);
            }
        };

        fetchData();
    }, [loading, session, router]);

    const handleWarnUser = async (e) => {
        e.preventDefault()
        const res = await fetch(`/api/admin/warnUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId: session.user.user_id, userDetails: userAction, reason: reason }),
        });

        const result = await res.json();

        if (res.ok) {
            alert(result.message)
        } else {
            alert(result.error)
        }
    }

    const handleBanUser = async (e) => {
        e.preventDefault()
        const res = await fetch(`/api/admin/banUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminId: session.user.user_id, userDetails: userAction, reason: reason }),
        });

        const result = await res.json();

        if (res.ok) {
            alert("User banned successfully")
        } else {
            alert(result.error)
        }
    }

    if (loading || sessionLoading) {
        return <Loading />
    }

    return (
        <div>
            <Navbar />
            <div className="cs4116-admin-container">
                <AdminSearch/>
                <div className="cs4116-admin-controls">
                    <div className="cs4116-admin-item">
                        <p className="cs4116-admin-text">
                            Here you can warn a user using their email or user ID
                        </p>
                        <form className="cs4116-admin-from-small" onSubmit={handleWarnUser}>
                            <input
                                type="text"
                                placeholder="Warn user by email or user ID"
                                className="cs4116-admin-input-small"
                                onChange={(e) => setUserAction(e.target.value.trim())}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Reason"
                                className="cs4116-admin-input-small"
                                onChange={(e) => setReason(e.target.value.trim())}
                                required
                            />
                            <button type="submit" className="cs4116-admin-button">
                                Warn user
                            </button>
                        </form>
                    </div>
                    <div className="cs4116-admin-item">
                        <p className="cs4116-admin-text">
                            Here you can ban a user using their email or user ID
                        </p>
                        <form className="cs4116-admin-from-small" onSubmit={handleBanUser}>
                            <input
                                type="text"
                                placeholder="Ban user by email or user ID"
                                className="cs4116-admin-input-small"
                                onChange={(e) => setUserAction(e.target.value.trim())}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Reason"
                                className="cs4116-admin-input-small"
                                onChange={(e) => setReason(e.target.value.trim())}
                                required
                            />
                            <button type="submit" className="cs4116-admin-button">
                                Ban user
                            </button>
                        </form>
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
                        <button
                            className="cs4116-admin-button"
                            onClick={() => router.push("/admin/reported/reviews")}
                        >
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