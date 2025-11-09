import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import Alert from '../ui/Alert';
import studentService from '../../services/studentManagement';

const StudentManagement = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

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
    fetchStudents();
  }, [pagination.page, searchTerm, classFilter, sectionFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        class: classFilter,
        section: sectionFilter,
        schoolId: user.schoolId
      };
      
      const response = await studentService.getAllStudents(
        filters,
        pagination.page,
        pagination.limit
      );
      
      setStudents(response.students);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentStudent(null);
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
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
    setFormData({
      name: student.name || '',
      rollNo: student.rollNo || '',
      class: student.class || '',
      section: student.section || '',
      schoolId: student.schoolId || user.schoolId || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      address: student.address || '',
      phone: student.phone || '',
      email: student.email || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      parentEmail: student.parentEmail || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await studentService.updateStudent(currentStudent.id, formData);
      } else {
        await studentService.createStudent(formData);
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      setError(isEditing ? 'Failed to update student' : 'Failed to create student');
      console.error('Error saving student:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: 'rollNo', title: 'Roll No' },
    { key: 'name', title: 'Name' },
    { key: 'class', title: 'Class' },
    { key: 'section', title: 'Section' },
    { key: 'email', title: 'Email' },
    { key: 'parentName', title: 'Parent Name' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, student) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleEdit(student)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(student.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <Button onClick={handleCreate}>Add Student</Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              options={classes}
            />
            <Select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              options={sections}
            />
            <Button type="submit">Search</Button>
          </form>

          <Table
            data={students}
            columns={columns}
            loading={loading}
            emptyMessage="No students found"
          />

          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {Math.min(students.length, pagination.limit)} of {pagination.total} students
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;