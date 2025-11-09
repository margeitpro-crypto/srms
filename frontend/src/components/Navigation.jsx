import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/marks-entry', label: 'Marks Entry' },
    { path: '/reports', label: 'Reports' }
  ];

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          SRMS 
        </Link>
        
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded ${
                location.pathname === item.path
                  ? 'bg-blue-800'
                  : 'hover:bg-blue-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;