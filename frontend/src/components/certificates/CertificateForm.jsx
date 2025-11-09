import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import certificateService from '../../services/certificate.service';

const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    type: '',
    title: '',
    description: '',
    templateId: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const certificateTypes = [
    { value: 'MARKSHEET', label: 'Marksheet' },
    { value: 'TRANSCRIPT', label: 'Transcript' },
    { value: 'PASSING_CERTIFICATE', label: 'Passing Certificate' },
    { value: 'MIGRATION_CERTIFICATE', label: 'Migration Certificate' },
    { value: 'CHARACTER_CERTIFICATE', label: 'Character Certificate' },
    { value: 'COMPLETION_CERTIFICATE', label: 'Completion Certificate' },
    { value: 'ACHIEVEMENT_CERTIFICATE', label: 'Achievement Certificate' },
    { value: 'PARTICIPATION_CERTIFICATE', label: 'Participation Certificate' }
  ];

  useEffect(() => {
    fetchTemplates();
    if (id) {
      fetchCertificate();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const certificateData = await certificateService.getCertificateById(id);
      setCertificate(certificateData);
      setFormData({
        studentId: certificateData.studentId,
        type: certificateData.type,
        title: certificateData.title,
        description: certificateData.description || '',
        templateId: certificateData.templateId || ''
      });
    } catch (err) {
      setError('Failed to fetch certificate');
      console.error('Error fetching certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const templateData = await certificateService.getCertificateTemplates();
      setTemplates(templateData);
    } catch (err) {
      setError('Failed to fetch templates');
      console.error('Error fetching templates:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (id) {
        // Update existing certificate
        await certificateService.updateCertificate(id, formData);
        setSuccess('Certificate updated successfully');
      } else {
        // Create new certificate
        await certificateService.createCertificate(formData);
        setSuccess('Certificate created successfully');
        // Reset form
        setFormData({
          studentId: '',
          type: '',
          title: '',
          description: '',
          templateId: ''
        });
      }
      
      // Redirect to certificates list after a short delay
      setTimeout(() => {
        navigate('/certificates');
      }, 1500);
    } catch (err) {
      setError('Failed to save certificate: ' + (err.response?.data?.message || err.message));
      console.error('Error saving certificate:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {id ? 'Edit Certificate' : 'Create Certificate'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Student ID"
                name="studentId"
                type="number"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
              
              <Select
                label="Certificate Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Type' },
                  ...certificateTypes
                ]}
                required
              />
              
              <Input
                label="Certificate Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              
              <Select
                label="Template"
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select Template' },
                  ...templates.map(template => ({
                    value: template.id,
                    label: template.name
                  }))
                ]}
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/certificates')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (id ? 'Update Certificate' : 'Create Certificate')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
      
      {id && certificate && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Preview</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-gray-500">
                Certificate preview would be displayed here
              </div>
              <div className="mt-4">
                <Button variant="secondary">Preview Certificate</Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CertificateForm;