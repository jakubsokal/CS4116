"use client"

import Navbar from '@/components/Navbar'
import useSessionCheck from '@/utils/hooks/useSessionCheck'
import { useState, useEffect, useCallback } from 'react'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'
import AdminSearch from '@/components/AdminSearch'
import "@/styles/admin.css"

export default function Messages() {
    const [load, setLoading] = useState(false)
    const [reports, setReports] = useState([])
    const [currentSession, setSession] = useState([])
    const [userDetails, setUserDetails] = useState([])
    const { session, loading } = useSessionCheck()
    const router = useRouter()


    const getReported = useCallback(async () => {
        setLoading(true)

        try {
            const res = await fetch(`/api/admin/getReportedReviews`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await res.json()

            if (result.data) {
                setReports(result.data)
            }
        } catch (error) {
            console.error("Error searching for reports:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (loading) {
            return
        }

        if (session) {
            setSession(session)
        } else {
            router.push('/login')
        }

        if (currentSession.user?.user_id) {
            getReported()
        }
    }, [currentSession?.user?.user_id, getReported, session, router, loading])

    const handleOnDecline = async (reportid) => {
        const res = await fetch(`/api/admin/declineReportedReview?reportId=${reportid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const result = await res.json()

        if (result) {
            alert(result.message)
            setUserDetails(result.data)
            getReported()
        }
    }

    const handleOnRemove = async (reportid) => {
        const res = await fetch(`/api/admin/deleteReportedReview?reportId=${reportid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const result = await res.json()

        if (result.data) {
            alert(result.message)
            setUserDetails(result.data)
            getReported()
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <Navbar />
            <div className="cs4116-admin-container">
                <AdminSearch />
                <div className="cs4116-admin-logs">
                    <h2 className="cs4116-admin-logs-title">Reported Reviews</h2>
                    <table className="cs4116-admin-logs-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Review ID</th>
                                <th>Target ID</th>
                                <th>Reported By</th>
                                <th>Contents</th>
                                <th>Reason</th>
                                <th>Date</th>
                                <th>Actions</th>
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
                                    <td>{new Date(report.created_at).toLocaleString().split(",")[0]}<br /> {new Date(report.created_at).toLocaleString().split(",")[1]}</td>
                                    <td className="cs4116-buttons">
                                        <button
                                            className="cs4116-review-ban-btn"
                                            onClick={() => handleOnRemove(report.report_id)}
                                        >Remove
                                        </button>
                                        <button
                                            className="cs4116-review-decline-btn"
                                            onClick={() => handleOnDecline(report.report_id)}
                                        >Decline
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 