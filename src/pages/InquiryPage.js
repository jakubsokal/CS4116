"use client";
import AdminTable from "@/components/InquiryTable";

import Navbar from "@/components/Navbar";

/*This array will be removed when db is implemnted */
const AdminReport = () => {
    const reports = [
        { business: "Bob Ryan", service: "Personal Training", date: "2025-03-10", reviewLink: "/review/1" },
        { business: "Sinead O'Boyle", service: "Yoga Class", date: "2025-03-08", reviewLink: "/review/2" },
        { business: "Hannah Montanna", service: "Smoothie Making", date: "2025-03-09", reviewLink: "/review/2" },
        { business: "Ryan Renaults", service: "Sports Massage", date: "2025-04-14", reviewLink: "/review/2" }
      ];
    
    return(
        <div>
            <Navbar />
            <br></br>
            <div >
                <AdminTable reports={reports}/>
            </div>
        </div>
    );
};
export default AdminReport;