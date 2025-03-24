
import AdminTable from "@/components/InquiryTable";  // Import the table component

async function fetchInquiries() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // Adjust for production

  const res = await fetch(`${baseUrl}/api/inquiries`, {
    cache: "no-store", // Ensure fresh data
  });

  if (!res.ok) throw new Error("Failed to fetch inquiries");

  return res.json(); // Returns an array of inquiries
}





export default async function Page() {
  const reports = await fetchInquiries(); // Fetch inquiries from the API

  return (
    <div>
      <h2>View Inquiries</h2>
      <AdminTable reports={reports} />  {/* Pass the fetched inquiries to AdminTable */}
    </div>
  );
}

