"use client"

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LandingPage = () => {
  const { session, loading } = useSessionCheck();
  const router = useRouter();

  useEffect(() => {

    if (!loading && session?.user?.permission != null) {
      const permission = session.user.permission;
      if (permission === 1) {
        router.push("/business");
      } else if (permission === 2) {
        router.push("/admin");
      }
    }
}, [loading, session, router]);

  const handleFindOutMore = () => {
    if (!loading) {
      if (session != null) {
        router.push("/explore")
      } else {
        router.push("/login")
      }
    }
  };

  if (loading) {
    return <Loading />;
  }
  
return (
    <div>

      <Navbar />

      <section className="header">
        <div className="hero-content">
          <div className="text-box">
            <h1>Peak Performance, Unlocked</h1>
          </div>
        </div>
      </section>

      <section className="suggestions">
        <div className="suggestion">
          <h2>Prime Physio</h2>
          <p>Recover faster and perform better with Prime Physio—expert treatment for rapid recovery and optimal performance.</p>
          <button className="find-out-more" onClick={handleFindOutMore}>Find Out More</button>
        </div>

        <div className="suggestion">
          <h2>Fitness Class</h2>
          <p>Join our dynamic Fitness Class to build strength, improve endurance, and stay motivated. Achieve your fitness goals with expert-led sessions.</p>
          <button className="find-out-more" onClick={handleFindOutMore}>Find Out More</button>
        </div>

        <div className="suggestion">
          <h2>ProMotion Soccer</h2>
          <p>Elevate your game with ProMotion Soccer`s strength and conditioning—built for speed, power, and endurance. Enhance your performance now!</p>
          <button className="find-out-more" onClick={handleFindOutMore}>Find Out More</button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
