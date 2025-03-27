"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const BusinessProfileCheck = ({ children }) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkBusinessProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    setIsLoading(false);
                    return;
                }

                const user = session.user;
                const isBusiness = user.user_metadata?.is_business;
                const profileCompleted = user.user_metadata?.profile_completed;

                if (isBusiness && !profileCompleted) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error checking business profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkBusinessProfile();
    }, []);

    const handleCompleteProfile = () => {
        router.push('/business/profile');
    };

    if (isLoading) {
        return null;
    }

    return (
        <>
            {children}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Complete Your Business Profile</h2>
                        <p>Please complete your business profile before continuing to use the website.</p>
                        <button onClick={handleCompleteProfile}>Complete Profile</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BusinessProfileCheck; 