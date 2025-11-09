import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import studentService from '../../services/studentManagement';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const studentData = await studentService.getStudentById(id);
      setStudent(studentData);
    } catch (err) {
      setError('Failed to fetch student details');
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page if user has permission
    if (hasPermission('manage_students')) {
      navigate(`/students/${id}/edit`);
    }
  };

  const handleViewMarks = () => {
    // Navigate to marks page for this student
    navigate(`/marks?studentId=${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Student Profile"
          subtitle="Loading student information..."
        />
        <Layout.Content>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Layout.Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Student Profile"
          subtitle="Error loading student information"
        />
        <Layout.Content>
          <Alert variant="error">
            {error}
          </Alert>
        </Layout.Content>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <Layout.PageHeader
          title="Student Profile"
          subtitle="Student not found"
        />
        <Layout.Content>
          <Alert variant="warning">
            Student not found
          </Alert>
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Student Profile"
        subtitle="View and manage student information"
        action={
          hasPermission('manage_students') && (
            <Button variant="primary" onClick={handleEdit}>
              Edit Student
            </Button>
          )
        }
      />
      <Layout.Content>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                    <p className="mt-1 text-sm text-gray-900">{student.rollNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <p className="mt-1 text-sm text-gray-900">{student.class}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <p className="mt-1 text-sm text-gray-900">{student.section}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{student.gender || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{student.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{student.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{student.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent/Guardian Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                    <p className="mt-1 text-sm text-gray-900">{student.parentName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{student.parentPhone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <p className="mt-1 text-sm text-gray-900">{student.parentEmail || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Class</span>
                    <span className="font-medium">{student.class} {student.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Subjects</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Grade</span>
                    <span className="font-medium text-green-600">B+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance</span>
                    <span className="font-medium text-blue-600">92%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full" onClick={handleViewMarks}>
                    View Marks
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Generate Report
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default StudentProfile;