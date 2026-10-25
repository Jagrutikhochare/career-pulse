import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

/**
 * Layout Component
 * Master layout shell containing the fixed Sidebar, sticky Navbar,
 * and the dynamic page content area via React Router's <Outlet />.
 */
export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar onToggleSidebar={toggleMobileMenu} />
        
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
