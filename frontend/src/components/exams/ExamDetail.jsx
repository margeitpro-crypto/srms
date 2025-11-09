import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import examService from '../../services/exam.service';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const examData = await examService.getExamById(id);
      setExam(examData);
    } catch (err) {
      setError('Failed to fetch exam details');
      console.error('Error fetching exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (window.confirm('Are you sure you want to publish this exam?')) {
      try {
        await examService.publishExam(id);
        fetchExam();
      } catch (err) {
        setError('Failed to publish exam');
        console.error('Error publishing exam:', err);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      try {
        await examService.deleteExam(id);
        navigate('/exams');
      } catch (err) {
        setError('Failed to delete exam');
        console.error('Error deleting exam:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        {error}
      </Alert>
    );
  }

  if (!exam) {
    return (
      <Alert variant="warning">
        Exam not found
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{exam.name}</h1>
        <div className="flex space-x-3">
          {!exam.isPublished && (
            <>
              <Button variant="secondary" onClick={() => navigate(`/exams/${id}/edit`)}>
                Edit Exam
              </Button>
              {exam.isActive && (
                <Button variant="success" onClick={handlePublish}>
                  Publish Exam
                </Button>
              )}
              <Button variant="danger" onClick={handleDelete}>
                Delete Exam
              </Button>
            </>
          )}
          <Button variant="primary" onClick={() => navigate('/exams')}>
            Back to Exams
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                  <p className="mt-1 text-sm text-gray-900">{exam.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Code</label>
                  <p className="mt-1 text-sm text-gray-900">{exam.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {exam.examType.replace('_', ' ')}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exam.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {exam.isPublished && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 ml-2">
                        Published
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(exam.startDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(exam.endDate)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{exam.description || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
                {!exam.isPublished && (
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/exams/${id}/edit`)}>
                    Edit Subjects
                  </Button>
                )}
              </div>
              {exam.subjects && exam.subjects.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Subject
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Code
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Max Marks
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Min Marks
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Exam Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {exam.subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {subject.subject.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {subject.subject.code}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {subject.maxMarks}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {subject.minMarks}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {subject.examDate ? formatDate(subject.examDate) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No subjects assigned to this exam</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-medium">{exam._count?.results || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subjects</span>
                  <span className="font-medium">{exam.subjects?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(exam.endDate) - new Date(exam.startDate)) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => navigate(`/exams/${id}/results`)}
                >
                  Manage Results
                </Button>
                {!exam.isPublished && (
                  <>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => navigate(`/exams/${id}/results/entry`)}
                    >
                      Enter Marks
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={() => navigate(`/exams/${id}/results/import`)}
                    >
                      Import Marks
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(exam.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(exam.updatedAt)}</p>
                </div>
                {exam.isPublished && exam.publishedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Published</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDateTime(exam.publishedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExamDetail;