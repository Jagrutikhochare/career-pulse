import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus, UserCheck, Bell } from 'lucide-react';
import './Navbar.css';

/**
 * Navbar Component
 * Renders the top header bar with mobile toggle, breadcrumb/title, and quick actions.
 */
export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();

  // Determine current page friendly title for breadcrumb
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard Overview';
      case '/applications': return 'My Applications';
      case '/add-application': return 'Track New Application';
      case '/job-match': return 'AI Job Fit Analyzer';
      case '/learning-plan': return 'Career & Skill Roadmap';
      default: return 'Career Tracker';
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Current Page Context */}
        <div className="page-header-context">
          <h2 className="current-page-label">{getPageTitle(location.pathname)}</h2>
          <span className="environment-tag">Mock Mode Active</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Quick CTA to Add Application if not already on that page */}
        {location.pathname !== '/add-application' && (
          <Link to="/add-application" className="btn btn-primary nav-cta-btn">
            <Plus size={16} />
            <span className="btn-text">Add Application</span>
          </Link>
        )}

        {/* Demo User Pill */}
        <div className="user-profile-chip" title="Demo Candidate Profile">
          <div className="avatar-circle">
            <UserCheck size={18} />
          </div>
          <div className="user-meta">
            <span className="user-name">Jagruti K.</span>
            <span className="user-role">SWE Candidate</span>
          </div>
        </div>
      </div>
    </header>
  );
}
