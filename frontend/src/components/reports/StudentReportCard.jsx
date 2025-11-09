import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import reportService from '../../services/report.service';

const StudentReportCard = ({ studentId }) => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    fetchReport();
  }, [studentId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const reportData = await reportService.getStudentReport(studentId || user.id);
      setReport(reportData);
    } catch (err) {
      setError('Failed to fetch student report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      if (format === 'excel') {
        // Export as Excel
        exportToExcel();
      } else if (format === 'pdf') {
        // Export as PDF
        alert('Exporting report as PDF');
      } else if (format === 'csv') {
        // Export as CSV
        exportToCSV();
      }
    } catch (err) {
      setError('Failed to export report');
      console.error('Error exporting report:', err);
    }
  };

  const exportToExcel = () => {
    // In a real implementation, this would generate an actual Excel file
    // For now, we'll simulate the process
    const data = formatReportDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Report");
    XLSX.writeFile(workbook, `student-report-${report.student.name}.xlsx`);
  };

  const exportToCSV = () => {
    // In a real implementation, this would generate an actual CSV file
    // For now, we'll simulate the process
    const data = formatReportDataForExport();
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `student-report-${report.student.name}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatReportDataForExport = () => {
    if (!report) return [];
    
    return report.marks.map(mark => ({
      'Subject': mark.subject.name,
      'Marks Obtained': mark.marks,
      'Max Marks': mark.subject.maxMarks || 100,
      'Grade': mark.grade,
      'Percentage': calculatePercentage(mark.marks, mark.subject.maxMarks || 100)
    }));
  };

  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return `${header}\n${rows}`;
  };

  const calculatePercentage = (obtained, total) => {
    return total > 0 ? ((obtained / total) * 100).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-label="Loading..."></div>
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
        No data available
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Report Card</h1>
          <p className="text-gray-600">Academic performance overview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            options={[
              { value: '', label: 'Select Exam Term' },
              { value: 'FINAL_2024', label: 'Final Term 2024' },
              { value: 'MIDTERM_2024', label: 'Mid Term 2024' },
              { value: 'UNIT_TEST_2024', label: 'Unit Test 2024' }
            ]}
            aria-label="Select exam term"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportReport('pdf')} aria-label="Export PDF">
              Export PDF
            </Button>
            <Button variant="secondary" onClick={() => exportReport('excel')} aria-label="Export Excel">
              Export Excel
            </Button>
            <Button variant="secondary" onClick={() => exportReport('csv')} aria-label="Export CSV">
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{report.student.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll No</label>
                  <p className="mt-1 text-sm text-gray-900">{report.student.rollNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class/Section</label>
                  <p className="mt-1 text-sm text-gray-900">{report.student.class} / {report.student.section}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">School</label>
                  <p className="mt-1 text-sm text-gray-900">{report.student.school.name}</p>
                </div>
              </div>
            </div>
          </Card>

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
                        Marks Obtained
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Grade
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {report.marks.map((mark) => (
                      <tr key={mark.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {mark.subject.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="font-medium">{mark.marks}</span> / {mark.subject.maxMarks || 100}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                            mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            mark.grade === 'C+' || mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            mark.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {mark.grade}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {calculatePercentage(mark.marks, mark.subject.maxMarks || 100)}%
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Subjects</span>
                  <span className="font-medium">{report.summary.totalSubjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-medium">{report.summary.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Marks</span>
                  <span className="font-medium">{report.summary.averageMarks.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Grade</span>
                  <span className={`font-medium text-lg ${
                    report.summary.overallGrade === 'A+' || report.summary.overallGrade === 'A' ? 'text-green-600' :
                    report.summary.overallGrade === 'B+' || report.summary.overallGrade === 'B' ? 'text-blue-600' :
                    report.summary.overallGrade === 'C+' || report.summary.overallGrade === 'C' ? 'text-yellow-600' :
                    report.summary.overallGrade === 'D' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {report.summary.overallGrade}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPA</span>
                  <span className="font-medium">{report.summary.gpa.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Class Average</span>
                    <span>78.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '85%' }}
                      aria-label={`Performance: 85% compared to Class Average 78.5%`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    You are performing above class average
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Top Performer</span>
                    <span>92.0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: '72%' }}
                      aria-label={`Performance: 72% toward Top Performer 92%`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    18% to reach top performance
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  View Detailed Report
                </Button>
                <Button variant="secondary" className="w-full">
                  Share with Parent
                </Button>
                <Button variant="secondary" className="w-full">
                  Download Certificate
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentReportCard;