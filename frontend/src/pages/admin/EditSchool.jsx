import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Alert from '../../components/ui/Alert';
import { 
  FiSave, 
  FiX, 
  FiUpload,
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiUser,
  FiKey,
  FiLoader
} from 'react-icons/fi';
import { apiHelpers } from '../../api/config';

const EditSchool = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    established_year: '',
    principal_name: '',
    principal_phone: '',
    principal_email: '',
    total_students: '',
    total_teachers: '',
    facilities: '',
    description: '',
    status: 'active'
  });
  
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { hasAnyRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchool();
  }, [id]);

  useEffect(() => {
    // Check if there are any changes
    const changed = Object.keys(formData).some(key => formData[key] !== originalData[key]);
    setHasChanges(changed);
  }, [formData, originalData]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiHelpers.get(`/schools/${id}`);
      const school = response.school;
      
      const schoolData = {
        name: school.name || '',
        code: school.code || '',
        type: school.type || '',
        district: school.district || '',
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
        website: school.website || '',
        established_year: school.established_year || '',
        principal_name: school.principal_name || '',
        principal_phone: school.principal_phone || '',
        principal_email: school.principal_email || '',
        total_students: school.total_students || '',
        total_teachers: school.total_teachers || '',
        facilities: school.facilities || '',
        description: school.description || '',
        status: school.status || 'active'
      };
      
      setFormData(schoolData);
      setOriginalData(schoolData);
      
    } catch (error) {
      console.error('Error fetching school:', error);
      setError('Failed to load school details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'School name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'School code is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'School type is required';
    }
    
    if (!formData.district) {
      newErrors.district = 'District is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.principal_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.principal_email)) {
      newErrors.principal_email = 'Invalid principal email format';
    }
    
    if (formData.established_year && (formData.established_year < 1900 || formData.established_year > new Date().getFullYear())) {
      newErrors.established_year = 'Invalid establishment year';
    }
    
    if (formData.total_students && (formData.total_students < 0 || formData.total_students > 10000)) {
      newErrors.total_students = 'Student count must be between 0 and 10000';
    }
    
    if (formData.total_teachers && (formData.total_teachers < 0 || formData.total_teachers > 1000)) {
      newErrors.total_teachers = 'Teacher count must be between 0 and 1000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        ...formData,
        total_students: formData.total_students ? parseInt(formData.total_students) : null,
        total_teachers: formData.total_teachers ? parseInt(formData.total_teachers) : null,
        established_year: formData.established_year ? parseInt(formData.established_year) : null
      };
      
      await apiHelpers.put(`/schools/${id}`, payload);
      
      setSuccess(true);
      setOriginalData(formData);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating school:', error);
      setError(error.message || 'Failed to update school. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const schoolTypes = [
    { value: 'primary', label: 'Primary School' },
    { value: 'secondary', label: 'Secondary School' },
    { value: 'higher_secondary', label: 'Higher Secondary School' },
    { value: 'college', label: 'College' }
  ];

  const districts = [
    'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar',
    'Birgunj', 'Dharan', 'Butwal', 'Nepalgunj', 'Mahendranagar'
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  if (loading) {
    return (
      <Layout>
        <Layout.Loading text="Loading school details..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.PageHeader
        title="Edit School"
        subtitle={`Update information for ${formData.name}`}
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/schools')}
              icon={<FiX />}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              icon={saving ? <FiLoader className="animate-spin" /> : <FiSave />}
              loading={saving}
              disabled={saving || !hasChanges}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      <Layout.Content>
        {success && (
          <Alert type="success" className="mb-6">
            School updated successfully!
          </Alert>
        )}

        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              <p className="text-sm text-gray-500">Essential details about the school</p>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                  error={errors.name}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Code <span className="text-red-500">*</span>
                </label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter unique school code"
                  error={errors.code}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Type <span className="text-red-500">*</span>
                </label>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  error={errors.type}
                  required
                >
                  <option value="">Select school type</option>
                  {schoolTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  error={errors.district}
                  required
                >
                  <option value="">Select district</option>
                  {districts.map(district => (
                    <option key={district} value={district.toLowerCase()}>
                      {district}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter school address"
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <p className="text-sm text-gray-500">School contact details</p>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter school phone number"
                  icon={<FiPhone />}
                  error={errors.phone}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter school email address"
                  icon={<FiMail />}
                  error={errors.email}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <Input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.schoolname.edu.np"
                  icon={<FiGlobe />}
                />
              </div>
            </div>
          </Card>

          {/* Principal Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Principal Information</h3>
              <p className="text-sm text-gray-500">Details of the school principal</p>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Name
                </label>
                <Input
                  name="principal_name"
                  value={formData.principal_name}
                  onChange={handleInputChange}
                  placeholder="Enter principal name"
                  icon={<FiUser />}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Phone
                </label>
                <Input
                  name="principal_phone"
                  type="tel"
                  value={formData.principal_phone}
                  onChange={handleInputChange}
                  placeholder="Enter principal phone number"
                  icon={<FiPhone />}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal Email
                </label>
                <Input
                  name="principal_email"
                  type="email"
                  value={formData.principal_email}
                  onChange={handleInputChange}
                  placeholder="Enter principal email address"
                  icon={<FiMail />}
                  error={errors.principal_email}
                />
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              <p className="text-sm text-gray-500">Other school details</p>
            </Card.Header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <Input
                  name="established_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.established_year}
                  onChange={handleInputChange}
                  placeholder="e.g., 1980"
                  error={errors.established_year}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Students
                </label>
                <Input
                  name="total_students"
                  type="number"
                  min="0"
                  max="10000"
                  value={formData.total_students}
                  onChange={handleInputChange}
                  placeholder="Enter total number of students"
                  error={errors.total_students}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Teachers
                </label>
                <Input
                  name="total_teachers"
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.total_teachers}
                  onChange={handleInputChange}
                  placeholder="Enter total number of teachers"
                  error={errors.total_teachers}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facilities
                </label>
                <Textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleInputChange}
                  placeholder="List school facilities (e.g., Library, Computer Lab, Sports Ground, etc.)"
                  rows={3}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description about the school"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/schools')}
              icon={<FiX />}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={saving ? <FiLoader className="animate-spin" /> : <FiSave />}
              loading={saving}
              disabled={saving || !hasChanges}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Layout.Content>
    </Layout>
  );
};

export default EditSchool;