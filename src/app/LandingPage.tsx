import React from "react";
import Header from "./Landing/Header";
import Hero from "./Landing/Hero";
import Features from "./Landing/Features";
import Benefits from "./Landing/Benefits";
import CallToAction from "./Landing/CallToAction";
import Footer from "./Landing/Footer";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <Features />
      <Benefits />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;