import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Alert from '../ui/Alert';
import { Loading } from '../ui/Loading';
import apiService from '../../services/api.service';

const MySchool = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        // For demonstration purposes, we'll use mock data
        // In a real implementation, this would be:
        // const response = await apiService.getMySchool();
        // setSchool(response.data.school || response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          const mockSchool = {
            id: 1,
            name: 'Sunrise English School',
            code: 'SES001',
            address: 'Boudha, Kathmandu',
            phone: '9800000001',
            email: 'info@sunrise.edu.np',
            principal: 'Dr. Ram Prasad Kandel',
            established: '2010-01-01T00:00:00.000Z',
            createdAt: '2010-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          };
          
          const mockStats = {
            totalStudents: 1250,
            classesCount: 12,
            teachersCount: 45
          };
          
          setSchool({
            ...mockSchool,
            stats: mockStats
          });
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message || 'Failed to fetch school data');
        console.error('Error fetching school data:', err);
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="My School"
          subtitle="Viewing your school information"
        />
        <Layout.Content className="flex items-center justify-center min-h-[400px]">
          <Loading size="lg" text="Loading school information..." />
        </Layout.Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Layout.PageHeader
          title="My School"
          subtitle="Viewing your school information"
        />
        <Layout.Content>
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        </Layout.Content>
      </Layout>
    );
  }

  // Extract statistics from school data
  const stats = school?.stats || {};
  
  return (
    <Layout>
      <Layout.PageHeader
        title={school?.name || 'My School'}
        subtitle={`School ID: ${school?.id || 'N/A'} | District: ${school?.district?.name || 'N/A'}`}
      />
      
      <Layout.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* School Information Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">School Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <p className="mt-1 text-gray-900">
                  {school?.phone && `Phone: ${school.phone}`}
                  {school?.email && `Email: ${school.email}`}
                  {!school?.phone && !school?.email && 'N/A'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-gray-900">{school?.address || 'N/A'}</p>
              </div>
              
              {school?.principal && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Principal</h3>
                  <p className="mt-1 text-gray-900">{school.principal}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Statistics Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalStudents || 0}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-green-700">{stats.classesCount || 0}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-purple-700">{stats.teachersCount || 0}</p>
              </div>
              
              {school?.established && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Established</p>
                  <p className="text-2xl font-bold text-yellow-700">{new Date(school.established).getFullYear()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Optional: Expandable sections for classes, students, and teachers */}
        {school && (
          <div className="mt-8">
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
              <p className="text-gray-600">Expandable sections for classes, students, and teachers can be added here.</p>
            </div>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
};

export default MySchool;