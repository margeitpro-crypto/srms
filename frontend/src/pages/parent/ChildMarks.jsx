import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';

const ChildMarks = () => {
  const { user } = useAuth();

  // Placeholder data for a parent with multiple children
  const parentData = {
    children: [
      { id: 'child1', name: 'Sita Sharma', grade: 'Grade 8' },
      { id: 'child2', name: 'Gita Sharma', grade: 'Grade 5' },
    ],
    marks: {
      child1: {
        FINAL_2024: {
          examName: 'Final Term Examination 2024',
          results: [
            { id: 1, subject: 'English', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
            { id: 2, subject: 'Mathematics', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Outstanding' },
            { id: 3, subject: 'Science', marks: 78, maxMarks: 100, grade: 'B+', remarks: 'Very Good' },
          ],
          summary: { totalMarks: 255, maxTotalMarks: 300, percentage: 85, grade: 'A', rank: 5 },
        },
        MIDTERM_2024: {
          examName: 'Mid-Term Examination 2024',
          results: [
            { id: 1, subject: 'English', marks: 75, maxMarks: 100, grade: 'B+', remarks: 'Good' },
            { id: 2, subject: 'Mathematics', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Excellent' },
            { id: 3, subject: 'Science', marks: 72, maxMarks: 100, grade: 'B', remarks: 'Good' },
          ],
          summary: { totalMarks: 235, maxTotalMarks: 300, percentage: 78.3, grade: 'B+', rank: 8 },
        },
      },
      child2: {
        FINAL_2024: {
          examName: 'Final Term Examination 2024',
          results: [
            { id: 1, subject: 'Art', marks: 95, maxMarks: 100, grade: 'A+', remarks: 'Creative' },
            { id: 2, subject: 'Music', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Melodious' },
          ],
          summary: { totalMarks: 180, maxTotalMarks: 200, percentage: 90, grade: 'A', rank: 3 },
        },
      },
    }
  };

  const [selectedChildId, setSelectedChildId] = useState(parentData.children[0].id);
  const [selectedExam, setSelectedExam] = useState('FINAL_2024');
  const [marksData, setMarksData] = useState({ results: [], summary: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildMarks = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const childMarks = parentData.marks[selectedChildId];
        const examMarks = childMarks ? childMarks[selectedExam] : null;
        setMarksData({
          results: examMarks?.results || [],
          summary: examMarks?.summary || null
        });
        setLoading(false);
      }, 500);
    };

    if (user && selectedChildId) {
      fetchChildMarks();
    }
  }, [user, selectedChildId, selectedExam]);

  const columns = [
    { key: 'subject', title: 'Subject', sortable: true },
    { key: 'marks', title: 'Marks Obtained', render: (value, row) => `${value} / ${row.maxMarks}` },
    { key: 'grade', title: 'Grade' },
    { key: 'remarks', title: 'Remarks' },
  ];

  const availableExams = parentData.marks[selectedChildId] ? Object.keys(parentData.marks[selectedChildId]) : [];

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
      'Art': 80,
      'Music': 72
    };
    return averages[subject] || 75;
  };

  return (
    <Layout>
      <Layout.PageHeader
        title="Child's Marks"
        subtitle="View your child's academic performance."
      />
      <Layout.Content>
        <Card>
          <div className="p-6 border-b border-gray-200 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <label htmlFor="child-select" className="block text-sm font-medium text-gray-700">
                    Viewing Results For
                </label>
                <select
                    id="child-select"
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="mt-1 block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {parentData.children.map(child => (
                    <option key={child.id} value={child.id}>
                        {child.name} ({child.grade})
                    </option>
                    ))}
                </select>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
               <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700">
                    Exam Term
                </label>
              <select
                id="exam-select"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="mt-1 block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {availableExams.length > 0 ? (
                  availableExams.map(examKey => (
                    <option key={examKey} value={examKey}>
                      {parentData.marks[selectedChildId][examKey].examName}
                    </option>
                  ))
                ) : (
                  <option disabled>No exams found</option>
                )}
              </select>
            </div>
          </div>
          
          {/* Performance Visualization */}
          {marksData.results.length > 0 && !loading && (
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Subject-wise Performance</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart Representation */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Marks Comparison</h5>
                  <div className="space-y-4">
                    {marksData.results.map((subject) => {
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
                            <span>Child's Performance</span>
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
                    {marksData.results.map((subject) => {
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
          )}
          
          <Table
            data={marksData.results}
            columns={columns}
            loading={loading}
            emptyMessage="No marks have been published for this child and term yet."
          />
          {marksData.summary && !loading && (
             <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Exam Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Total Marks</p>
                        <p className="text-xl font-bold text-gray-900">{marksData.summary.totalMarks} / {marksData.summary.maxTotalMarks}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Percentage</p>
                        <p className="text-xl font-bold text-blue-600">{marksData.summary.percentage}%</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Overall Grade</p>
                        <p className="text-xl font-bold text-green-600">{marksData.summary.grade}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Class Rank</p>
                        <p className="text-xl font-bold text-purple-600">#{marksData.summary.rank}</p>
                    </div>
                </div>
                
                {/* Performance Trend */}
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Performance Trend</h5>
                  <div className="h-16 flex items-end space-x-1">
                    {Object.keys(parentData.marks[selectedChildId] || {}).map((examKey) => {
                      const exam = parentData.marks[selectedChildId][examKey];
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

export default ChildMarks;