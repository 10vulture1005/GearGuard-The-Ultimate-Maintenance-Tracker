import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const navItems = [
    { path: '/equipment', label: 'Equipment' },
    { path: '/teams', label: 'Teams' },
    { path: '/equipment-category', label: 'Categories' },
    { path: '/work-centres', label: 'Work Centres' },
    { path: '/calendar', label: 'Calendar' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <nav className="flex items-center justify-between border-b-2 border-black pb-4 mb-8 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-2xl font-black tracking-tighter uppercase">GearGuard</div>
        <ul className="flex gap-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`px-4 py-2 rounded-lg font-bold border-2 border-transparent transition-all ${
                  location.pathname === item.path 
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'text-gray-500 hover:text-black hover:border-black'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="mx-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;
