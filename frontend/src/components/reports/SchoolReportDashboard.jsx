import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import reportService from '../../services/report.service';

const SchoolReportDashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academicYear, setAcademicYear] = useState('2024');
  const [examFilter, setExamFilter] = useState('');

  const academicYears = [
    { value: '2024', label: '2024-2025' },
    { value: '2023', label: '2023-2024' },
    { value: '2022', label: '2022-2023' }
  ];

  useEffect(() => {
    fetchReport();
  }, [academicYear, examFilter]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockReport = {
        school: {
          id: 1,
          name: 'Sunrise Secondary School',
          code: 'SSS001'
        },
        academicYear: academicYear,
        totalStudents: 1250,
        totalClasses: 24,
        overallAverage: 76.8,
        classAverages: [
          { class: '1', averageMarks: 82.3, studentCount: 45 },
          { class: '2', averageMarks: 80.1, studentCount: 42 },
          { class: '3', averageMarks: 78.9, studentCount: 40 },
          { class: '4', averageMarks: 77.6, studentCount: 38 },
          { class: '5', averageMarks: 76.4, studentCount: 35 },
          { class: '6', averageMarks: 75.8, studentCount: 40 },
          { class: '7', averageMarks: 74.2, studentCount: 42 },
          { class: '8', averageMarks: 73.7, studentCount: 45 },
          { class: '9', averageMarks: 72.5, studentCount: 48 },
          { class: '10', averageMarks: 71.3, studentCount: 50 }
        ],
        subjectPerformance: [
          { subjectId: 1, subjectName: 'Mathematics', averageMarks: 78.5, passRate: 92.4 },
          { subjectId: 2, subjectName: 'Science', averageMarks: 76.8, passRate: 89.7 },
          { subjectId: 3, subjectName: 'English', averageMarks: 80.1, passRate: 94.2 },
          { subjectId: 4, subjectName: 'Nepali', averageMarks: 75.4, passRate: 87.6 },
          { subjectId: 5, subjectName: 'Social Studies', averageMarks: 79.2, passRate: 91.8 }
        ],
        gradeDistribution: [
          { grade: 'A+', count: 65 },
          { grade: 'A', count: 98 },
          { grade: 'B+', count: 156 },
          { grade: 'B', count: 132 },
          { grade: 'C+', count: 98 },
          { grade: 'C', count: 65 },
          { grade: 'D', count: 24 },
          { grade: 'F', count: 12 }
        ]
      };
      setReport(mockReport);
    } catch (err) {
      setError('Failed to fetch school report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      // This would call the export functionality
      alert(`Exporting school report as ${format.toUpperCase()}`);
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
          <h1 className="text-2xl font-bold text-gray-900">School Performance Dashboard</h1>
          <p className="text-gray-600">{report.school.name} - Academic Year {report.academicYear}</p>
        </div>
        <div className="flex space-x-3">
          <Select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            options={academicYears}
          />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Total Classes</h3>
                <p className="text-2xl font-semibold text-gray-900">{report.totalClasses}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">School Average</h3>
                <p className="text-2xl font-semibold text-gray-900">{report.overallAverage}%</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Pass Rate</h3>
                <p className="text-2xl font-semibold text-gray-900">92.4%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Class-wise Performance</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Class
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Students
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Average Marks
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {report.classAverages.map((classData) => (
                    <tr key={classData.class}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        Class {classData.class}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {classData.studentCount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="font-medium">{classData.averageMarks}%</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span className="ml-1 text-green-600">+2.1%</span>
                        </div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Performance</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Subject
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Average Marks
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Pass Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {report.subjectPerformance.map((subject) => (
                    <tr key={subject.subjectId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {subject.subjectName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="font-medium">{subject.averageMarks}%</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`${subject.passRate > 90 ? 'text-green-600' : subject.passRate > 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                          {subject.passRate}%
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Trend</h2>
              <div className="h-64 flex items-end space-x-2">
                {report.classAverages.map((classData, index) => (
                  <div key={classData.class} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                      style={{ height: `${(classData.averageMarks / 100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">Class {classData.class}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

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
      </div>
    </div>
  );
};

export default SchoolReportDashboard;