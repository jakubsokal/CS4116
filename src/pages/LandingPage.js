"use client"

import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import useSessionCheck from "@/utils/hooks/useSessionCheck";

const LandingPage = () => {
  const { loading } = useSessionCheck()
  
  if(loading) {
    return <Loading/>
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
          <a href="#" className="find-out-more">Find Out More</a>
        </div>

        <div className="suggestion">
          <h2>Fitness Class</h2>
          <p>Join our dynamic Fitness Class to build strength, improve endurance, and stay motivated. Achieve your fitness goals with expert-led sessions.</p>
          <a href="#" className="find-out-more">Find Out More</a>
        </div>

        <div className="suggestion">
          <h2>ProMotion Soccer</h2>
          <p>Elevate your game with ProMotion Soccer`s strength and conditioning—built for speed, power, and endurance. Enhance your performance now!</p>
          <a href="#" className="find-out-more">Find Out More</a>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
