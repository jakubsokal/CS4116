import BusinessNavbar from "@/components/BusinessNavbar";
import "@/styles/Business.css";
import "@/styles/style.css";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <div className="landing-page">
      <BusinessNavbar />

      <section className="header">
        <div className="hero-content">
          <div className="text-box">
            <h1>Manage Your Business</h1>
          </div>
        </div>
      </section>

      <section className="business-actions">
        <div className="action">
          <h2>Add Service</h2>
          <p>Expand your offerings by adding new services to your business profile.</p>
          <Link href="/addService" className="business-buttons">Add Service</Link>
        </div>

        <div className="action">
          <h2>Remove Service</h2>
          <p>Remove services you no longer offer to keep your profile up to date.</p>
          <Link href="/removeService" className="business-buttons">Remove Service</Link>
        </div>

        <div className="action">
          <h2>Messages</h2>
          <p>Stay in touch with your clients and respond to inquiries</p>
          <Link href="/messages" className="business-buttons">Check Messages</Link>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 PeakPerformance. All Rights Reserved.</p>
      </footer>
    </div>
  );
} 