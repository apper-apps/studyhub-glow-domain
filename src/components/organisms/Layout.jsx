import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ onQuickAdd, onAddCourse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar */}
      <Sidebar 
        isMobile={true} 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
<Header 
          onMenuClick={toggleMobileMenu}
          onQuickAdd={onQuickAdd}
        />
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;