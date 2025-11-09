import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Alert from '../ui/Alert';
import examService from '../../services/exam.service';
import subjectService from '../../services/subjects'; // Assuming this exists

const ExamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    examType: 'FINAL',
    startDate: '',
    endDate: '',
    schoolId: '', // This would be set based on user context
    subjects: []
  });

  const examTypes = [
    { value: 'UNIT_TEST', label: 'Unit Test' },
    { value: 'MIDTERM', label: 'Midterm' },
    { value: 'FINAL', label: 'Final' },
    { value: 'PRACTICAL', label: 'Practical' },
    { value: 'PROJECT', label: 'Project' },
    { value: 'ASSIGNMENT', label: 'Assignment' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchExam();
    }
    fetchSubjects();
  }, [id]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const exam = await examService.getExamById(id);
      setFormData({
        name: exam.name,
        code: exam.code,
        description: exam.description || '',
        examType: exam.examType,
        startDate: exam.startDate.split('T')[0], // Format date for input
        endDate: exam.endDate.split('T')[0], // Format date for input
        schoolId: exam.schoolId || '',
        subjects: exam.subjects?.map(subject => ({
          subjectId: subject.subject.id,
          maxMarks: subject.maxMarks,
          minMarks: subject.minMarks,
          examDate: subject.examDate ? subject.examDate.split('T')[0] : '',
          duration: subject.duration || '',
          instructions: subject.instructions || ''
        })) || []
      });
    } catch (err) {
      setError('Failed to fetch exam details');
      console.error('Error fetching exam:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setSubjectLoading(true);
      // This would fetch subjects from the API
      // For now, we'll use mock data
      const mockSubjects = [
        { id: 1, name: 'Mathematics', code: 'MATH101' },
        { id: 2, name: 'Science', code: 'SCI101' },
        { id: 3, name: 'English', code: 'ENG101' },
        { id: 4, name: 'Nepali', code: 'NEP101' },
        { id: 5, name: 'Social Studies', code: 'SOC101' }
      ];
      setSubjects(mockSubjects);
    } catch (err) {
      setError('Failed to fetch subjects');
      console.error('Error fetching subjects:', err);
    } finally {
      setSubjectLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        subjectId: '',
        maxMarks: 100,
        minMarks: 0,
        examDate: '',
        duration: '',
        instructions: ''
      }]
    }));
  };

  const removeSubject = (index) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects.splice(index, 1);
    setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validate dates
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('End date must be after start date');
      }
      
      const examData = {
        ...formData,
        subjects: formData.subjects.filter(subject => subject.subjectId)
      };
      
      if (isEditing) {
        await examService.updateExam(id, examData);
      } else {
        await examService.createExam(examData);
      }
      
      navigate('/exams');
    } catch (err) {
      setError(err.message || (isEditing ? 'Failed to update exam' : 'Failed to create exam'));
      console.error('Error saving exam:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Exam' : 'Create New Exam'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Exam Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Exam Code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
              <Select
                label="Exam Type"
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                options={examTypes}
                required
              />
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Subjects</h3>
                <Button type="button" variant="secondary" onClick={addSubject}>
                  Add Subject
                </Button>
              </div>
              
              {subjectLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.subjects.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No subjects added yet
                    </div>
                  ) : (
                    formData.subjects.map((subject, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Select
                            label="Subject"
                            value={subject.subjectId}
                            onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                            options={[
                              { value: '', label: 'Select Subject' },
                              ...subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))
                            ]}
                            required
                          />
                          <Input
                            label="Max Marks"
                            type="number"
                            value={subject.maxMarks}
                            onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)}
                            min="0"
                          />
                          <Input
                            label="Min Marks"
                            type="number"
                            value={subject.minMarks}
                            onChange={(e) => handleSubjectChange(index, 'minMarks', e.target.value)}
                            min="0"
                          />
                          <Input
                            label="Exam Date"
                            type="date"
                            value={subject.examDate}
                            onChange={(e) => handleSubjectChange(index, 'examDate', e.target.value)}
                          />
                          <Input
                            label="Duration (minutes)"
                            type="number"
                            value={subject.duration}
                            onChange={(e) => handleSubjectChange(index, 'duration', e.target.value)}
                            min="0"
                          />
                        </div>
                        <Textarea
                          label="Instructions"
                          value={subject.instructions}
                          onChange={(e) => handleSubjectChange(index, 'instructions', e.target.value)}
                          rows={2}
                        />
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeSubject(index)}
                          >
                            Remove Subject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                variant="secondary"
                onClick={() => navigate('/exams')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Exam' : 'Create Exam')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ExamForm;