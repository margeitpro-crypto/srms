import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import { FiUser, FiTrendingUp, FiCheckCircle, FiMessageSquare, FiFileText, FiCalendar, FiBell, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value, color }) => (
  <Card>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color || 'bg-indigo-100 text-indigo-600'} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

const QuickLink = ({ to, icon, title, subtitle }) => (
  <Link to={to} className="block group">
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-indigo-500">
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-full text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 mr-4">
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

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [children, setChildren] = useState([]);
  const [childData, setChildData] = useState({});

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockChildren = [
        { id: 'child1', name: 'Sita Sharma', grade: 'Grade 8' },
        { id: 'child2', name: 'Gita Sharma', grade: 'Grade 5' },
      ];
      
      const mockChildData = {
        child1: {
          stats: {
            overallGrade: 'A',
            lastExam: '88%',
            attendance: '95%',
          },
          recentActivity: [
            { id: 1, text: 'Received A+ in Final Term Mathematics exam.', time: '2 days ago' },
            { id: 2, text: 'Upcoming parent-teacher meeting next Friday.', time: 'Reminder' },
            { id: 3, text: 'School fee for June is due.', time: '1 week ago' },
          ],
        },
        child2: {
          stats: {
            overallGrade: 'B+',
            lastExam: '75%',
            attendance: '98%',
          },
          recentActivity: [
            { id: 1, text: 'Submitted the Science project.', time: 'Yesterday' },
            { id: 2, text: 'Received B in English unit test.', time: '4 days ago' },
          ],
        }
      };
      
      setChildren(mockChildren);
      setChildData(mockChildData);
      setSelectedChildId(mockChildren[0].id);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Parent Dashboard"
          subtitle="Loading your dashboard..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  const selectedChildData = childData[selectedChildId];
  const selectedChildInfo = children.find(c => c.id === selectedChildId);

  return (
    <Layout>
      <Layout.PageHeader
        title="Parent Dashboard"
        subtitle={`Welcome, ${user?.name || 'Parent'}! Keep track of your child's progress.`}
      />
      <Layout.Content>
        <div className="mb-6">
          <label htmlFor="child-select" className="block text-sm font-medium text-gray-700 mb-2">
            Viewing Dashboard For
          </label>
          <select
            id="child-select"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="max-w-xs block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - {child.grade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<FiUser className="h-6 w-6" />}
            title="Overall Grade"
            value={selectedChildData.stats.overallGrade}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={<FiTrendingUp className="h-6 w-6" />}
            title="Last Exam Score"
            value={selectedChildData.stats.lastExam}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={<FiCheckCircle className="h-6 w-6" />}
            title="Attendance"
            value={selectedChildData.stats.attendance}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links for {selectedChildInfo?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink
                to={`/reports/child-report?childId=${selectedChildId}`}
                icon={<FiFileText className="h-6 w-6" />}
                title="View Report Card"
                subtitle="Check detailed results"
              />
              <QuickLink
                to={`/attendance/child?childId=${selectedChildId}`}
                icon={<FiCalendar className="h-6 w-6" />}
                title="Attendance Record"
                subtitle="View monthly attendance"
              />
              <QuickLink
                to={`/billing/child?childId=${selectedChildId}`}
                icon={<FiMessageSquare className="h-6 w-6" />}
                title="Fee Payments"
                subtitle="Check invoices and status"
              />
              <QuickLink
                to={`/profile/child?childId=${selectedChildId}`}
                icon={<FiUser className="h-6 w-6" />}
                title="Child's Profile"
                subtitle="View personal details"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <Card>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FiTrendingUp className="h-12 w-12 text-indigo-500 mx-auto" />
                    <p className="mt-2 text-gray-600">Performance chart would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-1">Showing progress over the last 3 terms</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <Card>
              <ul className="space-y-4">
                {selectedChildData.recentActivity.map(activity => (
                  <li key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {activity.time === 'Reminder' ? (
                        <FiAlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <FiBell className="h-4 w-4 text-indigo-500" />
                      )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Messages</h3>
              <Card>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 text-sm font-medium">T</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Message Teacher</p>
                        <p className="text-xs text-gray-500">Send a quick note</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-sm font-medium">S</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">School Notice</p>
                        <p className="text-xs text-gray-500">View announcements</p>
                      </div>
                    </div>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default ParentDashboard;