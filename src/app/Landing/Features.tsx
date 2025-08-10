import React from "react";
import {
  Eye,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle
} from "lucide-react";
import "./app.css";

const features = [
  { id: 1, icon: "eye", title: "Transparent Reporting", description: "Real-time project updates visible to donors." },
  { id: 2, icon: "file-text", title: "Smart Documentation", description: "Automatically organize NGO paperwork." },
  { id: 3, icon: "trending-up", title: "Impact Analytics", description: "Visualize outcomes and progress easily." },
  { id: 4, icon: "users", title: "Donor CRM", description: "Manage donor relationships in one place." },
  { id: 5, icon: "dollar-sign", title: "Funding Tracker", description: "Track donations and expenses clearly." },
  { id: 6, icon: "check-circle", title: "Audit-Ready Logs", description: "Every action tracked for accountability." }
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  eye: Eye,
  "file-text": FileText,
  "trending-up": TrendingUp,
  users: Users,
  "dollar-sign": DollarSign,
  "check-circle": CheckCircle
};

const Features: React.FC = () => {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-2">Powerful Features for NGO Success</h2>
          <p className="body-large">
            Everything you need to manage projects transparently and build lasting trust with your stakeholders.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || CheckCircle;
            return (
              <div key={feature.id} className="service-card">
                <div className="feature-icon-container">
                  <Icon className="feature-icon" />
                </div>
                <h3 className="service-card-title">{feature.title}</h3>
                <p className="service-card-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
