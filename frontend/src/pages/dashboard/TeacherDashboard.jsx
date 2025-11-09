import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import { FiBookOpen, FiUsers, FiEdit, FiCalendar, FiCheckSquare, FiTrendingUp, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
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
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-purple-500">
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-full text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 mr-4">
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

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classes: '0',
    students: '0',
    subjects: '0',
    pendingMarks: '0',
  });
  
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        classes: '4',
        students: '128',
        subjects: '3',
        pendingMarks: '2',
      });
      
      setUpcomingDeadlines([
        { id: 1, text: 'Marks entry for "First Term Exam" (Grade 8 English)', due: 'in 2 days' },
        { id: 2, text: 'Practical exam for "Science" (Grade 9)', due: 'in 5 days' },
        { id: 3, text: 'Submit project scores for "Social Studies"', due: 'in 1 week' },
      ]);
      
      setRecentActivity([
        { id: 1, text: 'Updated marks for Grade 10 Mathematics', time: '2 hours ago' },
        { id: 2, text: 'Created new exam for Grade 8 Science', time: '1 day ago' },
        { id: 3, text: 'Viewed student report for Sita Sharma', time: '2 days ago' },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Teacher Dashboard"
          subtitle="Loading your dashboard..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Teacher Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Teacher'}! Ready for a productive day?`}
      />
      <Layout.Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiBookOpen className="h-6 w-6" />}
            title="My Classes"
            value={stats.classes}
          />
          <StatCard
            icon={<FiUsers className="h-6 w-6" />}
            title="My Students"
            value={stats.students}
          />
          <StatCard
            icon={<FiCheckSquare className="h-6 w-6" />}
            title="Assigned Subjects"
            value={stats.subjects}
          />
          <StatCard
            icon={<FiEdit className="h-6 w-6" />}
            title="Pending Marks Entry"
            value={stats.pendingMarks}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink
                to="/marks/entry"
                icon={<FiEdit className="h-6 w-6" />}
                title="Enter Marks"
                subtitle="Input or update student scores"
              />
              <QuickLink
                to="/students/my-classes"
                icon={<FiUsers className="h-6 w-6" />}
                title="View My Classes"
                subtitle="See student lists and details"
              />
              <QuickLink
                to="/reports"
                icon={<FiTrendingUp className="h-6 w-6" />}
                title="View Reports"
                subtitle="Check class performance"
              />
               <QuickLink
                to="/profile"
                icon={<FiUsers className="h-6 w-6" />}
                title="My Profile"
                subtitle="View your personal profile"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
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
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
            <Card>
              <ul className="space-y-4">
                {upcomingDeadlines.map(deadline => (
                  <li key={deadline.id} className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <FiCalendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700">{deadline.text}</p>
                      <p className="text-xs font-semibold text-red-600">{deadline.due}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default TeacherDashboard;