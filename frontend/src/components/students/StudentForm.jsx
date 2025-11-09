import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import studentService from '../../services/studentManagement';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    class: '',
    section: '',
    schoolId: user.schoolId || '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const genders = [
    { value: '', label: 'Select Gender' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  const classes = [
    { value: '', label: 'Select Class' },
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
    { value: '11', label: 'Class 11' },
    { value: '12', label: 'Class 12' }
  ];

  const sections = [
    { value: '', label: 'Select Section' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const studentData = await studentService.getStudentById(id);
      setFormData({
        name: studentData.name || '',
        rollNo: studentData.rollNo || '',
        class: studentData.class || '',
        section: studentData.section || '',
        schoolId: studentData.schoolId || user.schoolId || '',
        dateOfBirth: studentData.dateOfBirth || '',
        gender: studentData.gender || '',
        address: studentData.address || '',
        phone: studentData.phone || '',
        email: studentData.email || '',
        parentName: studentData.parentName || '',
        parentPhone: studentData.parentPhone || '',
        parentEmail: studentData.parentEmail || ''
      });
    } catch (err) {
      setError('Failed to fetch student details');
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing) {
        await studentService.updateStudent(id, formData);
        setSuccess('Student updated successfully');
      } else {
        await studentService.createStudent(formData);
        setSuccess('Student created successfully');
        // Reset form
        setFormData({
          name: '',
          rollNo: '',
          class: '',
          section: '',
          schoolId: user.schoolId || '',
          dateOfBirth: '',
          gender: '',
          address: '',
          phone: '',
          email: '',
          parentName: '',
          parentPhone: '',
          parentEmail: ''
        });
      }
      
      // Redirect to students list after a short delay
      setTimeout(() => {
        navigate('/students');
      }, 1500);
    } catch (err) {
      setError(isEditing ? 'Failed to update student' : 'Failed to create student');
      console.error('Error saving student:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <Layout>
        <Layout.PageHeader
          title={isEditing ? "Edit Student" : "Add Student"}
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

  return (
    <Layout>
      <Layout.PageHeader
        title={isEditing ? "Edit Student" : "Add Student"}
        subtitle={isEditing ? "Update student information" : "Create a new student record"}
      />
      <Layout.Content>
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        
        <Card>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Roll Number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Class"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  options={classes}
                  required
                />
                <Select
                  label="Section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  options={sections}
                  required
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={genders}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Parent Name"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Parent Phone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Parent Email"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/students')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Student' : 'Add Student')}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default StudentForm;