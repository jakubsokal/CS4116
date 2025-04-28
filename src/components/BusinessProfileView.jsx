"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import Loading from "@/components/Loading";
import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const BusinessProfileView = () => {
    const router = useRouter();
    const { session, loading } = useSessionCheck();
    const [business, setBusiness] = useState(null);

    useEffect(() => {
        
    if (loading || !session?.user?.permission) return;

    if(!session) {
        router.push("/login");
    } else if (session?.user?.permission !== 1) {
        router.push("/");
    } else {
        const fetchBusiness = async () => {
            const res = await fetch(`/api/business/getBusinessDetails?userId=${session.user.user_id}`);
            const result = await res.json();

            if (res.ok && result.data) {
                setBusiness(result.data);
            }
        };
        fetchBusiness();
        }
    }, [loading, session, router]);
    
if (loading || !business) return <Loading />;

return (
    <div>
    <BusinessNavbar />
    <br />
    <div className="business-profile-wrapper">
        <div className="business-profile-container">
        <h2>Business Profile</h2>

        <div className="business-form-row">
            <strong>Business Name: </strong>
            <input 
                type="text" 
                value={business.business_name || ''} 
                className="business-input" 
                disabled 
            />
        </div>

        <div className="business-form-row">
            <strong>Description: </strong>
            <textarea 
                value={business.description || ''} 
                className="business-input" 
                disabled 
                rows="3"
            />
        </div>

        <div className="business-form-row">
            <strong>Location: </strong>
            <input 
                type="text" 
                value={business.location || ''} 
                className="business-input" 
                disabled 
            />
        </div>

        <div className="business-form-row">
            <strong>Phone Number: </strong>
            <input 
                type="text" 
                value={business.phone_number || ''} 
                className="business-input" 
                disabled 
            />
        </div>

        <div className="business-form-row">
            <strong>Average Rating: </strong>
            <Rating name="half-rating" value={business.avg_rating} precision={0.1} readOnly  />
        </div>

        <div className="business-form-row">
            <strong>Opening Hour: </strong>
            <input 
                type="text" 
                value={business.open_hour || ''} 
                className="business-input" 
                disabled 
            />
        </div>

        <div className="business-form-row">
            <strong>Closing Hour: </strong>
            <input 
                type="text" 
                value={business.close_hour || ''} 
                className="business-input" 
                disabled 
            />
        </div>

        <button className="update-profile-button"
            onClick={() => router.push("/business/editProfile")}
        >
            Edit Profile
        </button>
        </div>
    </div>
    </div>
);
}

export default BusinessProfileView;