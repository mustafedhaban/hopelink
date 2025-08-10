import React from "react";
import {
  Heart,
  Award,
  Globe,
  Zap,
} from "lucide-react";
import "./app.css";

const Benefits = () => {
  const staticBenefits = [
    {
      id: 1,
      icon: "heart",
      title: "Build Donor Trust",
      description:
        "Show real-time impact and project transparency to increase credibility."
    },
    {
      id: 2,
      icon: "award",
      title: "Track Project Outcomes",
      description:
        "Monitor progress across initiatives with automated dashboards and reports."
    },
    {
      id: 3,
      icon: "globe",
      title: "Global Collaboration",
      description:
        "Empower teams across regions to coordinate efforts seamlessly."
    },
    {
      id: 4,
      icon: "zap",
      title: "Save Time & Resources",
      description:
        "Automate repetitive reporting and admin tasks so you can focus on impact."
    }
  ];

  const staticProjects = [
    {
      id: 101,
      name: "Clean Water for All",
      progress: 80,
      funding: 120000,
      status: "active"
    },
    {
      id: 102,
      name: "Educate Her Initiative",
      progress: 65,
      funding: 85000,
      status: "active"
    },
    {
      id: 103,
      name: "Tree Reforestation",
      progress: 95,
      funding: 60000,
      status: "completed"
    }
  ];

  const iconMap = {
    heart: Heart,
    award: Award,
    globe: Globe,
    zap: Zap
  };

  const getIconComponent = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap] || Heart;
    return <Icon className="benefit-icon" />;
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const totalFunding = staticProjects.reduce(
    (total, project) => total + project.funding,
    0
  );

  const activeProjects = staticProjects.filter(
    (project) => project.status === "active"
  ).length;

  return (
    <section id="benefits" className="benefits-section">
      <div className="container">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2 className="heading-2">Why NGOs Choose HopeLink</h2>
            <p className="body-large">
              Join hundreds of NGOs who have transformed their operations with
              transparency-first project management.
            </p>

            <div className="benefits-list">
              {staticBenefits.map((benefit) => (
                <div key={benefit.id} className="benefit-item">
                  <div className="benefit-icon-container">
                    {getIconComponent(benefit.icon)}
                  </div>
                  <div className="benefit-content">
                    <h3 className="heading-4">{benefit.title}</h3>
                    <p className="body-medium">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="benefits-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <span className="mockup-title">HopeLink Dashboard</span>
              </div>

              <div className="mockup-content">
                <div className="mockup-nav">
                  <div className="nav-item active">Projects</div>
                  <div className="nav-item">Funding</div>
                  <div className="nav-item">Reports</div>
                  <div className="nav-item">Team</div>
                </div>

                <div className="mockup-stats">
                  <div className="stat-card">
                    <div className="stat-value">{formatCurrency(totalFunding)}</div>
                    <div className="stat-label">Total Funding</div>
                    <div className="stat-change positive">+15%</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{activeProjects}</div>
                    <div className="stat-label">Active Projects</div>
                    <div className="stat-change positive">+2</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">95%</div>
                    <div className="stat-label">Transparency Score</div>
                    <div className="stat-change positive">+3%</div>
                  </div>
                </div>

                <div className="mockup-progress">
                  {staticProjects.map((project) => (
                    <div key={project.id} className="progress-item">
                      <div className="progress-header">
                        <span>{project.name}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
