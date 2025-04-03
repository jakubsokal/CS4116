

import AdminTable from "@/components/InquiryTable";  
import Navbar from "@/components/Navbar";

async function fetchInquiries() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 

  const res = await fetch(`${baseUrl}/api/inquiries`, {
    cache: "no-store", 
  });

  if (!res.ok) throw new Error("Failed to fetch inquiries");

  return res.json(); 
}

export default async function Page() {
  const reports = await fetchInquiries(); 

  return (
    <div>
      <Navbar />
      <AdminTable/>
      
    </div>
  );
}