import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import reportService from '../../services/report.service';

const ClassReportDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classFilter, setClassFilter] = useState('10');
  const [sectionFilter, setSectionFilter] = useState('A');
  const [examFilter, setExamFilter] = useState('');

  const classes = [
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
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'D', label: 'Section D' }
  ];

  useEffect(() => {
    fetchReport();
  }, [classFilter, sectionFilter, examFilter]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockReport = {
        class: classFilter,
        section: sectionFilter,
        totalStudents: 45,
        averageMarks: 78.5,
        subjectAverages: [
          { subjectId: 1, subjectName: 'Mathematics', averageMarks: 82.3, highestMarks: 98, lowestMarks: 45 },
          { subjectId: 2, subjectName: 'Science', averageMarks: 76.8, highestMarks: 95, lowestMarks: 42 },
          { subjectId: 3, subjectName: 'English', averageMarks: 80.1, highestMarks: 97, lowestMarks: 50 },
          { subjectId: 4, subjectName: 'Nepali', averageMarks: 75.4, highestMarks: 92, lowestMarks: 38 },
          { subjectId: 5, subjectName: 'Social Studies', averageMarks: 79.2, highestMarks: 94, lowestMarks: 47 }
        ],
        gradeDistribution: [
          { grade: 'A+', count: 5 },
          { grade: 'A', count: 8 },
          { grade: 'B+', count: 12 },
          { grade: 'B', count: 10 },
          { grade: 'C+', count: 6 },
          { grade: 'C', count: 3 },
          { grade: 'D', count: 1 },
          { grade: 'F', count: 0 }
        ],
        topPerformers: [
          { studentId: 1, studentName: 'Ram Bahadur', rollNo: '1001', totalMarks: 468, percentage: 93.6, grade: 'A+' },
          { studentId: 2, studentName: 'Sita Sharma', rollNo: '1002', totalMarks: 456, percentage: 91.2, grade: 'A+' },
          { studentId: 3, studentName: 'Hari Prasad', rollNo: '1003', totalMarks: 445, percentage: 89.0, grade: 'A' },
          { studentId: 4, studentName: 'Gita Kumari', rollNo: '1004', totalMarks: 438, percentage: 87.6, grade: 'A' },
          { studentId: 5, studentName: 'Krishna Thapa', rollNo: '1005', totalMarks: 432, percentage: 86.4, grade: 'A' }
        ]
      };
      setReport(mockReport);
    } catch (err) {
      setError('Failed to fetch class report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      // This would call the export functionality
      alert(`Exporting class report as ${format.toUpperCase()}`);
    } catch (err) {
      setError('Failed to export report');
      console.error('Error exporting report:', err);
    }
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
      <Alert variant="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (!report) {
    return (
      <Alert variant="warning">
        No report data available
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Performance Dashboard</h1>
          <p className="text-gray-600">Class {classFilter} Section {sectionFilter} Performance Overview</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            options={[
              { value: '', label: 'All Exams' },
              { value: 'FINAL_2024', label: 'Final Term 2024' },
              { value: 'MIDTERM_2024', label: 'Mid Term 2024' },
              { value: 'UNIT_TEST_2024', label: 'Unit Test 2024' }
            ]}
          />
          <Button variant="secondary" onClick={() => exportReport('pdf')}>
            Export PDF
          </Button>
          <Button variant="secondary" onClick={() => exportReport('csv')}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Total Students</h3>
                <p className="text-2xl font-semibold text-gray-900">{report.totalStudents}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Class Average</h3>
                <p className="text-2xl font-semibold text-gray-900">{report.averageMarks}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Top Score</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {report.topPerformers[0]?.percentage || 0}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Subjects</h3>
                <p className="text-2xl font-semibold text-gray-900">{report.subjectAverages.length}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject-wise Performance</h2>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Subject
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Average
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Highest
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Lowest
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {report.subjectAverages.map((subject) => (
                      <tr key={subject.subjectId}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {subject.subjectName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="font-medium">{subject.averageMarks}%</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {subject.highestMarks}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {subject.lowestMarks}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h2>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Rank
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Student
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Roll No
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Percentage
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {report.topPerformers.map((student, index) => (
                      <tr key={student.studentId}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.studentName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {student.rollNo}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="font-medium">{student.percentage}%</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.grade === 'A+' ? 'bg-yellow-100 text-yellow-800' :
                            student.grade === 'A' ? 'bg-green-100 text-green-800' :
                            student.grade === 'B+' ? 'bg-blue-100 text-blue-800' :
                            student.grade === 'B' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Grade Distribution</h2>
              <div className="space-y-4">
                {report.gradeDistribution.map((grade) => (
                  <div key={grade.grade}>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Grade {grade.grade}</span>
                      <span>{grade.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          grade.grade === 'A+' ? 'bg-yellow-500' :
                          grade.grade === 'A' ? 'bg-green-500' :
                          grade.grade === 'B+' ? 'bg-blue-500' :
                          grade.grade === 'B' ? 'bg-indigo-500' :
                          grade.grade === 'C+' ? 'bg-purple-500' :
                          grade.grade === 'C' ? 'bg-pink-500' :
                          grade.grade === 'D' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} 
                        style={{ width: `${(grade.count / report.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Filters</h2>
              <div className="space-y-4">
                <Select
                  label="Class"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  options={classes}
                />
                <Select
                  label="Section"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  options={sections}
                />
                <Button variant="primary" className="w-full" onClick={fetchReport}>
                  Update Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassReportDashboard;