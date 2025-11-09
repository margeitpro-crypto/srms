import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';

const MyMarks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('FINAL_2024');

  // Placeholder data - replace with API call
  const placeholderData = {
    FINAL_2024: {
      examName: 'Final Term Examination 2024',
      results: [
        { id: 1, subject: 'English', code: 'ENG101', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
        { id: 2, subject: 'Mathematics', code: 'MTH101', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Outstanding' },
        { id: 3, subject: 'Science', code: 'SCI101', marks: 78, maxMarks: 100, grade: 'B+', remarks: 'Very Good' },
        { id: 4, subject: 'Social Studies', code: 'SOC101', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
        { id: 5, subject: 'Nepali', code: 'NEP101', marks: 75, maxMarks: 100, grade: 'B+', remarks: 'Very Good' },
      ],
      summary: {
        totalMarks: 418,
        maxTotalMarks: 500,
        percentage: 83.6,
        grade: 'A',
        rank: 5,
      },
    },
    MIDTERM_2024: {
      examName: 'Mid-Term Examination 2024',
      results: [
        { id: 1, subject: 'English', code: 'ENG101', marks: 75, maxMarks: 100, grade: 'B+', remarks: 'Good' },
        { id: 2, subject: 'Mathematics', code: 'MTH101', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
        { id: 3, subject: 'Science', code: 'SCI101', marks: 72, maxMarks: 100, grade: 'B', remarks: 'Good' },
        { id: 4, subject: 'Social Studies', code: 'SOC101', marks: 81, maxMarks: 100, grade: 'A-', remarks: 'Very Good' },
        { id: 5, subject: 'Nepali', code: 'NEP101', marks: 70, maxMarks: 100, grade: 'B', remarks: 'Good' },
      ],
      summary: {
        totalMarks: 386,
        maxTotalMarks: 500,
        percentage: 77.2,
        grade: 'B+',
        rank: 8,
      },
    },
  };

  useEffect(() => {
    const fetchMarks = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMarks(placeholderData[selectedExam]?.results || []);
        setLoading(false);
      }, 500);
    };

    if (user) {
      fetchMarks();
    }
  }, [user, selectedExam]);

  const columns = [
    { key: 'subject', title: 'Subject', sortable: true },
    { key: 'code', title: 'Subject Code' },
    { key: 'marks', title: 'Marks Obtained', render: (value, row) => `${value} / ${row.maxMarks}` },
    { key: 'grade', title: 'Grade' },
    { key: 'remarks', title: 'Remarks' },
  ];

  const currentSummary = placeholderData[selectedExam]?.summary;

  // Calculate percentage for each subject
  const calculatePercentage = (marks, maxMarks) => {
    return ((marks / maxMarks) * 100).toFixed(1);
  };

  // Get class average (mock data)
  const getClassAverage = (subject) => {
    const averages = {
      'English': 78,
      'Mathematics': 82,
      'Science': 75,
      'Social Studies': 80,
      'Nepali': 72
    };
    return averages[subject] || 75;
  };

  return (
    <Layout>
      <Layout.PageHeader
        title="My Marks"
        subtitle="View your academic performance for each term."
      />
      <Layout.Content>
        <Card>
          <div className="p-6 border-b border-gray-200 md:flex md:items-center md:justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Results for: {placeholderData[selectedExam]?.examName || 'Select Exam'}
            </h3>
            <div className="mt-4 md:mt-0">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {Object.keys(placeholderData).map(examKey => (
                  <option key={examKey} value={examKey}>
                    {placeholderData[examKey].examName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Performance Visualization */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Subject-wise Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bar Chart Representation */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Marks Comparison</h5>
                <div className="space-y-4">
                  {marks.map((subject) => {
                    const percentage = calculatePercentage(subject.marks, subject.maxMarks);
                    const classAverage = getClassAverage(subject.subject);
                    return (
                      <div key={subject.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{subject.subject}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="flex h-4 rounded-full bg-gray-200 overflow-hidden">
                          <div 
                            className="bg-blue-500 rounded-full" 
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                          <div 
                            className="bg-green-500 rounded-full" 
                            style={{ width: `${Math.min(classAverage, 100 - percentage)}%` }}
                          ></div>
                        </div>
                        <div className="flex text-xs text-gray-500">
                          <span>Your Performance</span>
                          <span className="ml-auto">Class Average: {classAverage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Grade Distribution */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Grade Distribution</h5>
                <div className="flex items-end h-32 space-x-2">
                  {marks.map((subject) => {
                    const height = (subject.marks / subject.maxMarks) * 100;
                    return (
                      <div key={subject.id} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t ${
                            subject.grade === 'A+' ? 'bg-yellow-500' :
                            subject.grade === 'A' ? 'bg-green-500' :
                            subject.grade === 'B+' ? 'bg-blue-500' :
                            subject.grade === 'B' ? 'bg-indigo-500' :
                            subject.grade === 'C+' ? 'bg-purple-500' :
                            subject.grade === 'C' ? 'bg-pink-500' :
                            'bg-red-500'
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                          {subject.subject}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Table
            data={marks}
            columns={columns}
            loading={loading}
            emptyMessage="No marks have been published for this term yet."
          />
          {currentSummary && (
             <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Exam Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Marks</p>
                        <p className="text-xl font-bold text-gray-900">{currentSummary.totalMarks} / {currentSummary.maxTotalMarks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Percentage</p>
                        <p className="text-xl font-bold text-blue-600">{currentSummary.percentage}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Overall Grade</p>
                        <p className="text-xl font-bold text-green-600">{currentSummary.grade}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Class Rank</p>
                        <p className="text-xl font-bold text-purple-600">#{currentSummary.rank}</p>
                    </div>
                </div>
                
                {/* Performance Trend */}
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Performance Trend</h5>
                  <div className="h-16 flex items-end space-x-1">
                    {Object.keys(placeholderData).map((examKey) => {
                      const exam = placeholderData[examKey];
                      return (
                        <div key={examKey} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full rounded-t ${
                              selectedExam === examKey ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            style={{ height: `${exam.summary.percentage}%` }}
                          ></div>
                          <span className={`text-xs mt-1 truncate w-full text-center ${
                            selectedExam === examKey ? 'text-blue-600 font-medium' : 'text-gray-500'
                          }`}>
                            {examKey.includes('FINAL') ? 'Final' : 'Mid'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
             </div>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default MyMarks;