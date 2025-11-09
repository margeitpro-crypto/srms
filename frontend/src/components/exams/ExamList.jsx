import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import examService from '../../services/exam.service';

const ExamList = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [examTypeFilter, setExamTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const examTypes = [
    { value: '', label: 'All Exam Types' },
    { value: 'UNIT_TEST', label: 'Unit Test' },
    { value: 'MIDTERM', label: 'Midterm' },
    { value: 'FINAL', label: 'Final' },
    { value: 'PRACTICAL', label: 'Practical' },
    { value: 'PROJECT', label: 'Project' },
    { value: 'ASSIGNMENT', label: 'Assignment' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'published', label: 'Published' }
  ];

  useEffect(() => {
    fetchExams();
  }, [pagination.page, searchTerm, examTypeFilter, statusFilter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        examType: examTypeFilter,
        status: statusFilter,
        schoolId: user.schoolId
      };
      
      const response = await examService.getAllExams(filters);
      
      setExams(response.exams);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch exams');
      console.error('Error fetching exams:', err);
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

  const handlePublish = async (examId) => {
    try {
      await examService.publishExam(examId);
      fetchExams();
    } catch (err) {
      setError('Failed to publish exam');
      console.error('Error publishing exam:', err);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await examService.deleteExam(examId);
        fetchExams();
      } catch (err) {
        setError('Failed to delete exam');
        console.error('Error deleting exam:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { key: 'name', title: 'Exam Name' },
    { key: 'code', title: 'Code' },
    { 
      key: 'examType', 
      title: 'Type',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'startDate', 
      title: 'Start Date',
      render: (value) => formatDate(value)
    },
    { 
      key: 'endDate', 
      title: 'End Date',
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (_, exam) => (
        <div className="flex flex-col">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            exam.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {exam.isActive ? 'Active' : 'Inactive'}
          </span>
          {exam.isPublished && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
              Published
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'results', 
      title: 'Results',
      render: (_, exam) => (
        <span className="text-sm text-gray-900">
          {exam._count?.results || 0} students
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, exam) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.location.href = `/exams/${exam.id}`}
          >
            View
          </Button>
          {!exam.isPublished && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => window.location.href = `/exams/${exam.id}/edit`}
              >
                Edit
              </Button>
              {!exam.isPublished && exam.isActive && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handlePublish(exam.id)}
                >
                  Publish
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(exam.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              options={examTypes}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            <Button type="submit">Search</Button>
          </form>

          <Table
            data={exams}
            columns={columns}
            loading={loading}
            emptyMessage="No exams found"
          />

          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {Math.min(exams.length, pagination.limit)} of {pagination.total} exams
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
    </div>
  );
};

export default ExamList;