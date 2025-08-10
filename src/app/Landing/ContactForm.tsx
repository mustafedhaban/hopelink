import React from "react";
import { Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import "./app.css";

const ContactForm: React.FC = () => {
  return (
    <div className="contact-form">
      <h3 className="heading-3">Get in Touch</h3>
      <p className="body-medium" style={{ marginBottom: "24px", color: "var(--text-secondary)" }}>
        Ready to transform your NGO? Contact us to learn more about HopeLink.
      </p>

      <form className="contact-form-fields">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="organization" className="form-label">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            className="form-input"
            placeholder="Your organization name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            placeholder="Tell us about your NGO and how we can help..."
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="btn-primary contact-submit-btn">
          Send Message
          <Send className="btn-icon" />
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
