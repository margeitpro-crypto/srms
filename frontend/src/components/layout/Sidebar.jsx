import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const location = useLocation();
  const { user, hasAnyRole, hasPermission } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState({});

  // Navigation items with role-based visibility
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
    },
    {
      name: 'User Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
      roles: ['super_admin', 'district_admin'],
      children: [
        {
          name: 'All Users',
          href: '/users',
          roles: ['super_admin', 'district_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Add User',
          href: '/users/add',
          roles: ['super_admin', 'district_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Teachers',
          href: '/users/teachers',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'School Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      roles: ['super_admin', 'district_admin', 'school_admin'],
      children: [
        {
          name: 'All Schools',
          href: '/schools',
          roles: ['super_admin', 'district_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Add School',
          href: '/schools/add',
          roles: ['super_admin', 'district_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My School',
          href: '/schools/my-school',
          roles: ['school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Student Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
      children: [
        {
          name: 'All Students',
          href: '/students',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Add Student',
          href: '/students/add',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Bulk Import',
          href: '/students/import',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Classes',
          href: '/students/my-classes',
          roles: ['teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Subject Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
      children: [
        {
          name: 'All Subjects',
          href: '/subjects',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Add Subject',
          href: '/subjects/add',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Exams Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
      children: [
        {
          name: 'All Exams',
          href: '/exams',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Exams',
          href: '/exams/my-exams',
          roles: ['student', 'parent'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Marks Management',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
      children: [
        {
          name: 'Marks Entry',
          href: '/marks/entry',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'View Marks',
          href: '/marks',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Marks',
          href: '/marks/my-marks',
          roles: ['student'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: "Child's Marks",
          href: '/marks/child-marks',
          roles: ['parent'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Bulk Import',
          href: '/marks/import',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Certificates',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
      children: [
        {
          name: 'All Certificates',
          href: '/certificates',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Certificates',
          href: '/certificates/my-certificates',
          roles: ['student', 'parent'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Billing',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      roles: ['super_admin', 'district_admin', 'school_admin', 'parent'],
      children: [
        {
          name: 'All Bills',
          href: '/billing',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Bills',
          href: '/billing/my-bills',
          roles: ['parent'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Reports & Analytics',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
      children: [
        {
          name: 'Student Reports',
          href: '/reports/students',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Class Reports',
          href: '/reports/classes',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'School Analytics',
          href: '/reports/school-analytics',
          roles: ['super_admin', 'district_admin', 'school_admin'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Subject Analysis',
          href: '/reports/subjects',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'Certificates',
          href: '/reports/certificates',
          roles: ['super_admin', 'district_admin', 'school_admin', 'teacher'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: 'My Report Card',
          href: '/reports/my-report',
          roles: ['student'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
        {
          name: "Child's Report",
          href: '/reports/child-report',
          roles: ['parent'],
          icon: <span className="h-2 w-2 rounded-full bg-current" />,
        },
      ],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      roles: [
        'super_admin',
        'district_admin',
        'school_admin',
        'teacher',
        'student',
        'parent',
      ],
    },
  ];

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isActive = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + '/')
    );
  };

  const hasAccess = (roles) => {
    if (!roles || roles.length === 0) return true;
    return hasAnyRole(roles);
  };

  const filteredNavItems = navigationItems.filter((item) =>
    hasAccess(item.roles)
  );

  const sidebarClasses = twMerge(
    'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'lg:relative lg:w-64', // Add responsive classes
    className
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                SRMS 
              </span>
            </div>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              if (item.children) {
                const hasActiveChild = item.children.some(
                  (child) => hasAccess(child.roles) && isActive(child.href)
                );
                const isExpanded = expandedGroups[item.name];

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleGroup(item.name)}
                      className={twMerge(
                        'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                        hasActiveChild
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <div className="flex items-center">
                        <span
                          className={
                            hasActiveChild ? 'text-blue-600' : 'text-gray-400'
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </div>
                      <svg
                        className={twMerge(
                          'h-4 w-4 transition-transform duration-150',
                          isExpanded ? 'rotate-90' : '',
                          hasActiveChild ? 'text-blue-600' : 'text-gray-400'
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Submenu */}
                    <div
                      className={twMerge(
                        'mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200',
                        isExpanded
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      )}
                    >
                      {item.children
                        .filter((child) => hasAccess(child.roles))
                        .map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={() => onClose?.()}
                            className={twMerge(
                              'block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                              isActive(child.href)
                                ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose?.()}
                  className={twMerge(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <span
                    className={
                      isActive(item.href) ? 'text-blue-600' : 'text-gray-400'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>SRMS v1.0.0</p>
              <p className="mt-1">Nepal Education Board</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
