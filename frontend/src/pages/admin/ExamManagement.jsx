import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { apiHelpers, API_ENDPOINTS } from '../../api/config';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    examType: '',
    status: '',
    schoolId: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [newExam, setNewExam] = useState({
    name: '',
    code: '',
    description: '',
    examType: 'FINAL',
    startDate: '',
    endDate: '',
    schoolId: '',
    subjects: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  const { hasPermission, hasAnyRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
    fetchSubjects();
    if (hasAnyRole(['super_admin', 'district_admin'])) {
      fetchSchools();
    }
  }, [pagination.currentPage, pagination.itemsPerPage, searchTerm, filters]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.examType && { examType: filters.examType }),
        ...(filters.status && { status: filters.status }),
        ...(filters.schoolId && { schoolId: filters.schoolId }),
      };

      const response = await apiHelpers.get('/exams', params);

      setExams(response.exams || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.pages || 1,
        totalItems: response.pagination?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiHelpers.get('/subjects');
      setSubjects(response.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await apiHelpers.get('/schools');
      setSchools(response.schools || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);

      await apiHelpers.post('/exams', newExam);

      setShowCreateModal(false);
      setNewExam({
        name: '',
        code: '',
        description: '',
        examType: 'FINAL',
        startDate: '',
        endDate: '',
        schoolId: '',
        subjects: [],
      });
      fetchExams();
    } catch (error) {
      console.error('Error creating exam:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handlePublishExam = async (examId) => {
    try {
      await apiHelpers.post(`/exams/${examId}/publish`);
      fetchExams();
    } catch (error) {
      console.error('Error publishing exam:', error);
    }
  };

  const handleViewResults = (exam) => {
    setSelectedExam(exam);
    setShowResultsModal(true);
  };

  const handleEditClick = (exam) => {
    setEditingExam({
      ...exam,
      // Format dates for input[type="date"]
      startDate: new Date(exam.startDate).toISOString().split('T')[0],
      endDate: new Date(exam.endDate).toISOString().split('T')[0],
      subjects: exam.subjects.map((s) => ({
        ...s,
        examDate: s.examDate
          ? new Date(s.examDate).toISOString().split('T')[0]
          : '',
      })),
    });
    setShowEditModal(true);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    if (!editingExam) return;

    try {
      setCreateLoading(true); // Re-use create loading state
      await apiHelpers.put(`/exams/${editingExam.id}`, editingExam);
      setShowEditModal(false);
      setEditingExam(null);
      fetchExams();
    } catch (error) {
      console.error('Error updating exam:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this exam? This action cannot be undone.'
      )
    ) {
      try {
        await apiHelpers.delete(`/exams/${examId}`);
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const addSubjectToExam = () => {
    setNewExam((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          subjectId: '',
          maxMarks: 100,
          minMarks: 0,
          examDate: '',
          duration: 180, // 3 hours in minutes
          instructions: '',
        },
      ],
    }));
  };

  const updateExamSubject = (index, field, value) => {
    setNewExam((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) =>
        i === index ? { ...subject, [field]: value } : subject
      ),
    }));
  };

  const removeExamSubject = (index) => {
    setNewExam((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const updateEditingExamSubject = (index, field, value) => {
    setEditingExam((prev) => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) =>
        i === index ? { ...subject, [field]: value } : subject
      ),
    }));
  };

  const addSubjectToEditingExam = () => {
    setEditingExam((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          subjectId: '',
          maxMarks: 100,
          minMarks: 0,
          examDate: '',
          duration: 180,
          instructions: '',
        },
      ],
    }));
  };

  const removeSubjectFromEditingExam = (index) => {
    setEditingExam((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const getStatusBadge = (exam) => {
    if (exam.isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    } else if (exam.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      );
    }
  };

  const getExamTypeBadge = (type) => {
    const colors = {
      UNIT_TEST: 'bg-purple-100 text-purple-800',
      MIDTERM: 'bg-blue-100 text-blue-800',
      FINAL: 'bg-red-100 text-red-800',
      PRACTICAL: 'bg-green-100 text-green-800',
      PROJECT: 'bg-yellow-100 text-yellow-800',
      ASSIGNMENT: 'bg-indigo-100 text-indigo-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[type] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {type.replace('_', ' ')}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      title: 'Exam Name',
      sortable: true,
      render: (value, exam) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{exam.code}</p>
        </div>
      ),
    },
    {
      key: 'examType',
      title: 'Type',
      render: (value) => getExamTypeBadge(value),
    },
    {
      key: 'startDate',
      title: 'Date Range',
      render: (value, exam) => (
        <div className="text-sm">
          <p className="text-gray-900">
            {new Date(value).toLocaleDateString()}
          </p>
          <p className="text-gray-500">
            to {new Date(exam.endDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: 'school',
      title: 'School',
      render: (value) =>
        value ? (
          <div>
            <p className="text-sm font-medium text-gray-900">{value.name}</p>
            <p className="text-sm text-gray-500">{value.code}</p>
          </div>
        ) : (
          <span className="text-sm text-gray-500">All Schools</span>
        ),
    },
    {
      key: 'subjects',
      title: 'Subjects',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.length || 0} subjects
        </span>
      ),
    },
    {
      key: '_count',
      title: 'Results',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.results || 0} students
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, exam) => getStatusBadge(exam),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, exam) => (
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => navigate(`/exams/${exam.id}`)}
            title="View Details"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Button>

          {hasPermission('manage_exams') && !exam.isPublished && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handlePublishExam(exam.id)}
              title="Publish Exam"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          )}

          {hasPermission('manage_exams') && !exam.isPublished && (
            <>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleEditClick(exam)}
                title="Edit Exam"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
              <Button
                size="xs"
                variant="danger_ghost"
                onClick={() => handleDeleteExam(exam.id)}
                title="Delete Exam"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </>
          )}

          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleViewResults(exam)}
            title="View Results"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </Button>
        </div>
      ),
    },
  ];

  const examTypes = [
    { value: 'UNIT_TEST', label: 'Unit Test' },
    { value: 'MIDTERM', label: 'Midterm' },
    { value: 'FINAL', label: 'Final' },
    { value: 'PRACTICAL', label: 'Practical' },
    { value: 'PROJECT', label: 'Project' },
    { value: 'ASSIGNMENT', label: 'Assignment' },
  ];

  return (
    <Layout>
      <Layout.PageHeader
        title="Exam Management"
        subtitle="Create, manage, and process examination results"
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Exams' },
        ]}
        action={
          hasPermission('manage_exams') && (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              leftIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
            >
              Create Exam
            </Button>
          )
        }
      />

      <Card>
        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />

            <select
              value={filters.examType}
              onChange={(e) => handleFilterChange('examType', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="published">Published</option>
            </select>

            {hasAnyRole(['super_admin', 'district_admin']) && (
              <select
                value={filters.schoolId}
                onChange={(e) => handleFilterChange('schoolId', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Exams Table */}
        <Table
          data={exams}
          columns={columns}
          loading={loading}
          pagination={
            <Table.Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, currentPage: page }))
              }
              onPageSizeChange={(size) =>
                setPagination((prev) => ({
                  ...prev,
                  itemsPerPage: size,
                  currentPage: 1,
                }))
              }
            />
          }
          emptyMessage="No exams found. Create your first exam to get started."
        />
      </Card>

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Exam"
        size="lg"
      >
        <form onSubmit={handleCreateExam} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Exam Name"
              value={newExam.name}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <Input
              label="Exam Code"
              value={newExam.code}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, code: e.target.value }))
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                value={newExam.examType}
                onChange={(e) =>
                  setNewExam((prev) => ({ ...prev, examType: e.target.value }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {examTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {hasAnyRole(['super_admin', 'district_admin']) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School
                </label>
                <select
                  value={newExam.schoolId}
                  onChange={(e) =>
                    setNewExam((prev) => ({
                      ...prev,
                      schoolId: e.target.value,
                    }))
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Schools</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Input
              label="Start Date"
              type="date"
              value={newExam.startDate}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />

            <Input
              label="End Date"
              type="date"
              value={newExam.endDate}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, endDate: e.target.value }))
              }
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newExam.description}
              onChange={(e) =>
                setNewExam((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Exam description..."
            />
          </div>

          {/* Subjects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addSubjectToExam}
              >
                Add Subject
              </Button>
            </div>

            <div className="space-y-4">
              {newExam.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        value={subject.subjectId}
                        onChange={(e) =>
                          updateExamSubject(index, 'subjectId', e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        value={subject.maxMarks}
                        onChange={(e) =>
                          updateExamSubject(
                            index,
                            'maxMarks',
                            parseInt(e.target.value)
                          )
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeExamSubject(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Date
                      </label>
                      <input
                        type="date"
                        value={subject.examDate}
                        onChange={(e) =>
                          updateExamSubject(index, 'examDate', e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={subject.duration}
                        onChange={(e) =>
                          updateExamSubject(
                            index,
                            'duration',
                            parseInt(e.target.value)
                          )
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={createLoading}>
              Create Exam
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Exam Modal */}
      {editingExam && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Exam - ${editingExam.name}`}
          size="lg"
        >
          <form onSubmit={handleUpdateExam} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Exam Name"
                value={editingExam.name}
                onChange={(e) =>
                  setEditingExam((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />

              <Input
                label="Exam Code"
                value={editingExam.code}
                onChange={(e) =>
                  setEditingExam((prev) => ({ ...prev, code: e.target.value }))
                }
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type
                </label>
                <select
                  value={editingExam.examType}
                  onChange={(e) =>
                    setEditingExam((prev) => ({
                      ...prev,
                      examType: e.target.value,
                    }))
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {examTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {hasAnyRole(['super_admin', 'district_admin']) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School
                  </label>
                  <select
                    value={editingExam.schoolId || ''}
                    onChange={(e) =>
                      setEditingExam((prev) => ({
                        ...prev,
                        schoolId: e.target.value,
                      }))
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Schools</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Input
                label="Start Date"
                type="date"
                value={editingExam.startDate}
                onChange={(e) =>
                  setEditingExam((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
              />

              <Input
                label="End Date"
                type="date"
                value={editingExam.endDate}
                onChange={(e) =>
                  setEditingExam((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingExam.description}
                onChange={(e) =>
                  setEditingExam((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Exam description..."
              />
            </div>

            {/* Subjects Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addSubjectToEditingExam}
                >
                  Add Subject
                </Button>
              </div>

              <div className="space-y-4">
                {editingExam.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <select
                          value={subject.subjectId}
                          onChange={(e) =>
                            updateEditingExamSubject(
                              index,
                              'subjectId',
                              e.target.value
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Marks
                        </label>
                        <input
                          type="number"
                          value={subject.maxMarks}
                          onChange={(e) =>
                            updateEditingExamSubject(
                              index,
                              'maxMarks',
                              parseInt(e.target.value)
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                          required
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeSubjectFromEditingExam(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Exam Date
                        </label>
                        <input
                          type="date"
                          value={subject.examDate}
                          onChange={(e) =>
                            updateEditingExamSubject(
                              index,
                              'examDate',
                              e.target.value
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={subject.duration}
                          onChange={(e) =>
                            updateEditingExamSubject(
                              index,
                              'duration',
                              parseInt(e.target.value)
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={createLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title={`Results - ${selectedExam?.name}`}
        size="lg"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Exam Results Management
          </h3>
          <p className="text-gray-500 mb-6">
            Detailed results processing will be implemented here
          </p>
          <Button
            variant="primary"
            onClick={() => navigate(`/exams/${selectedExam?.id}/results`)}
          >
            View Full Results
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default ExamManagement;
