import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import { FiUsers, FiUserCheck, FiClipboard, FiFileText, FiBell, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value, change }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    {change && (
      <p className="mt-2 text-xs text-gray-500">
        <span className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
          {change}
        </span>{' '}
        from last term
      </p>
    )}
  </Card>
);

const QuickLink = ({ to, icon, title, subtitle }) => (
  <Link to={to} className="block group">
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-green-500">
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-full text-gray-600 group-hover:bg-green-100 group-hover:text-green-600 mr-4">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const SchoolAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: { value: '0', change: '' },
    teachers: { value: '0', change: '' },
    activeExams: { value: '0', change: '' },
    pendingResults: { value: '0', change: '' },
  });
  
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        students: { value: '542', change: '+12' },
        teachers: { value: '35', change: '+1' },
        activeExams: { value: '4', change: '' },
        pendingResults: { value: '2', change: '' },
      });
      
      setNotifications([
        { id: 1, text: 'First Term Exam results are due for publication.', time: 'Tomorrow', type: 'warning' },
        { id: 2, text: 'New student enrollment application received from "Ram Thapa".', time: '2 days ago', type: 'info' },
        { id: 3, text: 'Teacher "Ms. Gurung" updated marks for Grade 8 English.', time: '3 days ago', type: 'success' },
      ]);
      
      setRecentActivity([
        { id: 1, text: 'Published Final Term results for Grade 10', time: '1 hour ago' },
        { id: 2, text: 'Added new student "Hari Prasad" to Grade 9', time: '3 hours ago' },
        { id: 3, text: 'Created exam schedule for Second Term', time: '1 day ago' },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="School Administrator Dashboard"
          subtitle="Loading your dashboard..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="School Administrator Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Administrator'}! Here's what's happening at your school.`}
      />
      <Layout.Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiUsers className="h-6 w-6" />}
            title="Total Students"
            value={stats.students.value}
            change={stats.students.change}
          />
          <StatCard
            icon={<FiUserCheck className="h-6 w-6" />}
            title="Total Teachers"
            value={stats.teachers.value}
            change={stats.teachers.change}
          />
          <StatCard
            icon={<FiClipboard className="h-6 w-6" />}
            title="Active Exams"
            value={stats.activeExams.value}
          />
          <StatCard
            icon={<FiFileText className="h-6 w-6" />}
            title="Results to Publish"
            value={stats.pendingResults.value}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink
                to="/students"
                icon={<FiUsers className="h-6 w-6" />}
                title="Manage Students"
                subtitle="View, add, or edit students"
              />
              <QuickLink
                to="/users/teachers"
                icon={<FiUserCheck className="h-6 w-6" />}
                title="Manage Teachers"
                subtitle="Administer teacher accounts"
              />
               <QuickLink
                to="/exams"
                icon={<FiClipboard className="h-6 w-6" />}
                title="Manage Exams"
                subtitle="Create exams and schedule"
              />
              <QuickLink
                to="/reports"
                icon={<FiFileText className="h-6 w-6" />}
                title="School Reports"
                subtitle="Performance and analytics"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <Card>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <FiTrendingUp className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="mt-2 text-gray-600">School performance chart would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-1">Showing academic performance trends</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <Card>
              <ul className="space-y-4">
                {notifications.map(notification => (
                  <li key={notification.id} className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {notification.type === 'warning' ? (
                        <FiAlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : notification.type === 'success' ? (
                        <FiBell className="h-4 w-4 text-green-500" />
                      ) : (
                        <FiBell className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">{notification.text}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <Card>
                <ul className="space-y-4">
                  {recentActivity.map(activity => (
                    <li key={activity.id} className="flex items-start">
                      <div className="flex-shrink-0 h-2 w-2 bg-green-500 rounded-full mt-2" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">{activity.text}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default SchoolAdminDashboard;