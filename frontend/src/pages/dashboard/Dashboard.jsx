import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import {
  FiUsers,
  FiBook,
  FiAward,
  FiBarChart2,
  FiPlusCircle,
  FiSettings,
  FiFileText,
  FiTrendingUp,
  FiBell,
  FiMapPin
} from 'react-icons/fi';

// Import other role-specific dashboards with error handling
import DistrictAdminDashboard from './DistrictAdminDashboard';
import SchoolAdminDashboard from './SchoolAdminDashboard';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

/**
 * SuperAdminDashboard Component
 * This dashboard is specifically for users with the SUPER_ADMIN role.
 * It provides an overview of the entire system and quick access to management functions.
 */
const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    schools: 0,
    students: 0,
    teachers: 0,
    exams: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemPerformance, setSystemPerformance] = useState([]);

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        schools: 24,
        students: 12540,
        teachers: 850,
        exams: 156,
      });
      
      setRecentActivity([
        { id: 1, text: 'New school "Valley High School" was registered in Kathmandu District.', time: '2 hours ago' },
        { id: 2, text: 'District performance report generated for all 24 schools.', time: '1 day ago' },
        { id: 3, text: 'System maintenance completed successfully with 99.9% uptime.', time: '2 days ago' },
        { id: 4, text: 'New feature "Bulk Student Import" deployed to production.', time: '3 days ago' },
      ]);
      
      setSystemPerformance([
        { id: 1, name: 'User Authentication', status: 'Operational', responseTime: '45ms' },
        { id: 2, name: 'Database', status: 'Operational', responseTime: '120ms' },
        { id: 3, name: 'File Storage', status: 'Operational', responseTime: '85ms' },
        { id: 4, name: 'Email Service', status: 'Degraded', responseTime: 'N/A' },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Super Administrator Dashboard"
          subtitle="Loading system overview..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Super Administrator Dashboard"
        subtitle={`Welcome back, ${
          user?.name || 'Admin'
        }. Here is the system-wide overview.`}
      />
      <Layout.Content>
        {/* Statistics Cards */ }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                <FiBook className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Schools
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.schools}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                <FiUsers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.students.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                <FiAward className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Teachers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.teachers}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full text-red-600 mr-4">
                <FiFileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Exams Conducted
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.exams}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* System Overview */ }
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              System Performance
            </h3>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {systemPerformance.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {service.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.status === 'Operational' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.responseTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/schools"
                  className="bg-gray-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200 border border-gray-200 hover:border-blue-200"
                >
                  <FiPlusCircle className="mx-auto h-8 w-8 text-blue-500" />
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    Manage Schools
                  </p>
                </Link>
                <Link
                  to="/users"
                  className="bg-gray-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors duration-200 border border-gray-200 hover:border-green-200"
                >
                  <FiUsers className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    Manage Users
                  </p>
                </Link>
                <Link
                  to="/reports"
                  className="bg-gray-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200 border border-gray-200 hover:border-purple-200"
                >
                  <FiBarChart2 className="mx-auto h-8 w-8 text-purple-500" />
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    View Reports
                  </p>
                </Link>
                <Link
                  to="/settings"
                  className="bg-gray-50 p-4 rounded-lg text-center hover:bg-red-100 transition-colors duration-200 border border-gray-200 hover:border-red-200"
                >
                  <FiSettings className="mx-auto h-8 w-8 text-red-500" />
                  <p className="mt-2 text-sm font-medium text-gray-800">
                    System Settings
                  </p>
                </Link>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <Card>
              <ul className="space-y-4">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <FiBell className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                District Overview
              </h3>
              <Card>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="h-12 w-12 text-blue-500 mx-auto" />
                    <p className="mt-2 text-gray-600">District map would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-1">Showing 5 districts with schools</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

/**
 * Main Dashboard Component (Role-Based Router)
 * This component acts as a router that renders the correct dashboard
 * based on the role of the currently authenticated user.
 */
const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Layout.Loading text="Loading your dashboard..." />;
  }

  if (!user) {
    return (
      <Layout.Error
        title="Authentication Error"
        message="Could not load user data. Please try logging in again."
        actionText="Go to Login"
        onAction={() => (window.location.href = '/login')}
      />
    );
  }

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'DISTRICT_ADMIN':
      return <DistrictAdminDashboard />;
    case 'SCHOOL_ADMIN':
      return <SchoolAdminDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'PARENT':
      return <ParentDashboard />;
    default:
      return (
        <Layout.Error
          title="Unknown Role"
          message="Your user role is not recognized. Please contact support."
        />
      );
  }
};

export default Dashboard;