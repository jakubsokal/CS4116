"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import BusinessProfileEdit from "@/components/BusinessProfileEdit";
import "@/styles/Business.css";
import "@/styles/style.css";

const EditBusinessProfilePage = () => {

  return (
    <div>
      <BusinessNavbar />
      <BusinessProfileEdit/>
    </div>
  );
};

export default EditBusinessProfilePage;