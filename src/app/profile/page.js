'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSessionCheck from '@/utils/hooks/useSessionCheck';
import Navbar from '@/components/Navbar';
import '@/styles/Profile.css';

export default function Profile() {
    const router = useRouter();
    const { session, loading } = useSessionCheck();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (session?.user) {
            setUserData({
                first_name: session.user.first_name || '',
                last_name: session.user.last_name || '',
                email: session.user.email || ''
            });
        }
    }, [session]);

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
                    <h2 className="profile-title">Profile</h2>
                    
                    <div className="profile-field">
                        <label className="profile-label">First Name</label>
                        <input
                            type="text"
                            value={userData?.first_name || ''}
                            className="profile-input"
                            disabled
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-label">Last Name</label>
                        <input
                            type="text"
                            value={userData?.last_name || ''}
                            className="profile-input"
                            disabled
                        />
                    </div>

                    <div className="profile-field">
                        <label className="profile-label">Email</label>
                        <input
                            type="email"
                            value={userData?.email || ''}
                            className="profile-input"
                            disabled
                        />
                    </div>

                    <div className="profile-actions">
                        <button
                            onClick={() => router.push('/profile/edit')}
                            className="profile-button"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 