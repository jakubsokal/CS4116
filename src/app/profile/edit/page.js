'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSessionCheck from '@/utils/hooks/useSessionCheck';
import Navbar from '@/components/Navbar';
import '@/styles/Profile.css';

export default function EditProfile() {
    const router = useRouter();
    const { session, loading } = useSessionCheck();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (session?.user) {
            setFormData({
                first_name: session.user.first_name || '',
                last_name: session.user.last_name || ''
            });
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        try {
            const response = await fetch('/api/user/updatePassword', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password');
            }

            setPasswordSuccess('Password updated successfully');
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (error) {
            setPasswordError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/user/updateProfileDetails', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: session.user.user_id,
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully');
            setTimeout(() => {
                router.push('/profile');
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!session) {
        router.push('/login');
        return null;
    }

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-content">
                <div className="profile-card">
                    <h2 className="profile-title">Edit Profile</h2>
                    
                    {error && <div className="profile-error">{error}</div>}
                    {success && <div className="profile-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="profile-field">
                            <label className="profile-label" htmlFor="first_name">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="profile-input"
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label" htmlFor="last_name">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="profile-input"
                                required
                            />
                        </div>

                        <div className="profile-actions">
                            <button
                                type="button"
                                onClick={() => router.push('/profile')}
                                className="profile-button profile-button-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="profile-button"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="profile-divider">
                        <h3 className="profile-subtitle">Change Password</h3>
                    </div>

                    {passwordError && <div className="profile-error">{passwordError}</div>}
                    {passwordSuccess && <div className="profile-success">{passwordSuccess}</div>}

                    <form onSubmit={handlePasswordChange} className="profile-form">
                        <div className="profile-field">
                            <label className="profile-label" htmlFor="current_password">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="current_password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                                className="profile-input"
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label" htmlFor="new_password">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                                className="profile-input"
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label className="profile-label" htmlFor="confirm_password">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                                className="profile-input"
                                required
                            />
                        </div>

                        <div className="profile-actions">
                            <button
                                type="submit"
                                className="profile-button"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 