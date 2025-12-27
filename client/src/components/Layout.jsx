import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { path: '/equipment', label: 'Equipment' },
    { path: '/teams', label: 'Teams' },
    { path: '/equipment-category', label: 'Equipment Categories' },
    { path: '/work-centres', label: 'Work Centres' },
  ];

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-brand">Maintenance</div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
