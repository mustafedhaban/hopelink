import React from "react";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from "lucide-react";
import "./app.css";

const footerLinks = {
  product: ["Features", "Pricing", "Demo", "Security"],
  company: ["About Us", "Careers", "Blog", "Contact"],
  resources: ["Documentation", "Support", "Community", "API"],
  legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
};

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-contact-section">
            <div className="footer-contact-content">
              <div className="footer-brand">
                <h3 className="brand-logo">HopeLink</h3>
                <p className="footer-description">
                  Empowering NGOs with transparent project management and building trust through accountability.
                </p>

                <div className="footer-contact">
                  <div className="contact-item">
                    <Mail className="contact-icon" />
                    <span>hello@hopelink.org</span>
                  </div>
                  <div className="contact-item">
                    <Phone className="contact-icon" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <MapPin className="contact-icon" />
                    <span>New York, NY 10001</span>
                  </div>
                </div>

                <div className="footer-social">
                  <a href="#" className="social-link"><Twitter className="social-icon" /></a>
                  <a href="#" className="social-link"><Linkedin className="social-icon" /></a>
                  <a href="#" className="social-link"><Facebook className="social-icon" /></a>
                </div>
              </div>

            
            </div>
          </div>

          <div className="footer-main">
            <div className="footer-links">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div className="footer-column" key={title}>
                  <h4 className="footer-title">{title.charAt(0).toUpperCase() + title.slice(1)}</h4>
                  <ul className="footer-list">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="footer-link">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          
        </div>
        <div className="footer-bottom">
            <div className="footer-divider" />
            <div className="footer-copyright">
              <p className="caption">
                © 2024 HopeLink. All rights reserved. Built with transparency in mind.
              </p>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
