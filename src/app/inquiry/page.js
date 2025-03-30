
import AdminTable from "@/components/InquiryTable";  

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
      <h2>View Inquiries</h2>
      <AdminTable reports={reports} />  {}
    </div>
  );
}