"use client"

import React, { useState } from 'react'

const AdminSearch = () => {
    const [details, setDetails] = useState("")
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    const handleSearch = async (e) => {
        e.preventDefault()
        setError("")
        const endpoint = search.includes('@') ? 'getUserDetailsEmail' : 'getUserDetailsId'
        const type = endpoint === 'getUserDetailsEmail' ? 'email' : 'userId'

        const res = await fetch(`/api/user/${endpoint}?${type}=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const result = await res.json();
        if (res.ok) {
            if (result.data) {
                setDetails(result.data);
            } else {
                setError("No user found")
            }
        }
    }
    
    return (
        <div className="cs4116-admin-search">
            <div className="cs4116-admin-search-item">
                {error && <p className="cs4116-admin-search-error">{error}</p>}
                <p className="cs4116-admin-text">
                    Here you can search users by their email or user ID
                </p>
                <form className="cs4116-admin-from" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by email or user ID"
                        className="cs4116-admin-input"
                        onChange={(e) => setSearch(e.target.value.trim())}
                        required
                    />
                    <button type="submit" className="cs4116-admin-button">
                        Search
                    </button>
                </form>
                <div className="cs4116-admin-logs">
                    <table className="cs4116-admin-search-table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Warnings</th>
                                <th>Last Used</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details ? (
                                <tr>
                                    <td>{details.user_id}</td>
                                    <td>{details.name.trim()}</td>
                                    <td>{details.email}</td>
                                    <td>{details.permission === 0 ? "Customer" : details.permission === 1 ? "Business" : "Admin"}</td>
                                    <td>{details.status === 1 ? "Active" : "Banned"}</td>
                                    <td>{details.warnings}</td>
                                    <td>{new Date(details.last_used).toLocaleString()}</td>
                                    <td>{new Date(details.created_at).toLocaleString()}</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminSearch
