import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../ui/Card';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import examService from '../../services/exam.service';

const ExamResults = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchExam();
    fetchResults();
  }, [id, pagination.page, classFilter, sectionFilter, statusFilter]);

  const fetchExam = async () => {
    try {
      const examData = await examService.getExamById(id);
      setExam(examData);
    } catch (err) {
      setError('Failed to fetch exam details');
      console.error('Error fetching exam:', err);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        class: classFilter,
        section: sectionFilter,
        status: statusFilter
      };
      
      const response = await examService.getExamResults(id, filters);
      
      setResults(response.results);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to fetch exam results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePublishResults = async () => {
    if (window.confirm('Are you sure you want to publish these results?')) {
      try {
        await examService.publishResults(id);
        fetchResults();
      } catch (err) {
        setError('Failed to publish results');
        console.error('Error publishing results:', err);
      }
    }
  };

  const handlePublishSelected = async () => {
    const selectedStudentIds = Array.from(
      document.querySelectorAll('input[name="result-select"]:checked')
    ).map(checkbox => parseInt(checkbox.value));
    
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student result to publish');
      return;
    }
    
    if (window.confirm(`Are you sure you want to publish results for ${selectedStudentIds.length} selected students?`)) {
      try {
        await examService.publishResults(id, selectedStudentIds);
        fetchResults();
      } catch (err) {
        setError('Failed to publish selected results');
        console.error('Error publishing selected results:', err);
      }
    }
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 32) return 'D';
    return 'F';
  };

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          onChange={(e) => {
            const checkboxes = document.querySelectorAll('input[name="result-select"]');
            checkboxes.forEach(checkbox => {
              checkbox.checked = e.target.checked;
            });
          }}
        />
      ),
      render: (_, result) => (
        <input
          type="checkbox"
          name="result-select"
          value={result.studentId}
        />
      )
    },
    { key: 'rollNo', title: 'Roll No', render: (_, result) => result.student.rollNo },
    { key: 'name', title: 'Student Name', render: (_, result) => result.student.name },
    { key: 'class', title: 'Class', render: (_, result) => result.student.class },
    { key: 'section', title: 'Section', render: (_, result) => result.student.section },
    { 
      key: 'marks', 
      title: 'Marks',
      render: (_, result) => (
        <span className="font-medium">
          {result.obtainedMarks?.toFixed(2) || 'N/A'} / {result.totalMarks?.toFixed(2) || 'N/A'}
        </span>
      )
    },
    { 
      key: 'percentage', 
      title: 'Percentage',
      render: (_, result) => (
        <span className={result.percentage >= 40 ? 'text-green-600' : 'text-red-600'}>
          {result.percentage?.toFixed(2) || 'N/A'}%
        </span>
      )
    },
    { 
      key: 'grade', 
      title: 'Grade',
      render: (_, result) => (
        <span className={`font-medium ${
          result.grade === 'A+' || result.grade === 'A' ? 'text-green-600' :
          result.grade === 'B+' || result.grade === 'B' ? 'text-blue-600' :
          result.grade === 'C+' || result.grade === 'C' ? 'text-yellow-600' :
          result.grade === 'D' ? 'text-orange-600' : 'text-red-600'
        }`}>
          {result.grade || 'N/A'}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (_, result) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          result.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
          result.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
          result.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
          result.status === 'PENDING' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {result.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, result) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.location.href = `/exams/${id}/results/${result.id}`}
          >
            View Details
          </Button>
          {result.status === 'COMPLETED' && !result.isPublished && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handlePublishResults([result.id])}
            >
              Publish
            </Button>
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

      {exam && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exam.name} Results</h1>
            <p className="text-gray-600">Manage and publish exam results</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="success" onClick={handlePublishResults}>
              Publish All Results
            </Button>
            <Button variant="primary" onClick={handlePublishSelected}>
              Publish Selected
            </Button>
          </div>
        </div>
      )}

      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            />
            <Input
              placeholder="Section"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            <Button onClick={fetchResults}>Filter</Button>
          </div>

          <Table
            data={results}
            columns={columns}
            loading={loading}
            emptyMessage="No exam results found"
          />

          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Showing {Math.min(results.length, pagination.limit)} of {pagination.total} results
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

export default ExamResults;