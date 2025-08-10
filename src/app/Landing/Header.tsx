import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import "./app.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="nav-brand">
          <h1 className="brand-logo">HopeLink</h1>
        </div>

        <div className="nav-desktop">
          <a href="#features" className="nav-link">Features</a>
          <a href="#benefits" className="nav-link">Benefits</a>
          <a href="#contact" className="nav-link">Contact</a>
          <Button className="btn-primary">Get Started</Button>
        </div>

        <div className="nav-mobile">
          <Button variant="ghost" size="icon" className="menu-toggle">
            <Menu size={24} />
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
