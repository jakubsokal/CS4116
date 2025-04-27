"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import Loading from "@/components/Loading";
import "@/styles/Business.css";
import "@/styles/BusinessProfile.css";
import "@/styles/style.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const BusinessProfileView = () => {
    const router = useRouter();
    const { session, loading } = useSessionCheck();
    const [business, setBusiness] = useState(null);

    useEffect(() => {
        
    if (loading) return;

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
            } else {
                console.error("Error fetching business details:", result.error);
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
            <p>{business.business_name}</p>
        </div>

        <div className="business-form-row">
            <strong>Description: </strong>
            <p>{business.description}</p>
        </div>

        <div className="business-form-row">
            <strong>Location: </strong>
            <p>{business.location}</p>
        </div>

        <div className="business-form-row">
            <strong>Phone Number: </strong>
            <p>{business.phone_number}</p>
        </div>

        <div className="business-form-row">
            <strong>Average Rating: </strong>
            <p>{business.avg_rating}</p>
        </div>

        <div className="business-form-row">
            <strong>Opening Hour: </strong>
            <p>{business.open_hour}</p>
        </div>

        <div className="business-form-row">
            <strong>Closing Hour: </strong>
            <p>{business.close_hour}</p>
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