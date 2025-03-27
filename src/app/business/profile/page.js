import BusinessNavbar from "@/components/BusinessNavbar";
import BusinessProfile from "@/components/BusinessProfile";
import "@/styles/Business.css";
import "@/styles/style.css";

const BusinessProfilePage = () => {
  return (
    <div>
      <BusinessNavbar />
      <BusinessProfile />
    </div>
  );
};

export default BusinessProfilePage;