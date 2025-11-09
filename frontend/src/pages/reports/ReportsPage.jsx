import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import StudentReportCard from '../../components/reports/StudentReportCard';
import ClassReportDashboard from '../../components/reports/ClassReportDashboard';
import SchoolReportDashboard from '../../components/reports/SchoolReportDashboard';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const ReportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('student');

  const getRoleBasedTabs = () => {
    const tabs = [];
    
    // All users can view their own student report
    tabs.push({ id: 'student', label: 'My Report', component: <StudentReportCard studentId={user.id} /> });
    
    // Teachers and admins can view class reports
    if (['teacher', 'school_admin', 'district_admin', 'super_admin'].includes(user.role)) {
      tabs.push({ id: 'class', label: 'Class Reports', component: <ClassReportDashboard /> });
    }
    
    // Admins can view school reports
    if (['school_admin', 'district_admin', 'super_admin'].includes(user.role)) {
      tabs.push({ id: 'school', label: 'School Reports', component: <SchoolReportDashboard /> });
    }
    
    return tabs;
  };

  const tabs = getRoleBasedTabs();

  return (
    <Layout>
      <Layout.PageHeader
        title="Reports & Analytics"
        subtitle="View academic performance reports and analytics"
      />
      <Layout.Content>
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default ReportsPage;