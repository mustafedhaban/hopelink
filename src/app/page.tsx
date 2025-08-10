import React from "react";
import Navigation from "@/components/layout/navigation";
import Hero from "./Landing/Hero";
import Features from "./Landing/Features";
import Benefits from "./Landing/Benefits";
import CallToAction from "./Landing/CallToAction";
import Footer from "./Landing/Footer";
import ContactForm from "./Landing/ContactForm";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <CallToAction />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
