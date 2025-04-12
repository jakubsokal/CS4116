"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import "@/styles/Business.css";
import { useRouter } from "next/navigation";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import Loading from "@/components/Loading";

const BusinessProfileView = () => {
    const router = useRouter();
    const { session, loading } = useSessionCheck();

    if (loading || !session) {
    return (
    <div>
        <Loading />
    </div>
    );
}

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
};

export default BusinessProfileView;