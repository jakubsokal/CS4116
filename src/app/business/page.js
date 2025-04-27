"use client";

import BusinessNavbar from "@/components/BusinessNavbar";
import "@/styles/Business.css";
import "@/styles/style.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { useEffect } from "react";
import Loading from "@/components/Loading";

export default function BusinessPage() {
  const router = useRouter();
  const { session, loading } = useSessionCheck();

  useEffect(() => {
    if (loading) return;
    if (session?.user?.permission !== 1) {
      router.push("/");
    }else if(session == null) {
      router.push("/login");
    }
  }, [session, loading, router]);

  if (loading) {
    return <Loading />
  }
  
  return (
    <div className="landing-page">
      <BusinessNavbar />

      <section className="header">
        <div className="hero-content">
          <div className="cs-text-box">
            <h1>Manage Your Business</h1>
          </div>
        </div>
      </section>

      <section className="business-actions">
        <div className="action">
          <h2>Add Service</h2>
          <p>Expand your offerings by adding new services to your business profile.</p>
          <Link href="/business/service/add" className="business-buttons">Add Service</Link>
        </div>

        <div className="action">
          <h2>Manage Service</h2>
          <p>Manage your service by either editing its features or removing it</p>
          <Link href="/business/service/manage" className="business-buttons">Manage Service</Link>
        </div>

        <div className="action">
          <h2>View Inquiries</h2>
          <p>View inquiries of potential new clients who are interested in your services.</p>
          <Link href="/inquiry" className="business-buttons">View Inquiries</Link>
        </div>
      </section>
    </div>
  );
}