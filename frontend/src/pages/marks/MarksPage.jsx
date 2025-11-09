import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import MarksEntryGrid from '../../components/marks/MarksEntryGrid';
import * as marksService from '../../services/marks';
import * as studentService from '../../services/students';

const MarksPage = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState(['A', 'B', 'C', 'D']);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Initialize with some classes
  useEffect(() => {
    setClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  }, []);

  // Fetch subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectData = await marksService.getSubjects();
        setSubjects(subjectData);
      } catch (err) {
        setError('Failed to load subjects');
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch students and marks when class, section, or subject changes
  useEffect(() => {
    if (selectedClass && selectedSection && selectedSubject) {
      fetchStudentsAndMarks();
    }
  }, [selectedClass, selectedSection, selectedSubject]);

  const fetchStudentsAndMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch students for the selected class and section
      const studentData = await marksService.getStudentsForMarksEntry(selectedClass, selectedSection);
      setStudents(studentData);
      
      // Fetch existing marks for these students and the selected subject
      const marks = await marksService.getMarks(selectedClass, selectedSection, selectedSubject);
      
      // Create a map of studentId -> marks for the selected subject
      const marksMap = new Map();
      marks.forEach(mark => {
        marksMap.set(mark.studentId, mark.marks);
      });
      
      setMarksData(marksMap);
    } catch (err) {
      setError('Failed to load students and marks');
      console.error('Error fetching students and marks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, marks) => {
    setMarksData(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, marks);
      return newMap;
    });
  };

  const handleSaveMarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Convert marksData to the format expected by the API
      const marksToSave = Array.from(marksData.entries()).map(([studentId, marks]) => ({
        studentId,
        subjectId: selectedSubject,
        marks: marks === '' ? null : Number(marks)
      }));
      
      const result = await marksService.saveMarks(marksToSave);
      setSuccess(`Successfully saved marks for ${result.saved} students`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save marks');
      console.error('Error saving marks:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Layout.PageHeader
        title="Marks Entry"
        subtitle="Enter and manage student marks"
      />
      <Layout.Content>
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
        
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Select
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={[
                  { value: '', label: 'Select Class' },
                  ...classes.map(cls => ({ value: cls, label: `Class ${cls}` }))
                ]}
                required
              />
              
              <Select
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={[
                  { value: '', label: 'Select Section' },
                  ...sections.map(sec => ({ value: sec, label: `Section ${sec}` }))
                ]}
                required
              />
              
              <Select
                label="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: '', label: 'Select Subject' },
                  ...subjects.map(sub => ({ value: sub.id, label: sub.name }))
                ]}
                required
              />
              
              <div className="flex items-end">
                <Button
                  variant="primary"
                  onClick={handleSaveMarks}
                  disabled={loading || !selectedClass || !selectedSection || !selectedSubject}
                >
                  {loading ? 'Saving...' : 'Save Marks'}
                </Button>
              </div>
            </div>
            
            {selectedClass && selectedSection && selectedSubject ? (
              <MarksEntryGrid
                students={students}
                marksData={marksData}
                onMarksChange={handleMarksChange}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Please select class, section, and subject to enter marks
              </div>
            )}
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default MarksPage;