import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Sparkles, 
  GraduationCap, 
  X,
  Compass
} from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar Component
 * Provides the main navigation menu for the desktop view and mobile drawer.
 * Uses NavLink from react-router-dom to highlight the active page automatically.
 */
export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Applications', path: '/applications', icon: <Briefcase size={20} /> },
    { name: 'Add Application', path: '/add-application', icon: <PlusCircle size={20} /> },
    { name: 'AI Job Match', path: '/job-match', icon: <Sparkles size={20} /> },
    { name: 'Learning Plan', path: '/learning-plan', icon: <GraduationCap size={20} /> },
  ];

  return (
    <>
      {/* Mobile background backdrop overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand / Logo Section */}
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <Compass className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CareerPulse</span>
            <span className="brand-tag">AI Tracker</span>
          </div>
          {/* Mobile close button */}
          <button 
            type="button" 
            className="mobile-close-btn" 
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN NAVIGATION</div>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-link-icon">{item.icon}</span>
                  <span className="nav-link-label">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Portfolio Project Badge */}
        <div className="sidebar-footer">
          <div className="portfolio-badge">
            <div className="badge-header">
              <span className="badge-pulse"></span>
              <span className="badge-title">Portfolio Build</span>
            </div>
            <p className="badge-desc">Step 1: Frontend Architecture &amp; Clean Mock Data</p>
          </div>
        </div>
      </aside>
    </>
  );
}
