import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FiHome, FiUsers, FiClipboard, FiFileText, FiBell, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value, change }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
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
        since last month
      </p>
    )}
  </Card>
);

const QuickLink = ({ to, icon, title, subtitle }) => (
  <Link to={to} className="block group">
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-blue-500">
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-full text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 mr-4">
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

const DistrictAdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    schools: { value: '0', change: '' },
    students: { value: '0', change: '' },
    exams: { value: '0', change: '' },
    reports: { value: '0', change: '' },
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [districtPerformance, setDistrictPerformance] = useState([]);

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        schools: { value: '24', change: '+2' },
        students: { value: '12,540', change: '+5%' },
        exams: { value: '89', change: '+10' },
        reports: { value: '150', change: '+12' },
      });
      
      setRecentActivities([
        { id: 1, text: 'New school "Valley High School" was registered.', time: '2 hours ago' },
        { id: 2, text: 'Final exam results for "Sunrise English School" have been published.', time: '1 day ago' },
        { id: 3, text: 'A new user account was created for a School Admin.', time: '2 days ago' },
        { id: 4, text: 'District performance report generated for Q2.', time: '3 days ago' },
      ]);
      
      setDistrictPerformance([
        { id: 1, name: 'Kathmandu District', schools: 12, students: 6240, performance: 85 },
        { id: 2, name: 'Pokhara District', schools: 8, students: 4120, performance: 78 },
        { id: 3, name: 'Biratnagar District', schools: 4, students: 2180, performance: 72 },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="District Administrator Dashboard"
          subtitle="Loading your dashboard..."
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
        title="District Administrator Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Administrator'}! Overview of your district's activities and performance.`}
      />
      <Layout.Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiHome className="h-6 w-6" />}
            title="Total Schools"
            value={stats.schools.value}
            change={stats.schools.change}
          />
          <StatCard
            icon={<FiUsers className="h-6 w-6" />}
            title="Total Students"
            value={stats.students.value}
            change={stats.students.change}
          />
          <StatCard
            icon={<FiClipboard className="h-6 w-6" />}
            title="Active Exams"
            value={stats.exams.value}
            change={stats.exams.change}
          />
          <StatCard
            icon={<FiFileText className="h-6 w-6" />}
            title="Generated Reports"
            value={stats.reports.value}
            change={stats.reports.change}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink
                to="/schools"
                icon={<FiHome className="h-6 w-6" />}
                title="Manage Schools"
                subtitle="View, add, or edit schools"
              />
              <QuickLink
                to="/users"
                icon={<FiUsers className="h-6 w-6" />}
                title="Manage Users"
                subtitle="Administer School Admins"
              />
              <QuickLink
                to="/reports"
                icon={<FiFileText className="h-6 w-6" />}
                title="View District Reports"
                subtitle="Aggregate performance data"
              />
              <QuickLink
                to="/settings"
                icon={<FiClipboard className="h-6 w-6" />}
                title="District Settings"
                subtitle="Configure notifications"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">District Performance</h3>
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schools
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Students
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {districtPerformance.map((district) => (
                        <tr key={district.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <FiMapPin className="h-4 w-4 text-gray-500 mr-2" />
                              {district.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {district.schools}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {district.students.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${district.performance}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm text-gray-500">{district.performance}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <Card>
              <ul className="space-y-4">
                {recentActivities.map(activity => (
                  <li key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <FiBell className="h-4 w-4 text-blue-500" />
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <Card>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FiTrendingUp className="h-12 w-12 text-blue-500 mx-auto" />
                    <p className="mt-2 text-gray-600">District performance chart would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-1">Showing performance trends across schools</p>
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

export default DistrictAdminDashboard;