
import AdminTable from "@/components/InquiryTable";  
import Navbar from "@/components/Navbar";

async function fetchInquiries() {
  const res = await fetch(`/api/inquiries`, {
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
