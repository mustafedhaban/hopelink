"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import "./app.css";

const CallToAction = () => {
  const features = [
    "Complete project transparency",
    "Real-time fund tracking",
    "Automated impact reporting",
    "Stakeholder collaboration tools",
  ];

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="heading-2">Ready to Transform Your NGO?</h2>
            <p className="body-large">
              Join the transparency revolution and build stronger relationships
              with your donors and beneficiaries.
            </p>

            <div className="cta-features">
              {features.map((feature, index) => (
                <div key={index} className="cta-feature">
                  <CheckCircle className="check-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="cta-actions">
              <Button className="btn-primary cta-primary-btn">
                Start Free Trial
                <ArrowRight className="btn-icon" />
              </Button>
              <Button className="btn-secondary cta-secondary-btn">
                <Calendar className="btn-icon" />
                Schedule Demo
              </Button>
            </div>

            <div className="cta-note">
              <p className="caption">
                No credit card required • 30-day free trial • Cancel anytime
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="newsletter-signup">
              <h3
                className="heading-4"
                style={{ marginBottom: "16px", textAlign: "center" }}
              >
                Stay Updated
              </h3>
              <form onSubmit={handleSubscription} className="newsletter-form">
                <Input
                  type="email"
                  placeholder="Enter your email for updates"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="btn-primary newsletter-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="btn-icon animate-spin" />
                  ) : (
                    <ArrowRight className="btn-icon" />
                  )}
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
