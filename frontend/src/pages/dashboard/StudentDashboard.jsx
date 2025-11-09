import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import { FiTrendingUp, FiAward, FiPieChart, FiFileText, FiUser, FiBell, FiCalendar, FiBook } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value, color, ariaLabel }) => (
  <Card aria-label={ariaLabel}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color || 'bg-yellow-100 text-yellow-600'} mr-4`} aria-hidden="true">
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
  <Link 
    to={to} 
    className="block group focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg"
    aria-label={`${title} - ${subtitle}`}
  >
    <Card className="hover:shadow-lg transition-shadow duration-300 hover:border-yellow-500 focus:outline-none">
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-full text-gray-600 group-hover:bg-yellow-100 group-hover:text-yellow-600 group-focus:bg-yellow-100 group-focus:text-yellow-600 mr-4" aria-hidden="true">
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

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cgpa: '0.0',
    lastExamPercentage: '0%',
    attendance: '0%',
    certificates: '0',
  });
  
  const [recentResults, setRecentResults] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        cgpa: '3.6',
        lastExamPercentage: '85%',
        attendance: '92%',
        certificates: '3',
      });
      
      setRecentResults([
        { id: 1, subject: 'English', grade: 'A', marks: '85/100', exam: 'First Term' },
        { id: 2, subject: 'Mathematics', grade: 'A+', marks: '92/100', exam: 'First Term' },
        { id: 3, subject: 'Science', grade: 'B+', marks: '78/100', exam: 'First Term' },
      ]);
      
      setUpcomingExams([
        { id: 1, subject: 'Social Studies', date: '2023-06-15', time: '09:00 AM' },
        { id: 2, subject: 'Nepali', date: '2023-06-17', time: '11:00 AM' },
        { id: 3, subject: 'Computer', date: '2023-06-20', time: '02:00 PM' },
      ]);
      
      setAnnouncements([
        { id: 1, text: 'School annual function on June 30th', time: 'Posted 2 days ago' },
        { id: 2, text: 'Library will be closed for maintenance on June 10th', time: 'Posted 1 week ago' },
      ]);
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Dashboard"
          subtitle="Loading your dashboard..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600" aria-label="Loading..."></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || 'Student'}!`}
      />
      <Layout.Content>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiAward className="h-6 w-6" />}
            title="Overall CGPA"
            value={stats.cgpa}
            color="bg-green-100 text-green-600"
            ariaLabel={`Overall CGPA: ${stats.cgpa}`}
          />
          <StatCard
            icon={<FiTrendingUp className="h-6 w-6" />}
            title="Last Exam %"
            value={stats.lastExamPercentage}
            color="bg-blue-100 text-blue-600"
            ariaLabel={`Last Exam %: ${stats.lastExamPercentage}`}
          />
          <StatCard
            icon={<FiPieChart className="h-6 w-6" />}
            title="Attendance"
            value={stats.attendance}
            color="bg-purple-100 text-purple-600"
            ariaLabel={`Attendance: ${stats.attendance}`}
          />
          <StatCard
            icon={<FiFileText className="h-6 w-6" />}
            title="Certificates"
            value={stats.certificates}
            color="bg-yellow-100 text-yellow-600"
            ariaLabel={`Certificates: ${stats.certificates}`}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickLink
                to="/marks/my-marks"
                icon={<FiTrendingUp className="h-6 w-6" />}
                title="View My Marks"
                subtitle="Check scores for all subjects"
              />
              <QuickLink
                to="/reports/my-report"
                icon={<FiFileText className="h-6 w-6" />}
                title="My Report Card"
                subtitle="Download your official report"
              />
              <QuickLink
                to="/certificates"
                icon={<FiAward className="h-6 w-6" />}
                title="My Certificates"
                subtitle="View and download certificates"
              />
              <QuickLink
                to="/profile"
                icon={<FiUser className="h-6 w-6" />}
                title="My Profile"
                subtitle="Update your personal information"
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <Card>
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FiTrendingUp className="h-12 w-12 text-yellow-500 mx-auto" aria-hidden="true" />
                    <p className="mt-2 text-gray-600">Performance chart would be displayed here</p>
                    <p className="text-sm text-gray-500 mt-1">Showing your progress over the last 3 terms</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Exam Results</h3>
            <Card>
              <ul className="space-y-3" role="list">
                {recentResults.map(result => (
                  <li key={result.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{result.subject}</p>
                      <p className="text-xs text-gray-500">{result.exam}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-semibold text-gray-900">{result.grade}</p>
                       <p className="text-xs text-gray-500">{result.marks}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                 <Link to="/marks/my-marks" className="text-sm font-medium text-yellow-600 hover:text-yellow-700 focus:outline-none focus:underline">
                    View All Results
                 </Link>
              </div>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Exams</h3>
              <Card>
                <ul className="space-y-3" role="list">
                  {upcomingExams.map(exam => (
                    <li key={exam.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{exam.subject}</p>
                        <p className="text-xs text-gray-500">{exam.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{exam.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Announcements</h3>
              <Card>
                <ul className="space-y-3" role="list">
                  {announcements.map(announcement => (
                    <li key={announcement.id} className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <FiBell className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-700">{announcement.text}</p>
                        <p className="text-xs text-gray-500">{announcement.time}</p>
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

export default StudentDashboard;